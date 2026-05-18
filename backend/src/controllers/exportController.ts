import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Lacey Act plant data table (US requirement)
interface LaceyActEntry {
  genus: string;
  species: string;
  commonName: string;
  countryOfHarvest: string;
  quantityAndUnit: string;
  valueUSD: number;
}

// GET /api/export/lacey-act/:orderId
export const generateLaceyActDeclaration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('buyer', 'fullName company address')
      .populate('seller', 'fullName company exportLicenseNumber')
      .populate('items.product', 'title species category origin laceyActCompliant flegtLicenseNumber');

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (!order.exportCompliance.isExport) {
      res.status(400).json({ error: 'Not an export order' });
      return;
    }

    // Map wood species to scientific names (real app would use a DB of Ghanaian species)
    const speciesMap: Record<string, { genus: string; species: string }> = {
      'odum': { genus: 'Milicia', species: 'excelsa' },
      'iroko': { genus: 'Milicia', species: 'excelsa' },
      'wawa': { genus: 'Triplochiton', species: 'scleroxylon' },
      'mahogany': { genus: 'Khaya', species: 'ivorensis' },
      'teak': { genus: 'Tectona', species: 'grandis' },
      'bamboo': { genus: 'Bambusa', species: 'vulgaris' },
      'edinam': { genus: 'Entandrophragma', species: 'angolense' },
      'sapele': { genus: 'Entandrophragma', species: 'cylindricum' },
    };

    const laceyEntries: LaceyActEntry[] = order.items.map((item: any) => {
      const speciesLower = item.species?.toLowerCase() || '';
      const scientific = speciesMap[speciesLower] || { genus: 'Unknown', species: 'spp.' };

      return {
        genus: scientific.genus,
        species: scientific.species,
        commonName: item.species || 'Tropical Hardwood',
        countryOfHarvest: 'Ghana',
        quantityAndUnit: `${item.quantity} ${item.product?.unit || 'm³'}`,
        valueUSD: item.subtotal,
      };
    });

    // Generate PDF
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=lacey-act-${order.orderNumber}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(18).font('Helvetica-Bold').text('LACEY ACT PLANT AND PLANT PRODUCT DECLARATION', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('United States Department of Agriculture (USDA)', { align: 'center' });
    doc.text('Form PPQ 505 — Importation of Plants and Plant Products', { align: 'center' });
    doc.moveDown(2);

    // Importer Info
    doc.fontSize(12).font('Helvetica-Bold').text('IMPORTER / DECLARANT INFORMATION');
    doc.font('Helvetica');
    const buyer = order.buyer as any;
    doc.text(`Name: ${buyer.fullName}`);
    doc.text(`Company: ${buyer.company || 'N/A'}`);
    doc.text(`Address: ${buyer.address || 'N/A'}`);
    doc.moveDown();

    // Order Info
    doc.font('Helvetica-Bold').text('SHIPMENT INFORMATION');
    doc.font('Helvetica');
    doc.text(`WoodTrade Order #: ${order.orderNumber}`);
    doc.text(`Destination Country: United States of America`);
    doc.text(`Country of Harvest: Ghana`);
    doc.text(`Date: ${new Date().toLocaleDateString('en-US')}`);
    doc.moveDown();

    // Plant Data Table
    doc.font('Helvetica-Bold').text('PLANT DATA TABLE');
    doc.moveDown(0.5);

    laceyEntries.forEach((entry, i) => {
      doc.font('Helvetica-Bold').text(`Item ${i + 1}:`, { continued: true });
      doc.font('Helvetica').text(` ${entry.commonName}`);
      doc.text(`  Scientific Name: ${entry.genus} ${entry.species}`);
      doc.text(`  Country of Harvest: ${entry.countryOfHarvest}`);
      doc.text(`  Quantity: ${entry.quantityAndUnit}`);
      doc.text(`  Value (USD): $${entry.valueUSD.toFixed(2)}`);
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.font('Helvetica-Bold').text('DECLARATION');
    doc.font('Helvetica').text(
      'I certify that to the best of my knowledge and belief the information on this form is true and correct. ' +
      'I understand that making a false declaration is a violation of U.S. law (18 U.S.C. § 1001) and that ' +
      'plant products imported in violation of the Lacey Act (16 U.S.C. §§ 3371-3378) may be subject to ' +
      'civil and/or criminal penalties.'
    );

    doc.moveDown(2);
    doc.text('Signature: _______________________________   Date: ________________');
    doc.text('Printed Name: _______________________________');

    doc.end();

    // Update compliance record
    await Order.findByIdAndUpdate(req.params.orderId, {
      'exportCompliance.laceyActDeclarationGenerated': true,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/export/commercial-invoice/:orderId
export const generateCommercialInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('buyer', 'fullName company address email phone')
      .populate('seller', 'fullName company address email phone exportLicenseNumber')
      .populate('items.product', 'title species category');

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
    doc.pipe(res);

    const buyer = order.buyer as any;
    const seller = order.seller as any;

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('COMMERCIAL INVOICE', { align: 'center' });
    doc.moveDown();

    // Parties
    doc.fontSize(11).font('Helvetica-Bold').text('EXPORTER (SELLER):');
    doc.font('Helvetica');
    doc.text(seller.fullName || seller.company);
    doc.text(`Export License: ${seller.exportLicenseNumber || 'N/A'}`);
    doc.text('Ghana');
    doc.moveDown();

    doc.font('Helvetica-Bold').text('IMPORTER (BUYER):');
    doc.font('Helvetica');
    doc.text(buyer.fullName || buyer.company);
    doc.text(buyer.email);
    doc.moveDown();

    // Order details
    doc.font('Helvetica-Bold').text(`Invoice Number: ${order.orderNumber}`);
    doc.font('Helvetica').text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Currency: ${order.currency}`);
    doc.moveDown();

    // Items table
    doc.font('Helvetica-Bold');
    doc.text('Description', 50, doc.y, { width: 200, continued: false });

    order.items.forEach((item: any, i) => {
      const y = doc.y;
      doc.font('Helvetica');
      doc.text(`${i + 1}. ${item.product?.title || item.species}`, 50, y);
      doc.text(`Qty: ${item.quantity}  |  Unit Price: ${order.currency} ${item.unitPrice.toFixed(2)}`);
      doc.text(`Subtotal: ${order.currency} ${item.subtotal.toFixed(2)}`);
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.font('Helvetica-Bold').text(`Subtotal: ${order.currency} ${order.subtotal.toFixed(2)}`);
    doc.text(`Tax (VAT 12.5%): ${order.currency} ${order.taxAmount.toFixed(2)}`);
    doc.text(`Shipping: ${order.currency} ${order.shippingCost.toFixed(2)}`);
    doc.fontSize(14).text(`TOTAL: ${order.currency} ${order.totalAmount.toFixed(2)}`);

    doc.end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/export/compliance-status/:orderId
export const getComplianceStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.orderId)
      .select('exportCompliance orderNumber status');

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const completed = order.exportCompliance.complianceChecklist.filter((c) => c.completed).length;
    const total = order.exportCompliance.complianceChecklist.length;

    res.json({
      orderNumber: order.orderNumber,
      isExport: order.exportCompliance.isExport,
      complianceProgress: `${completed}/${total}`,
      percentComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
      checklist: order.exportCompliance.complianceChecklist,
      laceyActReady: order.exportCompliance.laceyActDeclarationGenerated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/export/compliance/:orderId/checklist
export const updateComplianceItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { item, completed, documentUrl } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const checklistItem = order.exportCompliance.complianceChecklist.find(
      (c) => c.item === item
    );

    if (!checklistItem) {
      res.status(404).json({ error: 'Checklist item not found' });
      return;
    }

    checklistItem.completed = completed;
    if (completed) checklistItem.completedAt = new Date();

    await order.save();

    res.json({ message: 'Compliance item updated', checklist: order.exportCompliance.complianceChecklist });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

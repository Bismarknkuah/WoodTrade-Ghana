import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '../components/ui/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'WoodTrade Ghana — Premium Wood Marketplace',
  description: "Ghana's #1 verified wood marketplace. Source timber, bamboo, plywood, and engineered wood with full traceability and export compliance.",
  keywords: 'Ghana wood, timber export, bamboo, plywood, FLEGT, Lacey Act, wood marketplace',
  openGraph: {
    title: 'WoodTrade Ghana',
    description: "Ghana's Premium Wood Marketplace",
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-stone-50 text-stone-900 font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <footer className="bg-wood-dark text-stone-300 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">WoodTrade Ghana</h3>
              <p className="text-sm leading-relaxed">Ghana&apos;s trusted digital marketplace connecting verified wood suppliers with local and international buyers.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/catalog?category=timber" className="hover:text-amber-400 transition-colors">Timber</a></li>
                <li><a href="/catalog?category=bamboo" className="hover:text-amber-400 transition-colors">Bamboo</a></li>
                <li><a href="/catalog?category=plywood" className="hover:text-amber-400 transition-colors">Plywood</a></li>
                <li><a href="/catalog?category=engineered_wood" className="hover:text-amber-400 transition-colors">Engineered Wood</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/sell" className="hover:text-amber-400 transition-colors">Become a Seller</a></li>
                <li><a href="/sell#compliance" className="hover:text-amber-400 transition-colors">License Requirements</a></li>
                <li><a href="/sell#export" className="hover:text-amber-400 transition-colors">Export Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Compliance</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/compliance/lacey-act" className="hover:text-amber-400 transition-colors">Lacey Act (USA)</a></li>
                <li><a href="/compliance/eudr" className="hover:text-amber-400 transition-colors">EUDR (Europe)</a></li>
                <li><a href="/compliance/flegt" className="hover:text-amber-400 transition-colors">FLEGT License</a></li>
                <li><a href="/compliance/ghana" className="hover:text-amber-400 transition-colors">Ghana TIDD</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-stone-700 text-sm text-center">
            © {new Date().getFullYear()} WoodTrade Ghana. Promoting legal and sustainable timber trade.
          </div>
        </footer>
      </body>
    </html>
  );
}

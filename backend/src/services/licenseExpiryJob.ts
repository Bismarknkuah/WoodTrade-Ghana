import cron from 'node-cron';
import User, { IUser } from '../models/User';
import { sendLicenseExpiryWarning, sendAdminAlert } from './emailService';
import { Document, Types } from 'mongoose';

type UserDocument = Document<unknown, {}, IUser> &
  IUser &
  Required<{ _id: Types.ObjectId }> & { __v: number };

/**
 * Runs daily at 8:00 AM Ghana time (UTC+0).
 * Checks for licenses expiring in 30, 14, or 7 days and sends warnings.
 * Also suspends sellers with expired licenses.
 */
export function startLicenseExpiryJob(): void {
  // Every day at 08:00 UTC
  cron.schedule('0 8 * * *', async () => {
    console.log('[LicenseJob] Running daily license expiry check…');

    const now = new Date();
    const warningDays = [30, 14, 7];

    try {
      // Find all sellers/manufacturers/resellers with active licenses
      const users = await User.find({
        role: { $in: ['seller', 'manufacturer', 'reseller'] },
        'licenses.0': { $exists: true },
      }) as UserDocument[];

      let warned = 0;
      let suspended = 0;

      for (const user of users) {
        const userName: string = (user as any).name ?? user.email ?? 'Unknown';

        for (const license of user.licenses) {
          if (!license.expiryDate) continue;

          const msLeft = new Date(license.expiryDate).getTime() - now.getTime();
          const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

          // Expired → suspend
          if (daysLeft <= 0 && license.status === 'approved') {
            license.status = 'expired';
            suspended++;
            await sendAdminAlert(
              `License Expired – ${userName}`,
              `Seller <strong>${userName}</strong> (${user.email}) has an expired <strong>${license.type}</strong>. Their listings have been suspended.`
            );
          }

          // Warning thresholds
          if (warningDays.includes(daysLeft) && license.status === 'approved') {
            await sendLicenseExpiryWarning(
              user.email,
              userName,
              license.type,
              new Date(license.expiryDate),
              daysLeft
            );
            warned++;
          }
        }

        await user.save();
      }

      console.log(
        `[LicenseJob] Done. Warned: ${warned}, Suspended: ${suspended}`
      );
    } catch (err) {
      console.error('[LicenseJob] Error:', err);
    }
  });

  console.log('[LicenseJob] Daily license expiry job scheduled (08:00 UTC)');
}
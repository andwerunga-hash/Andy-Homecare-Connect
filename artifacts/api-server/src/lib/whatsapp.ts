import { logger } from "./logger";

/**
 * Send a WhatsApp message via Meta WhatsApp Cloud API.
 * Requires WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID env vars.
 * If not configured, logs a warning and skips silently.
 */
export async function sendWhatsApp(to: string, message: string): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    logger.warn("WhatsApp not configured — skipping notification");
    return;
  }

  // Normalise to E.164 Kenya format (254XXXXXXXXX)
  const digits = to.replace(/\D/g, "");
  const phone = digits.startsWith("254")
    ? digits
    : digits.startsWith("0")
    ? `254${digits.slice(1)}`
    : `254${digits}`;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      logger.error({ status: res.status, body }, "WhatsApp API error");
    } else {
      logger.info({ to: phone }, "WhatsApp notification sent");
    }
  } catch (err) {
    logger.error({ err }, "Failed to send WhatsApp notification");
  }
}

/** Notify the admin of a new registration */
export function notifyAdminNewUser(
  adminPhone: string,
  userName: string,
  role: string,
  county: string
): Promise<void> {
  const msg =
    `🟢 *New Registration — Andy Homecare Connect*\n\n` +
    `Name: ${userName}\n` +
    `Role: ${role === "housekeeper" ? "House Help" : "Employer"}\n` +
    `County: ${county}\n\n` +
    `Login to /admin to review and approve their profile.`;
  return sendWhatsApp(adminPhone, msg);
}

/** Notify the admin of a new payment submission */
export function notifyAdminPayment(
  adminPhone: string,
  userName: string,
  mpesaCode: string,
  amount: number
): Promise<void> {
  const msg =
    `💳 *Payment Received — Andy Homecare Connect*\n\n` +
    `From: ${userName}\n` +
    `Mpesa Code: ${mpesaCode}\n` +
    `Amount: Ksh ${amount}\n\n` +
    `Verify the payment and approve their profile at /admin.`;
  return sendWhatsApp(adminPhone, msg);
}

/** Notify the user their profile was approved */
export function notifyUserApproved(userPhone: string, userName: string): Promise<void> {
  const msg =
    `✅ *Profile Approved — Andy Homecare Connect*\n\n` +
    `Congratulations ${userName}! Your profile has been verified and is now live.\n\n` +
    `Families and employers can now see your full profile and contact you directly.\n\n` +
    `Visit the platform to view your listing: andyhomecare.co.ke`;
  return sendWhatsApp(userPhone, msg);
}

/** Notify the user their profile was rejected */
export function notifyUserRejected(userPhone: string, userName: string): Promise<void> {
  const msg =
    `❌ *Profile Review — Andy Homecare Connect*\n\n` +
    `Dear ${userName}, we were unable to verify your Mpesa payment.\n\n` +
    `Please ensure you paid Ksh 250 to Paybill 542542, Account 22703, ` +
    `then submit your correct Mpesa transaction code at andyhomecare.co.ke/payment.\n\n` +
    `For help, please contact our support team.`;
  return sendWhatsApp(userPhone, msg);
}

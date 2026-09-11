export type EmailNotification = {
  to: string;
  subject: string;
  type: "welcome" | "order_confirmation" | "order_status" | "points_earned" | "newsletter";
  data: Record<string, string | number | boolean>;
};

export async function sendEmailNotification(
  notification: EmailNotification
): Promise<{ success: boolean; error?: string }> {
  // Development/fallback: log instead of sending
  if (process.env.NODE_ENV === "development" || !process.env.SENDGRID_API_KEY) {
    console.log("[EMAIL NOTIFICATION - DEV MODE]", {
      to: notification.to,
      subject: notification.subject,
      type: notification.type,
      data: notification.data,
    });
    return { success: true };
  }

  try {
    // In production, integrate with SendGrid, Resend, or similar
    // Example structure for future implementation:
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}` },
    //   body: JSON.stringify({ ... })
    // });

    console.log("[EMAIL NOTIFICATION]", notification.subject, "to:", notification.to);
    return { success: true };
  } catch (error) {
    console.error("Failed to send email notification:", error);
    return { success: false, error: "Gagal mengirim notifikasi email" };
  }
}

export async function notifyWelcome(
  email: string,
  fullName: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailNotification({
    to: email,
    subject: "Selamat Datang di Batik Arunika!",
    type: "welcome",
    data: { fullName },
  });
}

export async function notifyOrderConfirmation(
  email: string,
  orderId: string,
  customerName: string,
  orderTotal: number
): Promise<{ success: boolean; error?: string }> {
  return sendEmailNotification({
    to: email,
    subject: `Pesanan Anda #${orderId.slice(0, 8)} Dikonfirmasi`,
    type: "order_confirmation",
    data: { orderId, customerName, orderTotal },
  });
}

export async function notifyOrderStatus(
  email: string,
  orderId: string,
  status: string,
  customerName: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailNotification({
    to: email,
    subject: `Update Status Pesanan #${orderId.slice(0, 8)}: ${status}`,
    type: "order_status",
    data: { orderId, status, customerName },
  });
}

export async function notifyPointsEarned(
  email: string,
  customerName: string,
  pointsAwarded: number,
  currentPoints: number
): Promise<{ success: boolean; error?: string }> {
  return sendEmailNotification({
    to: email,
    subject: `Anda Telah Mendapatkan ${pointsAwarded} Poin Loyalitas!`,
    type: "points_earned",
    data: { customerName, pointsAwarded, currentPoints },
  });
}

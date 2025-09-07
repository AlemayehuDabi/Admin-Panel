import { Resend } from "resend";
import { resetEmailHtml, resetEmailText } from "./emailTemplates/resetPasswordTemplates";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL as string,
            to,
            subject,
            html,
        });

        if (error) {
            console.error("Resend error:", error);
            throw new Error("Failed to send email");
        }

        console.log("Email sent:", data?.id);
        return data;
    } catch (err) {
        console.error("Unexpected email error:", err);
        throw err;
    }
};

export const sendResetEmail = async (email: string, code: string) => {
  try {
    await resend.emails.send({
      from: "noreply@yourdomain.com", // must be verified in Resend
      to: email,
      subject: "Password Reset Code",
      html: resetEmailHtml(code, {
        appName: "InternFinder", // your app name
        supportEmail: "support@internfinder.com", // your support
        brandColor: "#16a34a", // optional brand color
        logoUrl: "https://yourcdn.com/logo.png", // optional logo
      }),
      text: resetEmailText(code, "InternFinder"),
    });
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error("Failed to send reset email");
  }
};


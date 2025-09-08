import { Resend } from "resend";
import { ENV } from "../config/env";
import { resetEmailHtml, resetEmailText } from "./emailTemplates/resetPasswordTemplates";

const resend = new Resend(ENV.RESEND_API_KEY);
const fromEmail = ENV.FROM_EMAIL || ""

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: fromEmail,
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
      from: fromEmail, 
      to: email,
      subject: "Password Reset Code",
      html: resetEmailHtml(code, {
        appName: "Hulu Constructions", // your app name
        supportEmail: "support@hulconst.com", // your support
        brandColor: "#ffffffff", // optional brand color
        logoUrl: "https://simbatech.et/assets/logo-M8d1WI2n.png", // optional logo
      }),
      text: resetEmailText(code, "Hulu Constructions"),
    });
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error("Failed to send reset email");
  }
};


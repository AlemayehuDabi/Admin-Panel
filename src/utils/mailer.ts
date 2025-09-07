import { Resend } from "resend";

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

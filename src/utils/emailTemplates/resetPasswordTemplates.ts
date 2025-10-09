// emailTemplates.ts
export function resetEmailHtml(
  code: string,
  opts?: {
    appName?: string;
    logoUrl?: string;
    supportEmail?: string;
    brandColor?: string; // hex or css color
  }
) {
  const appName = opts?.appName ?? "YourApp";
  const supportEmail = opts?.supportEmail ?? "support@yourdomain.com";
  const brand = opts?.brandColor ?? "#3b82f6"; // default blue
  const logoUrl = opts?.logoUrl ?? "https://simbatech.et/assets/logo-M8d1WI2n.png";

  // split the code into styled boxes
  const codeBoxes = code
    .toString()
    .padStart(6, "0")
    .split("")
    .map(
      (c) => `
      <td style="background:#1e3a8a;border:2px solid ${brand};border-radius:10px;
                width:50px;height:60px;text-align:center;
                font-size:22px;font-weight:700;color:#ffffff;">
        ${c}
      </td>
      <td width="10"></td>`
    )
    .join("");

  // fallback plain text code
  const plainCode = code.toString().padStart(6, "0");

  // hidden preheader text (better open rates)
  const preheader = "Use this 6-digit code to reset your password. It expires in 10 minutes.";

  return `
<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${appName} – Password Reset</title>
</head>
<body style="margin:0;padding:0;background:#0a1f44;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
  <span style="display:none !important;">${preheader}</span>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background:#0a1f44;padding:20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#0f2557;border-radius:16px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.25);">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding:24px 20px 10px;">
              <img src="${logoUrl}" alt="${appName}" style="display:block;border:0;max-height:60px;">
            </td>
          </tr>
          
          <!-- Title -->
          <tr>
            <td align="center" style="padding:0 20px;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Reset your password</h1>
              <p style="margin:12px 0 0;font-size:14px;color:#d1d5db;line-height:1.6;">
                Use the code below to continue.<br>
                <b>It expires in 10 minutes.</b>
              </p>
            </td>
          </tr>
          
          <!-- Code Boxes -->
          <tr>
            <td align="center" style="padding:20px 20px 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  ${codeBoxes}
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Plain Code (fallback) -->
          <tr>
            <td align="center" style="padding:12px 20px;">
              <p style="background:#162f6a;color:#ffffff;font-size:18px;letter-spacing:3px;font-weight:600;border-radius:8px;padding:12px 16px;margin:0;display:inline-block;">
                ${plainCode}
              </p>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding:10px 20px 30px;">
              <a href="https://yourapp.com" 
                 style="display:inline-block;background:linear-gradient(90deg,#2563eb,#2563eb);color:#ffffff;text-decoration:none;
                        padding:14px 24px;border-radius:12px;font-size:15px;font-weight:600;">
                Open ${appName}
              </a>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding:0 20px;">
              <hr style="border:none;border-top:1px solid ${brand};margin:0;">
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Didn’t request this? You can safely ignore this email.
              </p>
              <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">
                Need help? Contact <a href="mailto:${supportEmail}" style="color:${brand};text-decoration:none;">${supportEmail}</a>.
              </p>
              <p style="margin:16px 0 0;font-size:11px;color:#6b7280;">
                © ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}


export function resetEmailText(code: string, appName = "YourApp") {
  return `Reset your ${appName} password

Your verification code: ${code}
(This code expires in 10 minutes.)

If you didn’t request this, you can ignore this message.
`;
}

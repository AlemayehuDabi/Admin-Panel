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
  const brand = opts?.brandColor ?? "#4f46e5"; // indigo-600
  const logoUrl = opts?.logoUrl ?? ""; // optional

  const codeBoxes = code
    .toString()
    .padStart(6, "0")
    .split("")
    .map(
      (c) => `
      <div style="width:42px;height:52px;border:1px solid #e5e7eb;border-radius:10px;
                  display:flex;align-items:center;justify-content:center;
                  font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
                  font-size:22px;letter-spacing:1px;">
        ${c}
      </div>`
    )
    .join("");

  // hidden preheader text (improves open rates)
  const preheader =
    "Use this 6-digit code to reset your password. It expires in 10 minutes.";

  return `
<!DOCTYPE html>
<html lang="en" style="background:#f6f7fb;">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${appName} – Password Reset</title>
  <style>
    @media (max-width: 480px) {
      .card { padding:20px !important; }
      .codeRow { gap:8px !important; }
      .ctaBtn { width:100% !important; }
    }
    @media (prefers-color-scheme: dark) {
      .bg { background:#0b0c10 !important; }
      .card { background:#111317 !important; color:#e5e7eb !important; }
      .muted { color:#9aa4b2 !important; }
      .box { border-color:#1f2430 !important; }
    }
  </style>
</head>
<body class="bg" style="margin:0;padding:0;background:#f6f7fb;">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">
    ${preheader}
  </span>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background:#f6f7fb;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;">
          <tr>
            <td align="center" style="padding:16px 0 8px;">
              ${
                logoUrl
                  ? `<img src="${logoUrl}" alt="${appName}" height="36" style="display:block;border:0;outline:none;text-decoration:none;">`
                  : `<div style="font:700 20px/1.2 ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111827;">${appName}</div>`
              }
            </td>
          </tr>

          <tr>
            <td class="card" style="background:#ffffff;border-radius:16px;padding:28px;box-shadow:0 6px 18px rgba(17,24,39,0.06);">
              <h1 style="margin:0 0 8px;font:700 22px/1.25 ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111827;">
                Reset your password
              </h1>
              <p style="margin:0 0 16px;font:400 14px/1.6 ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#374151;">
                Use the code below to continue. <b>It expires in 10 minutes.</b>
              </p>

              <div class="codeRow" style="display:flex;gap:10px;justify-content:center;margin:20px 0 8px;">
                ${codeBoxes}
              </div>

              <!-- Copy-friendly plain code -->
              <p style="text-align:center;margin:0 0 18px;">
                <code style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:8px;padding:10px 14px;display:inline-block;
                             font:600 18px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; letter-spacing:2px;">
                  ${code}
                </code>
              </p>

              <a href="#" style="display:inline-block;text-decoration:none;background:${brand};color:#ffffff;padding:12px 18px;border-radius:12px;
                                  font:600 14px ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;"
                 class="ctaBtn">
                Open ${appName}
              </a>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">

              <p class="muted" style="margin:0 0 6px;font:400 12px/1.6 ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#6b7280;">
                Didn’t request this? You can safely ignore this email. Someone might have entered your email by mistake.
              </p>
              <p class="muted" style="margin:0;font:400 12px/1.6 ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#6b7280;">
                Need help? Contact <a href="mailto:${supportEmail}" style="color:${brand};text-decoration:none;">${supportEmail}</a>.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:16px 8px 0;">
              <p class="muted" style="margin:0;font:400 11px/1.6 ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#9ca3af;">
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

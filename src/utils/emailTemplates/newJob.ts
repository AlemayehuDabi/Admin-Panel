export const newJobEmail = (
  job: {
    title: string;
    description: string;
    requiredSkills: string[];
    jobLocation?: string;
    payRate?: number;
    jobType?: string;
    startDate?: Date;
    duration?: Date;
    additionalInfo?: string;
  },
  companyName: string
) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Job Alert - Hulu</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;color:#333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <!-- Header -->
            <tr>
              <td align="center" style="background:#1a73e8;padding:20px;">
                <h1 style="color:#ffffff;margin:0;font-size:24px;">🚀 New Job Posted on Hulu</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">
                <h2 style="margin-top:0;">${job.title}</h2>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Location:</strong> ${job.jobLocation || "Not specified"}</p>
                <p><strong>Pay Rate:</strong> $${job.payRate?.toFixed(2) || "Not specified"}</p>
                <p><strong>Job Type:</strong> ${job.jobType || "Not specified"}</p>
                <p><strong>Start Date:</strong> ${job.startDate?.toDateString() || "Not specified"}</p>
                <p><strong>Duration:</strong> ${job.duration?.toDateString() || "Not specified"}</p>

                <h3>About the Job</h3>
                <p>${job.description}</p>

                <h3>Required Skills</h3>
                <ul>
                  ${job.requiredSkills.map((skill) => `<li>${skill}</li>`).join("")}
                </ul>

                ${
                  job.additionalInfo
                    ? `<h3>Additional Information</h3><p>${job.additionalInfo}</p>`
                    : ""
                }

                <div style="text-align:center;margin-top:30px;">
                  <a href="https://hulu.jobs/apply/${encodeURIComponent(
                    job.title
                  )}" 
                     style="display:inline-block;background:#1a73e8;color:#ffffff;text-decoration:none;
                     padding:12px 25px;border-radius:6px;font-size:16px;font-weight:bold;">
                    Apply Now
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9f9f9;padding:20px;text-align:center;font-size:12px;color:#777;">
                <p>You are receiving this email because you subscribed to job alerts on <strong>Hulu</strong>.</p>
                <p><a href="https://hulu.jobs/unsubscribe" style="color:#1a73e8;">Unsubscribe</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

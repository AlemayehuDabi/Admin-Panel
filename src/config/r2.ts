import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "./env";

const r2 = new S3Client({
  region: "auto", // R2 doesn’t need AWS regions
  endpoint: ENV.R2_ENDPOINT, // R2 endpoint
  credentials: {
    accessKeyId: ENV.R2_ACCESS_KEY_ID!,
    secretAccessKey: ENV.R2_SECRET_ACCESS_KEY!,
  },
});

export default r2;

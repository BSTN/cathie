import { S3 } from "@aws-sdk/client-s3";

const s3Client = new S3({
  forcePathStyle: false,
  endpoint: process.env.S3,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.keyid || "",
    secretAccessKey: process.env.secret || "",
  },
});

export { s3Client };

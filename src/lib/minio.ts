import { Client } from "minio";

export const s3Client = new Client({
  endPoint: process.env.S3_ENDPOINT as string,
  port: Number.parseInt(process.env.S3_PORT as string, 10),
  useSSL: (process.env.S3_USE_SSL as string) === "true",
  accessKey: process.env.S3_ACCESS_KEY as string,
  secretKey: process.env.S3_SECRET_KEY as string,
});

export async function createBucketIfNotExists(bucketName: string) {
  const exists = await s3Client.bucketExists(bucketName);
  if (!exists) {
    await s3Client.makeBucket(bucketName, "us-east-1");
  }
}

export async function getSignedAvatarUrl(
  objectName: string,
): Promise<string | null> {
  if (!objectName) return null;
  const expirySeconds = 60 * 60;
  try {
    const url = await s3Client.presignedGetObject(
      "avatars",
      objectName,
      expirySeconds,
    );
    return url;
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return null;
  }
}
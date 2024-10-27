import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const createS3Bucket = async (bucketName: string) => {
  try {
    const bucketParams = {
      Bucket: bucketName,
    };

    const data = await s3Client.send(new CreateBucketCommand(bucketParams));
    console.log("Bucket Created Successfully", data.Location);
  } catch (err) {
    console.error("Error", err);
  }
};

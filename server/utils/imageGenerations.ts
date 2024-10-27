import { bucketName, HfKey, s3Client } from "./keys";
import fs from "fs";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

type S3UploadResult = string | null;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response | null> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    } else if (response.status === 429) {
      const delayMs = Math.pow(2, i) * 1000;
      console.warn(`Rate limited. Retrying in ${delayMs / 1000} seconds...`);
      await delay(delayMs);
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }
  console.error("Exceeded retries due to rate limits.");
  return null;
}

export async function stabilityAiGenerations(
  data: string
): Promise<S3UploadResult> {
  try {
    const response = await fetchWithRetry(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
      {
        headers: {
          Authorization: `Bearer ${HfKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }
    );

    if (!response) {
      console.error("Image generation failed after retries.");
      return null;
    }

    const result = await response.blob();
    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueFilename = `generated-image-${uuidv4()}.jpg`;
    const folderPath = path.resolve("training-data");
    const filePath = path.join(folderPath, uniqueFilename);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(filePath, buffer);

    const fileContent = await fs.promises.readFile(filePath);

    const s3Key = `app-data/${uniqueFilename}`;
    const params = {
      Bucket: bucketName,
      Key: s3Key,
      Body: fileContent,
    };

    await s3Client.send(new PutObjectCommand(params));

    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    fs.unlinkSync(filePath);

    return fileUrl;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
}

export async function blackForestGenerations(data: string) {
  try {
    const response = await fetchWithRetry(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${HfKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response) {
      console.log("Image generation failed after retries.");
      return null;
    }

    const result = await response.blob();
    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueFilename = `blackforest-generated-image-${uuidv4()}.jpg`;
    const folderPath = path.resolve("training-data");
    const filePath = path.join(folderPath, uniqueFilename);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(filePath, buffer);

    const fileContent = await fs.promises.readFile(filePath);

    const s3Key = `app-data/${uniqueFilename}`;
    const params = {
      Bucket: bucketName,
      Key: s3Key,
      Body: fileContent,
    };

    await s3Client.send(new PutObjectCommand(params));

    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    fs.unlinkSync(filePath);

    return fileUrl;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
}

import { HfKey } from "./keys";
import fs from "fs";
import path from "path";

export async function stabilityAiGenerations(data: string) {
  try {
    const response = await fetch(
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

    const result = await response.blob();

    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const folderPath = path.resolve("training-data");
    const filePath = path.join(folderPath, "generated-image.jpg");

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(filePath, buffer);

    return filePath;
  } catch (error) {
    return error;
  }
}

export async function blackForestGenerations(data: string) {
  try {
    const response = await fetch(
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

    const result = await response.blob();

    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const folderPath = path.resolve("training-data");
    const filePath = path.join(folderPath, "blackforest-generated-image.jpg");

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(filePath, buffer);

    return filePath;
  } catch (error) {
    return error;
  }
}

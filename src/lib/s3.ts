import { s3 } from "@/server/s3";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type Readable } from "stream";

export const csvFileType = "text/csv";

export const xlsFileType = "application/vnd.ms-excel";

export const xlsxFileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export async function getCsv(entity: string, id: string) {
  const getObjectCommand = new GetObjectCommand(s3Params(entity, id));
  const response = await s3.send(getObjectCommand);
  const csv = streamToString(response.Body as Readable);
  return csv;
}

export async function uploadCsv(
  file: File,
  entity: string,
  id: string,
  expiresIn = 60 * 1
) {
  const putObjectCommand = new PutObjectCommand({
    ...s3Params(entity, id),
    ContentType: file.type,
  });
  const signedUploadUrl = await getSignedUrl(s3, putObjectCommand, {
    expiresIn,
  });
  const response = await fetch(signedUploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!response.ok) {
    throw new Error("Upload failed");
  }
  return csvUri(entity, id);
}

export async function deleteCsv(entity: string, id: string) {
  const command = new DeleteObjectCommand(s3Params(entity, id));
  await s3.send(command);
}

function s3Params(entity: string, id: string) {
  if (!process.env.S3_PUBLIC_URL || !process.env.S3_BUCKET) {
    throw new Error(
      `❌ Invalid environment variables: ${
        !process.env.S3_PUBLIC_URL ? "S3_PUBLIC_URL, " : ""
      }${!process.env.S3_BUCKET ? "S3_BUCKET" : ""}`
    );
  }
  return {
    Bucket: process.env.S3_BUCKET,
    Key: `${entity}/${id}.csv`,
  };
}

function csvUri(entity: string, id: string) {
  if (!process.env.S3_PUBLIC_URL) {
    throw new Error("❌ Invalid environment variables: S3_PUBLIC_URL");
  }
  return `${process.env.S3_PUBLIC_URL}/${entity}/${id}.csv`;
}

async function streamToString(stream: Readable) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

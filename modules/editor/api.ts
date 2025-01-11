import fs from "fs";
import { resolve } from "path";
import indexing from "./indexing";
import { s3Client } from "./s3client";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import yaml from "yaml";
import { getConfig } from "./editor-utils";

function readableFileSize(attachmentSize: number) {
  const DEFAULT_SIZE = 0;
  const fileSize = attachmentSize ?? DEFAULT_SIZE;

  if (!fileSize) {
    return `${DEFAULT_SIZE}kb`;
  }

  const sizeInKb = fileSize / 1024;

  if (sizeInKb > 1024) {
    return `${(sizeInKb / 1024).toFixed(2)}mb`;
  } else {
    return `${sizeInKb.toFixed(2)}kb`;
  }
}

const getBucketFiles = async () => {
  const command = new ListObjectsV2Command({
    Bucket: process.env.bucket,
  });
  const files = await s3Client.send(command);
  if (!files) {
    throw Error("No files found");
  }
  const allfiles = files.Contents.map((x) => {
    x.extension = x.Key.split(".").pop();
    x.hrsize = readableFileSize(x.Size);
    if (x.extension.match(/(jpg|jpeg|png|gif|bmp|webp|avif)/i)) {
      x.type = "image";
    } else if (x.extension.match(/(mp4|mov|webm|mkv|avi)/i)) {
      x.type = "video";
    } else if (x.extension.match(/(mp3|wav|ogg|flac)/i)) {
      x.type = "audio";
    } else if (x.extension.match(/(pdf)/i)) {
      x.type = "pdf";
    } else {
      x.type = "other";
    }
    return x;
  });
  fs.writeFileSync(
    resolve("./data/bucketfiles.json"),
    JSON.stringify(allfiles),
  );
  return allfiles;
};

// Usage
export default defineEventHandler(async (event) => {
  const name = event.context.params?.path;

  // index
  if (name === "index") {
    try {
      const data = await getBucketFiles();
      return data;
    } catch (err) {
      setResponseStatus(event, 404);
      return { error: "Could not list files.", err };
    }
  }

  if (name === "get") {
    const query = getQuery(event);
    const p = query.path;
    const psplit = p.split("/");
    if (psplit.length > 1) {
      const filepath = resolve("./data/", p);
      const data = yaml.parse(fs.readFileSync(filepath, "utf8"));
      const timestamp = fs.statSync(filepath).mtime;
      return { data, timestamp };
    } else if (psplit.length === 1) {
      const config = await getConfig();
      const type = config[psplit[0]].type;
      if (type === "yaml") {
        const filepath = resolve(`./data/${p}.yml`);
        const data = yaml.parse(fs.readFileSync(filepath, "utf8"));
        const timestamp = fs.statSync(filepath).mtime;
        return { data, timestamp };
      } else if (type === "markdown") {
        const filepath = resolve(`./data/${p}.md`);
        const data = fs.readFileSync(filepath, "utf8");
        const timestamp = fs.statSync(filepath).mtime;
        return { data, timestamp };
      } else {
        return false;
      }
    } else {
      setResponseStatus(event, 404);
      return { error: "No path provided" };
    }
  }

  if (name === "save") {
    const body = JSON.parse(await readBody(event));
    const data = body.data;
    const path = body.path;
    const config = await getConfig();
    const p = path.split("/");
    if (p.length > 1) {
      const filepath = resolve("./data/", path);
      fs.writeFileSync(filepath, yaml.stringify(data));
      return { success: true };
    } else if (p.length === 1) {
      const type = config[p[0]].type;
      if (type === "yaml") {
        const filepath = resolve(`./data/${path}.yml`);
        fs.writeFileSync(filepath, yaml.stringify(data));
        return { success: true };
      } else if (type === "markdown") {
        const filepath = resolve(`./data/${path}.md`);
        fs.writeFileSync(filepath, data);
        return { success: true };
      }
    }
    setResponseStatus(event, 404);
    return { error: "No path provided" };
  }
  if (name === "config") {
    const config = await getConfig();
    return config;
  }

  setResponseStatus(event, 404);
  return { error: "Nothing here." };
});

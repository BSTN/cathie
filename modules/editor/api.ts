import fs from "fs";
import { resolve } from "path";
import indexing from "./indexing";
import { s3Client } from "./s3client";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import yaml from "yaml";
import { getConfig } from "./editor-utils";
import path from "path";
import orderBy from "lodash/orderBy";
import indexOf from "lodash/indexOf";

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
  if (!event.context.params?.path) {
    setResponseStatus(event, 404);
    return { error: "No path provided" };
  }

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
    if (!p) {
      setResponseStatus(event, 404);
      error: "No path provided.";
    }
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

  if (name === "save-metadata") {
    const body = JSON.parse(await readBody(event));
    if (!body.path || !body.data) {
      setResponseStatus(event, 404);
      return { error: "No path or data provided" };
    }
    const metadataRaw = fs.readFileSync(resolve("./data/metadata.yml"), "utf8");
    const metadata = yaml.parse(metadataRaw);
    const foundIndex = metadata.findIndex((x) => {
      return x.path === body.path;
    });
    if (foundIndex > -1) {
      metadata[foundIndex] = Object.assign({ path: body.path }, body.data);
    } else {
      metadata.push(Object.assign({ path: body.path }, body.data));
    }
    fs.writeFileSync(resolve("./data/metadata.yml"), yaml.stringify(metadata));
    return {
      success: true,
    };
  }

  if (name === "get-metadata") {
    const body = JSON.parse(await readBody(event));
    const p = body.path;
    const metadataRaw = fs.readFileSync(resolve("./data/metadata.yml"), "utf8");
    const metadata = yaml.parse(metadataRaw);
    return (
      metadata.find((x) => {
        return x.path === body.path;
      }) || {}
    );
  }

  if (name === "get-folder") {
    const body = JSON.parse(await readBody(event));
    const p = body.path;
    const filesList = fs.readdirSync(resolve("./data/" + p));
    const order: string[] = [];
    const files = Object.values(filesList).filter((x) => !x.startsWith("."));
    if (fs.existsSync(resolve("./data/", p, ".sort.yml"))) {
      const orderfile = fs.readFileSync(
        resolve("./data/", p, ".sort.yml"),
        "utf8",
      );
      order.push(...yaml.parse(orderfile));
    }
    function sortByReferenceArray(toSort: string[], order: string[]) {
      return orderBy(toSort, (item: string) => indexOf(order, item), "asc");
    }
    return sortByReferenceArray(files, order);
  }

  if (name === "save-folder-order") {
    const body = JSON.parse(await readBody(event));
    const p = body.path;
    const filelist = body.filelist;
    const orderpath = resolve("./data/", p, ".sort.yml");
    const data = yaml.stringify(filelist);
    fs.writeFileSync(orderpath, data, "utf8");
    return { message: "success" };
  }

  if (name === "create-file") {
    const body = JSON.parse(await readBody(event));
    const p = body.path;
    const name = body.name;
    const filepath = resolve("./data/", p, name);
    fs.writeFileSync(filepath, "", "utf8");
    return { success: true };
  }

  if (name === "config") {
    const config = await getConfig();
    return config;
  }

  setResponseStatus(event, 404);
  return { error: "Nothing here." };
});

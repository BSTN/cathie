import yaml from "yaml";
import fs from "fs";
import { resolve } from "path";

export function sanitizeConfig(config: any) {
  for (let i in config) {
    if (typeof config[i] === "string") {
      config[i] = {
        type: config[i],
        label: i,
      };
    }
    if (config[i].fields) {
      config[i].fields = sanitizeConfig(config[i].fields);
    }
  }
  return config;
}

export async function getConfig() {
  return sanitizeConfig(
    yaml.parse(fs.readFileSync(resolve("./data/config.yml"), "utf8")),
  );
}

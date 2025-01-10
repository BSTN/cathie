import fs from "fs";
import { resolve } from "path";

export default defineEventHandler((event) => {
  const name = event.context.params?.path;
  if (name === "test") {
    fs.writeFileSync(resolve("./data/allfiles.json"), '{"app":"hello"}');
  }
  return {
    hello: fs.readFileSync(resolve("./data/allfiles.json"), "utf8"),
  };
});

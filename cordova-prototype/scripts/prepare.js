import fsExtra from "fs-extra";
import { execSync } from "node:child_process";
import path from "node:path";

const { copy } = fsExtra;

function run(command) {
  execSync(command, { stdio: "inherit" });
}

run("npx cordova platform add android");

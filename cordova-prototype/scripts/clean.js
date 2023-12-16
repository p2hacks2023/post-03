import { execSync } from "node:child_process"
import path from "node:path";
import fsExtra from 'fs-extra';

const { removeSync } = fsExtra;

function run(command) {
  execSync(command, {stdio: "inherit"});
}

removeSync("platforms");
removeSync("plugins");
run("npm run prepare");

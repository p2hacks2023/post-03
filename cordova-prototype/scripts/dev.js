import { ip } from "address";
import fsExtra from "fs-extra";
import path from "node:path";
import { exec, execSync } from "node:child_process"

const { writeFileSync } = fsExtra;

function run(command) {
  execSync(command, {stdio: "inherit"});
}

run("npm run clean");
run("npm exec vite build");

writeFileSync(path.join("www", "index.html"), `
<script src="cordova.js"></script>
<a href="http://${ip()}:8080/">Start development</a>
`);

try {
  run("npm exec cordova run android");
} catch(e) {
  console.error("May failed to start android");
}

run("npm exec vite");

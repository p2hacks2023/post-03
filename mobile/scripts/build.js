import { execSync } from "node:child_process"

function run(command) {
  execSync(command, {stdio: "inherit"});
}

run("npm run clean");
run("npm exec vite build");
run("npm exec cordova build");

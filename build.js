const { execSync } = require("child_process");
const fs = require("fs");

if (!fs.existsSync("./dist")) {
  fs.mkdirSync("./dist");
}
if (!fs.existsSync("./dist/temp")) {
  fs.mkdirSync("./dist/temp");
}
if (!fs.existsSync("./dist/js")) {
  fs.mkdirSync("./dist/js");
}
if (!fs.existsSync("./dist/css")) {
  fs.mkdirSync("./dist/css");
}
if (!fs.existsSync("./dist/html")) {
  fs.mkdirSync("./dist/html");
}
if (!fs.existsSync("./dist/images")) {
  fs.mkdirSync("./dist/images");
}

fs.copyFileSync("./src/manifest.json", "./dist/manifest.json");
fs.copyFileSync("./src/app.js", "./dist/app.js");
fs.cpSync("./src/html", "./dist/html", { recursive: true });
fs.cpSync("./src/css", "./dist/css", { recursive: true });
fs.cpSync("./src/images", "./dist/images", { recursive: true });

execSync(
  "bun build ./src/js/index.js --outfile=./dist/temp/project.js --minify"
);
execSync(
  "uglifyjs ./dist/temp/project.js --compress --mangle --output ./dist/js/project.min.js"
);

execSync(
  "bun build ./src/js/background.js --outfile=./dist/temp/background.js --minify"
);
execSync(
  "uglifyjs ./dist/temp/background.js --compress --mangle --output ./dist/js/background.min.js"
);

fs.rmdirSync("./dist/temp", { recursive: true });

import fs from "fs";

const parentPackageJson = fs.readFileSync("../../package.json");
const localPackageJson = fs.readFileSync("./package.json");

const parentPackage = JSON.parse(parentPackageJson.toString());
const localPackage = JSON.parse(localPackageJson.toString());

localPackage.devDependencies = parentPackage.devDependencies;

fs.writeFileSync("./package.json", JSON.stringify(localPackage));

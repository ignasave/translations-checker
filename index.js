"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var yaml = require("js-yaml");
var args = process.argv;
("../app/common/assets/strings");
("../app/common/assets/strings/translations/es.yaml");
// Define the path to the directory containing the YAML files
var yamlDir = args[2];
// Define the path to the translation file
var translationFile = args[3];
// Load the translation file
var translationData = yaml.load(fs.readFileSync(translationFile, "utf8"));
var anyErrors = false;
// Loop through each YAML file in the directory
fs.readdirSync(yamlDir).forEach(function (filename) {
    if (path.extname(filename) === ".yaml") {
        // Load the YAML file
        var yamlData_1 = yaml.load(fs.readFileSync(path.join(yamlDir, filename), "utf8"));
        yamlData_1["entries"].forEach(function (entry) {
            var translationKeyName = yamlData_1["baseName"] + "." + entry.key;
            var thereIsNoKey = !translationData["entries"].some(function (tEntry) { return tEntry.key === translationKeyName; });
            var isTypeCounted = entry.type === "counted";
            if (thereIsNoKey && !isTypeCounted) {
                console.error("Key \"".concat(translationKeyName, "\" in file \"").concat(filename, "\" does not exist in the translation file."));
                anyErrors = true;
            }
            if (isTypeCounted) {
                var allCountedValuesAreTranslated = Object.values(entry.values).every(function (e) { return e.hasOwnProperty("es"); });
                if (!allCountedValuesAreTranslated) {
                    console.error("Key \"".concat(translationKeyName, "\" in file \"").concat(filename, "\" does not exist in the translation file."));
                    anyErrors = true;
                }
            }
        });
    }
});
if (anyErrors) {
    process.exit(1);
}

import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

var args = process.argv;

// Define the language
const language = args[2] || "es";

// Define the path to the directory containing the YAML files
const yamlDir = args[3] || "../app/common/assets/strings";

// Define the path to the translation file
const translationFile =
  args[4] || `../app/common/assets/strings/translations/${language}.yaml`;

// Load the translation file
const translationData = yaml.load(fs.readFileSync(translationFile, "utf8"));

let anyErrors = false;

// Loop through each YAML file in the directory
fs.readdirSync(yamlDir).forEach((filename) => {
  if (path.extname(filename) === ".yaml") {
    // Load the YAML file
    const yamlData = yaml.load(
      fs.readFileSync(path.join(yamlDir, filename), "utf8")
    );
    yamlData["entries"].forEach((entry) => {
      const translationKeyName = yamlData["baseName"] + "." + entry.key;
      const thereIsNoKey = !translationData["entries"].some(
        (tEntry) => tEntry.key === translationKeyName
      );
      const isTypeCounted = entry.type === "counted";

      if (thereIsNoKey && !isTypeCounted) {
        console.error(
          `Key "${translationKeyName}" in file "${filename}" does not exist in the translation file.`
        );
        anyErrors = true;
      }

      if (isTypeCounted) {
        const allCountedValuesAreTranslated = Object.values(entry.values).every(
          (e: any) => e.hasOwnProperty(language)
        );
        if (!allCountedValuesAreTranslated) {
          console.error(
            `Key "${translationKeyName}" in file "${filename}" does not exist in the translation file.`
          );
          anyErrors = true;
        }
      }
    });
  }
});

if (anyErrors) {
  process.exit(1);
} else {
  console.log("All keys translated!");
}

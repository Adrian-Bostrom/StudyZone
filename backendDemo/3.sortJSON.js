const fs = require("fs");
const path = require("path");

const inputDir = "extracted_json"; // Directory where JSON files are stored
const outputFile = "urls.json";
const baseUrl = "https://canvas.kth.se"; // Base Canvas URL

let urls = [];

// Read all JSON files in the directory
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(inputDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    try {
      const jsonData = JSON.parse(content);

      if (jsonData.href && jsonData.isFavorited == true) {
        const fullUrl = `${baseUrl}${jsonData.href}`;
        urls.push(fullUrl);
      }
    } catch (e) {
      console.error(`Error parsing JSON in ${file}:`, e);
    }
  });

  // Save extracted URLs
  if (urls.length > 0) {
    fs.writeFileSync(outputFile, JSON.stringify(urls, null, 2));
    console.log(`Extracted URLs saved to ${outputFile}`);
  } else {
    console.log("No valid URLs found.");
  }
});

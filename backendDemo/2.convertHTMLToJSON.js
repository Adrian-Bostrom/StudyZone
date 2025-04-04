const fs = require('fs');
const cheerio = require('cheerio');

// Read the HTML file
fs.readFile('canvas_overview.html', 'utf8', (err, htmlContent) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  // Load the HTML with Cheerio
  const $ = cheerio.load(htmlContent);
  const jsonObjects = [];

  // Iterate over each <script> tag
  $('script').each((i, el) => {
    const scriptText = $(el).html();
    
    // If the script tag explicitly contains JSON
    if ($(el).attr('type') === 'application/json') {
      try {
        const json = JSON.parse(scriptText);
        jsonObjects.push(json);
      } catch (parseError) {
        console.error('Error parsing JSON from application/json script:', parseError);
      }
    } else {
      // Otherwise, try to find JSON objects in the script text using a regex.
      // Note: This regex is basic and might need tweaking for more complex cases.
      const regex = /(\{[\s\S]*?\})/g;
      let match;
      while ((match = regex.exec(scriptText)) !== null) {
        const candidate = match[1];
        try {
          const parsed = JSON.parse(candidate);
          jsonObjects.push(parsed);
        } catch (e) {
          // If candidate is not valid JSON, ignore it.
        }
      }
    }
  });

  // Ensure output directory exists
  const outputDir = 'extracted_json';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Write each extracted JSON object to a separate file
  jsonObjects.forEach((obj, index) => {
    const filename = `${outputDir}/json_${index + 1}.json`;
    fs.writeFileSync(filename, JSON.stringify(obj, null, 2));
    console.log(`Extracted JSON saved to ${filename}`);
  });

  if (jsonObjects.length === 0) {
    console.log('No JSON objects were found in the HTML.');
  }
});

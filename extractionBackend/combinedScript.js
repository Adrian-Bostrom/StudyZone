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
      const regex = /(\{[\s\S]*?\})/g;
      let match;
      while ((match = regex.exec(scriptText)) !== null) {
        try {
          jsonObjects.push(JSON.parse(match[1]));
        } catch (e) {
          // Ignore invalid JSON
        }
      }
    }
  });

  if (jsonObjects.length === 0) {
    console.log('No JSON objects were found in the HTML.');
    return;
  }

  // Convert JSON objects to a formatted string for HTML output
  let htmlOutput = `
    <html>
    <head>
        <title>Extracted JSON Data</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <h1>Extracted JSON Data</h1>
        ${jsonObjects.map((obj, index) => `
            <h2>JSON Object ${index + 1}</h2>
            <pre>${JSON.stringify(obj, null, 2)}</pre>
        `).join('')}
    </body>
    </html>
  `;

  // Save extracted JSON as an HTML file
  fs.writeFileSync('extracted_data.html', htmlOutput, 'utf8');
  console.log("Extracted JSON saved to 'extracted_data.html'");
});

const fs = require('fs');
const cheerio = require('cheerio');

// Read the extracted_data.html file
fs.readFile('extracted_data.html', 'utf8', (err, htmlContent) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Load the HTML content using Cheerio
  const $ = cheerio.load(htmlContent);
  const favoritePagesUrls = [];

  // Find all <pre> tags and extract JSON
  $('pre').each((index, element) => {
    try {
      const jsonText = $(element).text();
      const parsedJSON = JSON.parse(jsonText);

      if (parsedJSON.isFavorited === true && parsedJSON.pagesUrl) {
        favoritePagesUrls.push(parsedJSON.pagesUrl);
      }
    } catch (parseError) {
      console.error(`Error parsing JSON from <pre> tag ${index + 1}:`, parseError);
    }
  });

  if (favoritePagesUrls.length === 0) {
    console.log('No favorite course pages found in extracted_data.html.');
    return;
  }

  // Save extracted URLs to a file
  fs.writeFileSync('favorite_course_pages_urls.txt', favoritePagesUrls.join('\n'), 'utf8');
  console.log("Favorite course pages URLs saved to 'favorite_course_pages_urls.txt'");

  // Print URLs to console
  console.log("\nExtracted Favorite Course Pages URLs:");
  favoritePagesUrls.forEach(url => console.log(url));
});

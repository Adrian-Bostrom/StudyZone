const fs = require('fs');
const cheerio = require('cheerio');

// Läs in HTML-filen och bearbeta innehållet
fs.readFile('canvas_overview.html', 'utf8', (err, htmlContent) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Ladda HTML-koden med Cheerio
    const $ = cheerio.load(htmlContent);

    // Hitta alla uppgifter som har deadlines
    let foundItems = false;
    $('.PlannerItem-styles__root').each((index, item) => {
        // Hämta kursnamn
        const course = $(item).find('.css-qbjizl-text').text().trim();

        // Hämta uppgiftsnamn
        const assignment = $(item).find('a.css-q13fpi-view-link span[aria-hidden="true"]').text().trim();

        // Hämta deadline (veckodag, datum, och tid)
        let rawDeadlineText = $(item).find('a.css-q13fpi-view-link span.css-1sr5vj2-screenReaderContent').text().trim();
        
        // Om det finns en deadline med veckodag, ta bort "förfaller"
        let formattedDeadline = 'Okänt datum';
        if (rawDeadlineText.includes("förfaller")) {
            formattedDeadline = rawDeadlineText.replace("förfaller", "").trim();
        }

        // Ta bort all text fram till första komma
        const firstCommaIndex = formattedDeadline.indexOf(',');
        if (firstCommaIndex !== -1) {
            formattedDeadline = formattedDeadline.slice(firstCommaIndex + 1).trim(); // Ta bort all text innan första komma
        }

        // Ta bort eventuella extra kommatecken eller text som finns mellan kommatecken
        const secondCommaIndex = formattedDeadline.indexOf(',');
        if (secondCommaIndex !== -1) {
            formattedDeadline = formattedDeadline.slice(secondCommaIndex + 1).trim(); // Ta bort texten mellan kommatecknen
        }

        // Hämta länk till uppgiften
        const link = $(item).find('a').attr('href');
        const fullLink = link ? `https://canvas.kth.se${link}` : '#';

        // Skriv ut uppgiftsinformation
        if (course || assignment || formattedDeadline || link) {
            foundItems = true;
            console.log(`Course: ${course}`);
            console.log(`Assignment: ${assignment}`);
            console.log(`Deadline: ${formattedDeadline}`);
            console.log(`Link: ${fullLink}`);
            console.log('-----------------------------------');
        }
    });

    // Om inga uppgifter hittas, skriv ut ett meddelande
    if (!foundItems) {
        console.log('No deadlines found in the HTML content.');
    }
});

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Sätt till true om du inte vill se webbläsaren
        args: ['--start-maximized'],
        defaultViewport: null
    });

    const page = await browser.newPage();

    console.log("Öppnar Canvas...");
    await page.goto("https://canvas.kth.se", { waitUntil: 'networkidle2' });

    console.log("\n====================================");
    console.log("MANUELL INLOGGNING KRÄVS:");
    console.log("1. Logga in manuellt i webbläsarfönstret");
    console.log("2. Vänta tills du ser din Canvas-översikt");
    console.log("3. Tryck sedan på ENTER i detta terminalfönster");
    console.log("====================================\n");

    // Vänta på att användaren ska trycka på Enter efter inloggning
    process.stdin.once('data', async () => {
        console.log("Sparar Canvas-översikten som en HTML-fil...");

        // Hämta hela sidans HTML
        const htmlContent = await page.content();

        // Spara HTML-innehållet i en textfil
        fs.writeFileSync('canvas_overview.html', htmlContent, 'utf8');
        console.log("HTML-fil sparad som 'canvas_overview.html'");

        await browser.close();
        process.exit();
    });
})();

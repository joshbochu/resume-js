const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const marked = require('marked');

async function writePdf(htmlContent, outputPath) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--enable-logging=stderr',
            '--log-level=2',
            '--in-process-gpu',
            '--disable-gpu'
        ]
    });
    const page = await browser.newPage();

    // Set content and wait for it to load
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Set page size to A4 at 96 DPI
    await page.setViewport({
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123 // A4 height in pixels at 96 DPI
    });

    // Generate PDF with Chrome's settings matching Python version
    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: false,  // Matches --print-to-pdf-no-header
        preferCSSPageSize: true,     // Let CSS control the page size and margins
        timeout: 60000
    });

    await browser.close();
}

async function generateResumePdf() {
    // Read the CSS file
    const cssContent = fs.existsSync('resume.css') ? fs.readFileSync('resume.css', 'utf8') : '';

    // Read the Markdown file
    const mdContent = fs.readFileSync('resume.md', 'utf8');

    // Convert Markdown to HTML
    const htmlBody = marked.parse(mdContent);

    // Create the complete HTML document
    const htmlContent = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Resume</title>
            <style>
                ${cssContent}
            </style>
        </head>
        <body>
            <div id="resume">
                ${htmlBody}
            </div>
        </body>
        </html>
    `;

    // Generate PDF in the root directory
    const outputPath = path.join(__dirname, 'resume.pdf');
    await writePdf(htmlContent, outputPath);
    console.log(`PDF generated at: ${outputPath}`);
}

// Run the script
generateResumePdf().catch(console.error);
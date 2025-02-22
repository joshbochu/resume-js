const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const marked = require('marked');

async function writePdf(htmlContent, outputPath) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--print-to-pdf-no-header',  // Match Python's option
            '--enable-logging=stderr',
            '--log-level=2',
            '--in-process-gpu',
            '--disable-gpu'
        ]
    });
    const page = await browser.newPage();

    // Use same base64 encoding approach as Python
    const html64 = Buffer.from(htmlContent).toString('base64');
    await page.goto(`data:text/html;base64,${html64}`, {
        waitUntil: 'networkidle0'
    });

    // Remove explicit page size settings to match Python behavior
    // which uses Chrome's defaults
    await page.pdf({
        path: outputPath,
        printBackground: true,
        displayHeaderFooter: false
    });

    await browser.close();
}

async function generateResumePdf(inputFile = 'resume.md') {
    // Get the prefix from the input file path like Python does
    const prefix = path.join(
        path.dirname(path.resolve(inputFile)),
        path.basename(inputFile, path.extname(inputFile))
    );

    // Create resumes directory if it doesn't exist
    const resumesDir = 'resumes';
    if (!fs.existsSync(resumesDir)) {
        fs.mkdirSync(resumesDir);
    }

    // Find next available number
    let counter = 1;
    let outputPath;
    do {
        outputPath = path.join(resumesDir, `resume_${counter}.pdf`);
        counter++;
    } while (fs.existsSync(outputPath));

    // Read the CSS file - match Python's handling
    let cssContent = '';
    const cssPath = prefix + '.css';
    if (fs.existsSync(cssPath)) {
        cssContent = fs.readFileSync(cssPath, 'utf8');
    } else {
        console.log(prefix + '.css not found. Output will be unstyled.');
    }

    // Read and parse the Markdown file
    const mdContent = fs.readFileSync(inputFile, 'utf8');

    // Extract title from first h1 heading like Python does
    let title = 'Resume';
    const titleMatch = mdContent.match(/^#[^#].*$/m);
    if (titleMatch) {
        title = titleMatch[0].replace(/^#\s*/, '').trim();
    }

    // Use marked with settings closer to Python's markdown package
    marked.setOptions({
        smartypants: true  // Similar to Python's "smarty" extension
    });
    const htmlBody = marked.parse(mdContent);

    // Match Python's HTML template exactly
    const htmlContent = `<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
${cssContent}
</style>
</head>
<body>
<div id="resume">
${htmlBody}
</div>
</body>
</html>`;

    // Generate PDF with numbered suffix in resumes folder
    await writePdf(htmlContent, outputPath);
    console.log(`Wrote ${outputPath}`);
}

// Simple command line handling like Python
const inputFile = process.argv[2] || 'resume.md';
generateResumePdf(inputFile).catch(console.error);
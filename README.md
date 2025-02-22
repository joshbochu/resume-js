# Resume Markdown to PDF Converter

This tool converts a markdown resume to a professionally formatted PDF using Puppeteer and Marked. It includes custom CSS styling and proper PDF formatting.

## Prerequisites

- Node.js (v14 or higher)
- pnpm 

## Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd resume-js
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Usage

1. Place your resume markdown in `resume.md`
2. The styling is controlled by `resume.css`
3. Run the converter:
   ```bash
   pnpm start
   ```
4. Find your generated PDF as `resume.pdf` in the same directory

## File Structure

- `resume.js` - Main script that converts markdown to PDF
- `resume.md` - Your resume in markdown format
- `resume.css` - Styling for the PDF output
- `resume.pdf` - Generated output (will be created when you run the script)

## Markdown Format

The markdown file should follow this structure:

- First `h1` (#) is used as the page title
- Contact information should be in an unordered list right after the title
- Sections should use `h2` (##)
- Subsections should use `h3` (###)
- For job entries, use: `### <span>Job Title</span> <span>Date Range</span>`

## Customization

You can customize the appearance of your resume by modifying `resume.css`. The current styling includes:

- Professional margins and spacing
- Responsive design
- Print-specific formatting
- Clean typography

## Troubleshooting

If you encounter issues with PDF generation:

1. Ensure all dependencies are properly installed
2. Check if your markdown follows the expected format
3. Verify you have sufficient permissions in the output directory
4. Make sure no other process is locking the output PDF file 
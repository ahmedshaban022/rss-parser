# RSS Feed Parser

A Next.js web application that allows users to parse RSS feeds, view articles in an editable table format, and generate downloadable XML files with updated content.

## Features

### Part 1: RSS Feed Parsing
- **URL Input**: Text field to enter RSS feed URLs
- **Feed Parsing**: Validates and parses RSS/XML feeds
- **Error Handling**: Displays clear error messages for invalid feeds or parsing failures
- **Article Display**: Shows parsed articles in a table format with columns:
  - Title
  - Details
  - Image (with preview)
  - Publish Date

### Part 2: Editing & XML Generation
- **Inline Editing**: Edit article fields directly in the table
- **XML Generation**: Generate and download updated RSS feed as XML file
- **Change Tracking**: Visual indicator for unsaved changes

## Tech Stack

- **Framework**: Next.js 16.0.8 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **React**: 19.2.1

## Supported RSS Formats

The parser supports multiple RSS/XML formats:
- Custom XML format with `<news-topic>` structure
- Standard RSS 2.0 format
- Atom feed format

## Project Structure

```
rss-parser/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main RSS parser page
│   └── globals.css         # Global styles
├── components/
│   ├── RSSForm.tsx         # RSS URL input form
│   ├── ArticleTable.tsx    # Editable article table
│   └── ErrorMessage.tsx   # Error display component
├── lib/
│   ├── rssParser.ts        # RSS parsing logic
│   └── xmlGenerator.ts     # XML generation utilities
└── types/
    └── article.ts          # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build the production version:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Usage

1. **Parse RSS Feed**:
   - Enter an RSS feed URL in the text field
   - Click "Parse RSS Feed"
   - Articles will be displayed in a table if parsing succeeds

2. **Edit Articles**:
   - Click on any cell in the table to edit
   - Make your changes
   - Changes are tracked automatically

3. **Generate XML**:
   - After editing, click "Generate XML File"
   - A file named `updated-rss-feed.xml` will be downloaded
   - The XML follows the custom format with `<news-topic>` structure

## Assumptions

- RSS feeds may use various formats (custom XML, RSS 2.0, Atom)
- Image URLs can be in various locations (enclosure, media:content, or embedded in description)
- Users can edit all fields inline
- Generated XML uses the custom `<news-topic>` format as specified in the assignment

## Code Quality

- TypeScript for type safety
- Component-based architecture
- Error handling and validation
- Responsive design (mobile-first)
- Accessible UI (semantic HTML, ARIA labels)
- Clean, maintainable code structure

## Browser Support

Modern browsers that support:
- ES2017+
- Fetch API
- DOMParser API
- Blob API

## License

Private project for assignment purposes.

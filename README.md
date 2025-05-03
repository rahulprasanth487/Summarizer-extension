# WebPage ChatAI Extension

A Chrome extension that uses Google's Gemini AI to answer questions about the current webpage.

## Features

- Side panel interface for easy interaction
- AI-powered responses using Gemini API
- Clean and modern dark theme UI
- Real-time webpage context analysis

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
cd WebPage-ChatAI
npm install
```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `WebPage-ChatAI` directory

## Usage

1. Click the extension icon in Chrome toolbar to open the side panel
2. Type your question about the current webpage
3. Click the send button or press Enter to get AI-powered responses

## Project Structure

- `background.js` - Extension background script
- `manifest.json` - Extension configuration
- `Agents/` - Agents for generation
- `sidepanel/` - UI components and styles
- `images/` - Extension icons
- `svgs/` - UI icons and assets

## Dependencies

- dotenv: ^16.5.0
- node-fetch: ^3.3.2

## License

ISC
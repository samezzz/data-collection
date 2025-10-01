# AI-Enhanced Data Collection App

A Next.js application that uses Google Gemini AI to filter speech transcriptions and convert them to proper Ghanaian names and locations.

## Features

- 🎤 **Speech-to-Text Input**: Voice input with browser speech recognition
- 🤖 **AI-Powered Filtering**: Google Gemini AI filters transcriptions to proper Ghanaian names and locations
- 📱 **Responsive Design**: Modern UI with Tailwind CSS
- 📸 **Camera Integration**: Photo capture functionality
- 🔄 **Real-time Processing**: Instant AI filtering of voice input

## Prerequisites

- Node.js 18+ 
- A valid Google Gemini API key
- A modern browser with microphone access (Chrome, Edge, Safari)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**To get a Gemini API key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and paste it in your `.env.local` file

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Main Form (`/`)
- Standard registration form with AI-enhanced voice input
- Toggle AI filtering on/off
- Voice input for names and locations with smart correction

### Demo Page (`/demo`)
- Interactive demonstration of AI filtering
- Try speaking Ghanaian names like "Kwame", "Akosua"
- Try speaking Ghanaian locations like "Accra", "Kumasi"
- Compare results with and without AI filtering

## How It Works

1. **Speech Recognition**: Browser converts your voice to text
2. **AI Analysis**: Gemini AI analyzes the text for Ghanaian names/locations
3. **Smart Correction**: Text is automatically converted to proper Ghanaian names/places
4. **Visual Feedback**: Shows original vs. corrected text with confidence scores

## API Endpoints

### POST `/api/filter-transcription`
Filters a transcription using Gemini AI.

**Request:**
```json
{
  "transcription": "kwame"
}
```

**Response:**
```json
{
  "originalText": "kwame",
  "filteredText": "Kwame",
  "confidence": 0.95,
  "type": "name"
}
```

## Components

### `SpeechToTextInputEnhanced`
Enhanced speech-to-text component with AI filtering:

```tsx
<SpeechToTextInputEnhanced
  id="name"
  value={name}
  onChange={setName}
  placeholder="Speak or type your name..."
  enableGeminiFilter={true}
/>
```

### `GeminiTranscriptionFilter`
Service class for AI filtering:

```typescript
import { geminiFilter } from "@/lib/gemini-service";

const result = await geminiFilter.filterTranscription("accra");
// Returns: { originalText: "accra", filteredText: "Accra", confidence: 0.9, type: "location" }
```

## Troubleshooting

### API Key Issues
- Ensure your `.env.local` file is in the root directory
- Verify your API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check that the key has the necessary permissions

### Speech Recognition Issues
- Use Chrome, Edge, or Safari for best compatibility
- Ensure microphone permissions are granted
- Check that your microphone is working

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Check that all environment variables are set correctly

## Development

### Project Structure
```
src/
├── app/
│   ├── api/filter-transcription/    # API endpoint for AI filtering
│   ├── demo/                        # Demo page
│   └── page.tsx                     # Main form page
├── components/
│   ├── speech-to-text-input-enhanced.tsx  # Enhanced STT component
│   └── ui/                          # UI components
└── lib/
    └── gemini-service.ts            # Gemini AI service
```

### Adding New Features
1. Create new components in `src/components/`
2. Add API routes in `src/app/api/`
3. Update the Gemini service for new filtering logic

## License

MIT License - feel free to use this project for your own applications.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your API key and environment setup
3. Ensure browser compatibility for speech recognition

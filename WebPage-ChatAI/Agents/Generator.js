const path = require('path');
const envPath = path.resolve(__dirname, './.env');

require('dotenv').config({ path: envPath });

class GeminiGenerator {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        if (!this.apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    }

    async generateResponse(prompt) {
        try {
            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                content: data.candidates[0].content.parts[0].text,
                error: null
            };

        } catch (error) {
            return {
                success: false,
                content: null,
                error: error.message
            };
        }
    }
}

module.exports = GeminiGenerator;
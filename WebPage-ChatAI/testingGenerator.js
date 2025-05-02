const GeminiGenerator = require("./Agents/Generator");

async function main() {
    const generator = new GeminiGenerator();

    const response = await generator.generateResponse('What is JavaScript?');
    if (response.success) {
        console.log(response.content);
    } else {
        console.error(response.error);
    }
}

main().catch(console.error);

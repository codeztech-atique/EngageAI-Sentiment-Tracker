const fs = require('fs').promises; // Use the promise-based version of 'fs' for async operations
const { ComprehendClient, DetectSentimentCommand } = require("@aws-sdk/client-comprehend");
const client = new ComprehendClient({ region: "us-east-1" });

// exports.handler = async (event) => {
const readSentiments = async() => {
    try {
        // Read the content of the text file asynchronously
        const text = await fs.readFile('./sample/bad.txt', 'utf8');

        const params = {
            Text: text,
            LanguageCode: "en",
        };

        const command = new DetectSentimentCommand(params);
        const data = await client.send(command);
        console.log("Sentiment Analysis Results:", data);
        return data; // Returning or further processing the results as needed

    } catch (error) {
        console.error("Error:", error);
        return error;
    }
};

readSentiments();

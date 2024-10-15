// When the sentiments is less than 5000, or more than 5000.

const fs = require('fs').promises; // Use the promise-based version of 'fs' for async operations
const { ComprehendClient, DetectSentimentCommand } = require("@aws-sdk/client-comprehend");
const client = new ComprehendClient({ region: "us-east-1" });

// Helper function to split text
function splitText(text, size) {
    const splitRegex = new RegExp(`.{1,${size}}\\b`, 'g'); // Split at word boundaries
    return text.match(splitRegex) || [];
}

// Analyze sentiments of each text chunk
async function analyzeSentiments(texts) {
    let results = [];
    for (let text of texts) {
        const params = {
            Text: text,
            LanguageCode: "en",
        };
        const command = new DetectSentimentCommand(params);
        try {
            const result = await client.send(command);
            results.push(result);
        } catch (error) {
            console.error("Error analyzing sentiment:", error);
        }
    }
    return results;
}

// Aggregate results to find the dominant sentiment
// function aggregateResults(results) {
//     const sentimentCounts = results.reduce((acc, result) => {
//         acc[result.Sentiment] = (acc[result.Sentiment] || 0) + 1;
//         return acc;
//     }, {});

//     // Determine the dominant sentiment
//     const dominantSentiment = Object.keys(sentimentCounts).reduce((a, b) => sentimentCounts[a] > sentimentCounts[b] ? a : b);

//     return dominantSentiment;
// }

function aggregateResults(results) {
    const sentimentScores = {
        Positive: 0,
        Negative: 0,
        Neutral: 0,
        Mixed: 0
    };
    const sentimentCounts = {
        Positive: 0,
        Negative: 0,
        Neutral: 0,
        Mixed: 0
    };

    // Accumulate scores and counts
    results.forEach(result => {
        ['Positive', 'Negative', 'Neutral', 'Mixed'].forEach(sentiment => {
            sentimentScores[sentiment] += result.SentimentScore[sentiment] * 1; // Multiply by 1 to convert to number if needed
            if (result.Sentiment === sentiment) {
                sentimentCounts[sentiment] += 1;
            }
        });
    });

    // Calculate weighted averages
    const weightedScores = {
        Positive: sentimentScores.Positive / Math.max(sentimentCounts.Positive, 1),
        Negative: sentimentScores.Negative / Math.max(sentimentCounts.Negative, 1),
        Neutral: sentimentScores.Neutral / Math.max(sentimentCounts.Neutral, 1),
        Mixed: sentimentScores.Mixed / Math.max(sentimentCounts.Mixed, 1)
    };

    // Determine the dominant sentiment based on the highest weighted score
    const dominantSentiment = Object.keys(weightedScores).reduce((a, b) => weightedScores[a] > weightedScores[b] ? a : b);

    return {
        dominantSentiment,
        scores: weightedScores
    };
}


// Main function to read file and process sentiments
const readSentiments = async() => {
    try {
        // Read the content of the text file asynchronously
        const text = await fs.readFile('./sample/mixed.txt', 'utf8');

        console.log("Please wait...")

        // Split the text into manageable chunks
        const chunks = splitText(text, 4900); // slightly below 5000 to ensure under limit
        const results = await analyzeSentiments(chunks);
        const overallSentiment = aggregateResults(results);

        console.log("Overall Sentiment:", overallSentiment);
        return overallSentiment;

    } catch (error) {
        console.error("Error:", error);
        return error;
    }
};

readSentiments();

# EngageAI-Sentiment-Tracker

## Introduction
EngageAI-Sentiment-Tracker is a Node.js application developed to analyze text sentiment using AWS Comprehend. This tool is specifically designed to handle texts that exceed the AWS Comprehend size limit of 5000 bytes by splitting them into smaller segments, analyzing each segment, and aggregating the results to determine the overall sentiment.

## Features
- **Text Splitting**: Splits large text files into segments of 4900 bytes to ensure compatibility with AWS Comprehend's API limits.
- **Sentiment Analysis**: Leverages AWS Comprehend to assess the sentiment of text segments.
- **Result Aggregation**: Aggregates sentiment scores from multiple segments to derive an overall sentiment score and dominant sentiment.

## Prerequisites
Before setting up the project, ensure you have the following installed:
- Node.js (version 20.x or higher)
- npm (usually comes with Node.js)
- Configured AWS CLI with appropriate AWS credentials.

## Installation
To get started with EngageAI-Sentiment-Tracker, clone the repository and install the necessary dependencies:
```bash
git clone https://github.com/codeztech-atique/EngageAI-Sentiment-Tracker.git
cd EngageAI-Sentiment-Tracker
npm install
```

## Usage
Run the sentiment analysis tool using:
```bash
node index.js
```


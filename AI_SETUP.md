# AI Agents Setup Guide

This guide explains how to set up and use the AI-powered features in TenderBridge.

## Overview

TenderBridge includes several AI agents that provide intelligent automation:

- **Job Matcher**: AI-powered job matching and analysis
- **Career Advisor**: Personalized career guidance and recommendations
- **News Analyzer**: Supply chain news analysis and insights
- **Chat Agent**: Intelligent conversational assistance

## Setup Instructions

### 1. Environment Variables

Copy the `.env.example` file to `.env` and configure the following variables:

```bash
# Required for AI functionality
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Optional for enhanced news analysis
VITE_NEWS_API_KEY=your_news_api_key_here
```

### 2. OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add the key to your `.env` file as `VITE_OPENAI_API_KEY`

### 3. News API Key (Optional)

1. Visit [NewsAPI](https://newsapi.org/)
2. Register for a free account
3. Get your API key
4. Add it to your `.env` file as `VITE_NEWS_API_KEY`

## Features

### Job Matcher
- Upload resume and job descriptions
- Get AI-powered matching analysis
- Receive recommendations for skill improvements
- View detailed matching factors

### Career Advisor
- Input current role and experience
- Set career goals and skills
- Get personalized career advice
- Receive skill development recommendations

### News Analyzer
- Automatic analysis of supply chain news
- Sentiment analysis and categorization
- Key insights extraction
- Relevance scoring

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the AI Agents section in the application

3. Use the tabs to switch between different AI agents:
   - Dashboard: Overview of AI agent activity
   - Job Matcher: Upload resume and analyze job matches
   - Career Advisor: Get personalized career guidance
   - News Analyzer: View analyzed supply chain news

## Fallback Behavior

If the OpenAI API key is not configured or API calls fail:
- The system will provide fallback responses
- Basic functionality will still work with simulated data
- Error messages will guide users to proper setup

## Cost Considerations

- OpenAI API usage is pay-per-use
- Monitor your API usage in the OpenAI dashboard
- Consider setting usage limits to control costs
- The application includes error handling to prevent excessive API calls

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured" error**
   - Ensure `VITE_OPENAI_API_KEY` is set in your `.env` file
   - Restart the development server after adding the key

2. **API rate limit errors**
   - Check your OpenAI account usage limits
   - Wait before making additional requests

3. **News analysis not working**
   - Ensure `VITE_NEWS_API_KEY` is configured
   - Check that news data is available in the system

### Support

For additional support:
1. Check the browser console for error messages
2. Verify all environment variables are correctly set
3. Ensure you have sufficient API credits

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive configuration
- Monitor API usage regularly
- Rotate API keys periodically for security
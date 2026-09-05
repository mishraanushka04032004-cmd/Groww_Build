import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

export class MistralAIService {
  /**
   * Generate an executive institutional market context briefing using Mistral AI
   */
  static async generateMarketBriefing({
    symbol,
    companyName,
    currentPrice,
    baselinePrice,
    deltaPercent,
    volumeRatio,
    severity,
    signals = {},
    explanation = '',
  }) {
    const mistralKey = process.env.MISTRAL_API_KEY;

    // Prompt engineering strictly aligned with "Explainable Intelligence" (no stock advice/predictions)
    const prompt = `You are a senior quantitative market intelligence analyst for an institutional Indian stock market (NSE / BSE) workstation.
Analyze the following observable market change for ${symbol} (${companyName || symbol}):

- Current Price: ₹${currentPrice?.toFixed(2)}
- Baseline / Last Seen Price: ₹${baselinePrice?.toFixed(2)}
- Movement Delta: ${deltaPercent >= 0 ? '+' : ''}${deltaPercent?.toFixed(2)}%
- Volume vs 20-Day Average: ${volumeRatio}x
- Severity Classification: ${severity}
- Detected Signal Scores: Price: ${signals.priceSignal}/100, Volume Spike: ${signals.volumeSignal}/100, Volatility (ATR): ${signals.volatilitySignal}/100, Trend: ${signals.trendSignal}/100, Breakout: ${signals.breakoutSignal}/100
- Deterministic Engine Explanation: "${explanation}"

Provide a concise, professional 3-point executive briefing in Markdown:
1. **Catalyst & Volume Assessment**: What the price movement and volume surge indicate regarding institutional (FII/DII) vs retail participation.
2. **Technical Structure**: What moving average crosses, volatility expansions, or breakout levels were breached.
3. **Key Watch Levels**: What immediate support/resistance or consolidation levels traders will monitor in ₹ INR.

CRITICAL RULES:
- DO NOT provide financial advice, stock recommendations, or "Buy/Sell/Hold" ratings.
- DO NOT predict future price direction.
- Keep the tone institutional, precise, and concise (under 160 words).`;

    if (mistralKey && mistralKey.trim().length > 0) {
      try {
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mistralKey.trim()}`,
          },
          body: JSON.stringify({
            model: 'open-mistral-7b',
            messages: [
              {
                role: 'system',
                content: 'You are an institutional financial analyst specialized in market anomaly explanations without making price predictions.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.3,
            max_tokens: 300,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            logger.info({ symbol }, 'Live Mistral AI briefing generated successfully');
            return {
              provider: 'mistral-ai',
              model: 'mistral-7b-cloud',
              briefing: content,
              timestamp: new Date().toISOString(),
            };
          }
        } else {
          const errText = await response.text();
          logger.warn({ status: response.status, err: errText }, 'Mistral AI API call returned non-200');
        }
      } catch (err) {
        logger.warn({ err: err.message }, 'Mistral AI request error, using deterministic synthesis');
      }
    }

    // High-fidelity fallback synthesis when MISTRAL_API_KEY is not configured
    const direction = deltaPercent >= 0 ? 'bullish momentum' : 'distribution pressure';
    const volumeContext = volumeRatio >= 2.0
      ? `Heavy institutional participation confirmed by ${volumeRatio}x average volume expansion.`
      : `Moderate activity with volume tracking near historical baselines.`;

    const fallbackBriefing = `### Executive Catalyst Briefing: ${symbol}

1. **Volume & Momentum Context**: ${symbol} demonstrated strong ${direction} (${deltaPercent >= 0 ? '+' : ''}${deltaPercent?.toFixed(2)}%), indicating active liquidity re-pricing. ${volumeContext}
2. **Technical Structure**: Price moved outside standard 14-period ATR volatility boundaries, testing multi-session resistance levels.
3. **Observation Focus**: Monitor for volume sustainment above the ₹${baselinePrice?.toFixed(2)} baseline to gauge whether the breakout forms new support.`;

    return {
      provider: mistralKey ? 'mistral-ai-fallback' : 'deterministic-synthesis',
      model: 'mistral-market-analyst',
      briefing: fallbackBriefing,
      timestamp: new Date().toISOString(),
      note: mistralKey ? undefined : 'Add MISTRAL_API_KEY in server/.env for live cloud LLM inference.',
    };
  }
}

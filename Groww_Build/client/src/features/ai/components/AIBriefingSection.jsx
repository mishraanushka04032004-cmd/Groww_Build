import React, { useState } from 'react';
import { aiApi } from '../api/ai.api.js';
import {
  IoSparklesOutline,
  IoRefreshOutline,
  IoCheckmarkCircleOutline,
  IoPulseOutline,
  IoAnalyticsOutline,
  IoEyeOutline,
  IoChevronForwardOutline,
} from 'react-icons/io5';

export const AIBriefingSection = ({ symbol }) => {
  const [briefingData, setBriefingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBriefing = async () => {
    if (!symbol) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await aiApi.getBriefing(symbol);
      setBriefingData(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to generate AI market briefing');
    } finally {
      setIsLoading(false);
    }
  };

  // Robust Section-Based Parser for Institutional LLM Briefings
  const parseBriefing = (text) => {
    if (!text) return { headerTitle: `Executive Catalyst Briefing: ${symbol}`, cards: [] };

    const sanitized = text
      .replace(/```markdown/gi, '')
      .replace(/```/g, '')
      .trim();

    // Split strictly on numbered major sections: "1. ", "2. ", "3. " or top-level "### "
    const parts = sanitized
      .split(/\n(?=[0-9]+\.\s*|\*{0,2}Point\s*[0-9]+|\s*###\s+)/gi)
      .map((s) => s.trim())
      .filter(Boolean);

    let headerTitle = `Executive Catalyst Briefing: ${symbol}`;
    const cards = [];

    for (const part of parts) {
      if (part.startsWith('#') || (!/^[0-9]+\./.test(part) && cards.length === 0 && !part.includes('**'))) {
        headerTitle = part.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
        continue;
      }

      const cleaned = part.replace(/^[0-9]+\.\s*/, '').trim();
      const match = cleaned.match(/^\*\*(.*?)\*\*[:\s]*([\s\S]*)$/);

      if (match) {
        const bodyContent = match[2]
          .trim()
          .replace(/^\s*[-*]\s+/gm, '• ')
          .replace(/\*\*/g, '');

        cards.push({
          title: match[1].trim(),
          body: bodyContent,
        });
      } else {
        const lines = cleaned.split('\n');
        const firstLine = lines[0].replace(/\*\*/g, '').trim();
        const rest = lines.slice(1).join('\n').trim().replace(/^\s*[-*]\s+/gm, '• ').replace(/\*\*/g, '');
        cards.push({
          title: firstLine,
          body: rest || firstLine,
        });
      }
    }

    return { headerTitle, cards };
  };

  const getIconForIndex = (index) => {
    if (index === 0) return <IoPulseOutline className="w-4 h-4 text-[#8C3F27]" />;
    if (index === 1) return <IoAnalyticsOutline className="w-4 h-4 text-[#006044]" />;
    return <IoEyeOutline className="w-4 h-4 text-[#C93400]" />;
  };

  return (
    <div className="rounded-2xl bg-[#FEECD3] border border-[#FFD6A7] p-3.5 sm:p-5 relative overflow-hidden shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#8C3F27]/15 border border-[#8C3F27]/30 flex items-center justify-center text-[#8C3F27] shadow-inner shrink-0">
            <IoSparklesOutline className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[#370A00] uppercase tracking-wider flex flex-wrap items-center gap-1.5">
              <span>Automated Catalyst Briefing</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#8C3F27]/10 text-[#8C3F27] border border-[#8C3F27]/30 font-bold whitespace-nowrap">
                Institutional Quant
              </span>
            </h4>
            <p className="text-[11px] text-[#7C2808] font-medium mt-0.5">
              Live market anomaly &amp; technical structure synthesized in real time
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchBriefing}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#370A00] hover:bg-[#250700] text-[#FFF7ED] text-xs font-bold shadow-md transition-all disabled:opacity-50 shrink-0 self-start sm:self-auto"
        >
          <IoRefreshOutline className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {briefingData ? 'Refresh Briefing' : 'Generate Briefing'}
        </button>
      </div>

      {isLoading && (
        <div className="p-6 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7] flex flex-col items-center justify-center gap-2.5 text-center">
          <div className="w-5 h-5 border-2 border-[#8C3F27] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#8C3F27] font-semibold">
            Synthesizing technical breakout & volume dynamics...
          </span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-[#A51D24]/10 border border-[#A51D24]/30 text-xs text-[#A51D24] font-medium">
          {error}
        </div>
      )}

      {!isLoading && !briefingData && !error && (
        <div className="p-4 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7] text-center">
          <p className="text-xs text-[#7C2808]">
            Click <strong className="text-[#370A00] font-bold">&quot;Generate Briefing&quot;</strong> to synthesize volume surges, breakout thresholds, and market structure for {symbol}.
          </p>
        </div>
      )}

      {!isLoading && briefingData && (() => {
        const { headerTitle, cards } = parseBriefing(briefingData.briefing);

        return (
          <div className="space-y-3.5">
            <div className="text-xs font-bold text-[#370A00] tracking-tight flex items-center gap-1.5 pb-0.5 font-sans">
              <IoChevronForwardOutline className="w-3.5 h-3.5 text-[#8C3F27]" />
              {headerTitle}
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FFF7ED] border border-[#FFD6A7] hover:border-[#8C3F27] transition-colors flex items-start gap-3 text-xs shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FEECD3] border border-[#FFD6A7] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {getIconForIndex(idx)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#370A00] text-xs mb-1 tracking-tight">
                      {card.title}
                    </div>
                    <div className="text-[#7C2808] leading-relaxed font-normal whitespace-pre-line">
                      {card.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#7C2808] font-mono pt-2 border-t border-[#FFD6A7]">
              <span className="flex items-center gap-1.5 text-[#006044] font-bold">
                <IoCheckmarkCircleOutline className="w-3.5 h-3.5" />
                Intelligence Engine: Active
              </span>
              <span>
                Generated at: {new Date(briefingData.timestamp).toLocaleTimeString()}
              </span>
            </div>

            {briefingData.note && (
              <p className="text-[10px] font-mono text-[#8C3F27] bg-[#FCB700]/15 px-2.5 py-1 rounded-lg border border-[#FCB700]/30 font-semibold">
                {briefingData.note}
              </p>
            )}
          </div>
        );
      })()}
    </div>
  );
};


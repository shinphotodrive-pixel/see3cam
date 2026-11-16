import { getHighlightSegments } from '../utils/searchEngine';

interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
}

export function HighlightText({ text, query, className = '' }: HighlightTextProps) {
  const segments = getHighlightSegments(text, query);

  return (
    <span className={className}>
      {segments.map((seg, idx) =>
        seg.highlighted ? (
          <mark
            key={idx}
            className="bg-amber-200/80 dark:bg-amber-500/30 text-slate-950 dark:text-amber-100 rounded-xs px-0.5 font-medium"
          >
            {seg.text}
          </mark>
        ) : (
          <span key={idx}>{seg.text}</span>
        )
      )}
    </span>
  );
}

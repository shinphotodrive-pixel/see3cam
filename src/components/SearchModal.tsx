import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, FileText, Search, X } from 'lucide-react';
import { SearchCategory, SearchResultEntry } from '../types/manual';
import { POPULAR_SEARCH_QUERIES, searchManual } from '../utils/searchEngine';
import { HighlightText } from './HighlightText';

interface SearchModalProps {
  isOpen: boolean;
  initialQuery?: string;
  onClose: () => void;
  onSelectResult: (entry: SearchResultEntry) => void;
  onOpenPdf: (pdfId: string, page: number) => void;
}

const CATEGORY_TABS: { id: SearchCategory; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'spec', label: '사양·기구' },
  { id: 'pinout', label: '핀맵·회로' },
  { id: 'software', label: '소프트웨어' },
  { id: 'sdk', label: 'SDK API' },
  { id: 'faq', label: '트러블슈팅' },
  { id: 'pdf', label: '원본 PDF' },
];

export function SearchModal({
  isOpen,
  initialQuery = '',
  onClose,
  onSelectResult,
  onOpenPdf,
}: SearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<SearchCategory>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const results = useMemo(() => searchManual(query, category, 35), [query, category]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 backdrop-blur-xs p-4 pt-12 sm:pt-16"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="핀맵(TRIG, STROBE), 해상도, 소비전력, 노출, SDK 함수명, 오류 증상 검색..."
            className="w-full bg-transparent text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
            >
              지우기
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="검색창 닫기"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Segmented Filter */}
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          <div className="flex items-center gap-1">
            {CATEGORY_TABS.map((tab) => {
              const active = category === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategory(tab.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
            검색 결과 {results.length}건
          </span>
        </div>

        {/* Popular Suggestions when query is empty */}
        {!query.trim() && (
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              자주 찾는 기술 키워드
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SEARCH_QUERIES.map((item) => (
                <button
                  key={item.query}
                  type="button"
                  onClick={() => setQuery(item.query)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800">
          {results.length === 0 ? (
            <div className="py-14 px-6 text-center">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                &ldquo;{query}&rdquo;에 일치하는 매뉴얼 항목이 없습니다.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                GPIO, TRIG, STROBE, 120fps, AR0234, QtCAM, DFU, SetStreamMode24CUG 등 영문/국문 키워드로 검색해 보세요.
              </p>
            </div>
          ) : (
            results.map((entry) => (
              <div
                key={entry.id}
                className="px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectResult(entry);
                    onClose();
                  }}
                  className="text-left flex-1 min-w-0 group"
                >
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-0.5">
                    {entry.categoryLabel} · 원본 PDF p.{entry.pdfPage}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <HighlightText text={entry.title} query={query} />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    <HighlightText text={entry.subtitle} query={query} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    <HighlightText text={entry.body} query={query} />
                  </p>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectResult(entry);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                  >
                    <span>섹션 보기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenPdf(entry.pdfId, entry.pdfPage);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors tabular-nums"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF p.{entry.pdfPage}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clean Hint Footer */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>한글·영문 동의어 자동 매칭 지원 (예: 트리거 ↔ Trigger / 핀맵 ↔ GPIO)</span>
          <span className="font-mono">ESC 닫기</span>
        </div>
      </div>
    </div>
  );
}

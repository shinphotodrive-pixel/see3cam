import { useMemo, useState } from 'react';
import { Download, Eye, Search } from 'lucide-react';
import { PDF_DOCUMENTS } from '../data/pdfDocuments';
import { PdfCategory } from '../types/manual';
import { HighlightText } from './HighlightText';

interface PdfLibrarySectionProps {
  onOpenPdf: (pdfId: string, page: number) => void;
}

const PDF_FILTERS: { id: 'all' | PdfCategory; label: string }[] = [
  { id: 'all', label: '전체 문서 (14)' },
  { id: 'datasheet', label: '데이터시트 (2)' },
  { id: 'getting-started', label: '시작·마운팅 (2)' },
  { id: 'software-win', label: 'Windows 앱 (2)' },
  { id: 'software-linux', label: 'Linux 앱 (2)' },
  { id: 'sdk-appnote', label: 'SDK·DFU·앱노트 (3)' },
  { id: 'certification', label: '인증·신뢰성 성적서 (3)' },
];

export function PdfLibrarySection({ onOpenPdf }: PdfLibrarySectionProps) {
  const [category, setCategory] = useState<'all' | PdfCategory>('all');
  const [query, setQuery] = useState('');

  const filteredDocs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PDF_DOCUMENTS.filter((doc) => {
      const matchCat = category === 'all' || doc.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        doc.titleKo.toLowerCase().includes(q) ||
        doc.titleEn.toLowerCase().includes(q) ||
        doc.summaryKo.toLowerCase().includes(q) ||
        doc.keywords.some((k) => k.toLowerCase().includes(q)) ||
        doc.toc.some((t) => t.title.toLowerCase().includes(q))
      );
    });
  }, [category, query]);

  const totalPages = useMemo(
    () => PDF_DOCUMENTS.reduce((acc, d) => acc + d.pages, 0),
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            원본 기술자료 PDF 아카이브 (14종 · 총 {totalPages}페이지)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            모든 공식 영문 매뉴얼과 시험 성적서를 브라우저 내장 뷰어로 원하는 페이지부터 즉시 열람하거나 원본 파일로 다운로드할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Category Filter + Document Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          {PDF_FILTERS.map((f) => {
            const active = category === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setCategory(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="문서명, 목차, 키워드 필터..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Document Grid */}
      {filteredDocs.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-sm text-slate-500">
          검색 조건에 일치하는 PDF 매뉴얼이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDocs.map((doc) => (
            <article
              key={doc.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                {/* Zero-pill plain metadata line */}
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium tabular-nums">
                  {doc.categoryLabel} · {doc.version} · {doc.date} · {doc.pages}페이지
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    <HighlightText text={doc.titleKo} query={query} />
                  </h2>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    <HighlightText text={doc.titleEn} query={query} />
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <HighlightText text={doc.summaryKo} query={query} />
                </p>

                {/* Key TOC Quick Jump Links */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    주요 목차 바로 열기
                  </div>
                  <div className="space-y-1">
                    {doc.toc.slice(0, 4).map((ch) => (
                      <button
                        key={`${doc.id}-${ch.page}`}
                        type="button"
                        onClick={() => onOpenPdf(doc.id, ch.page)}
                        className="w-full text-left text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between gap-2 py-0.5 transition-colors"
                      >
                        <span className="truncate">· {ch.title}</span>
                        <span className="font-mono text-[11px] text-slate-400 tabular-nums shrink-0">
                          p.{ch.page}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onOpenPdf(doc.id, 1)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>내장 뷰어로 열람</span>
                </button>

                <a
                  href={doc.path}
                  download={doc.fileName}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>원본 다운로드</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

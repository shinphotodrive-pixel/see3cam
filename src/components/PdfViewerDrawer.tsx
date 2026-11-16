import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, FileText, X } from 'lucide-react';
import { PDF_DOCUMENTS } from '../data/pdfDocuments';

interface PdfViewerDrawerProps {
  pdfId: string | null;
  initialPage: number;
  onClose: () => void;
  onChangePdf: (pdfId: string, page: number) => void;
}

export function PdfViewerDrawer({
  pdfId,
  initialPage,
  onClose,
  onChangePdf,
}: PdfViewerDrawerProps) {
  const [page, setPage] = useState(initialPage || 1);

  useEffect(() => {
    setPage(initialPage || 1);
  }, [pdfId, initialPage]);

  useEffect(() => {
    if (!pdfId) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pdfId, onClose]);

  if (!pdfId) return null;

  const currentDoc = PDF_DOCUMENTS.find((d) => d.id === pdfId) ?? PDF_DOCUMENTS[0];
  const clampedPage = Math.min(Math.max(1, page), currentDoc.pages);
  const iframeSrc = `${currentDoc.path}#page=${clampedPage}&view=FitH`;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Viewer Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {currentDoc.categoryLabel} · {currentDoc.version} · 총 {currentDoc.pages}페이지
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
              {currentDoc.titleKo}{' '}
              <span className="font-normal text-sm text-slate-500 dark:text-slate-400">
                ({currentDoc.titleEn})
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Page Stepper */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1">
              <button
                type="button"
                disabled={clampedPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="이전 페이지"
                className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-35"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono tabular-nums text-slate-800 dark:text-slate-200 px-1.5">
                p.{clampedPage} / {currentDoc.pages}
              </span>
              <button
                type="button"
                disabled={clampedPage >= currentDoc.pages}
                onClick={() => setPage((p) => Math.min(currentDoc.pages, p + 1))}
                aria-label="다음 페이지"
                className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-35"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <a
              href={currentDoc.path}
              download={currentDoc.fileName}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF 다운로드</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="뷰어 닫기"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body: Left TOC / Document Switcher + Right Embedded PDF */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 overflow-y-auto p-4 space-y-5 shrink-0 max-h-48 lg:max-h-none">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 mb-2">
                주요 섹션 바로가기
              </div>
              <div className="space-y-1">
                {currentDoc.toc.map((chapter) => {
                  const isActive = clampedPage === chapter.page;
                  return (
                    <button
                      key={`${chapter.page}-${chapter.title}`}
                      type="button"
                      onClick={() => setPage(chapter.page)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-start justify-between gap-2 ${
                        isActive
                          ? 'bg-blue-600 text-white font-medium'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="leading-snug">{chapter.title}</span>
                      <span
                        className={`font-mono tabular-nums shrink-0 ${
                          isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        p.{chapter.page}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 mb-2">
                전체 매뉴얼 전환 (14종)
              </div>
              <div className="space-y-1">
                {PDF_DOCUMENTS.map((doc) => {
                  const selected = doc.id === currentDoc.id;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => onChangePdf(doc.id, 1)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                        selected
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 shrink-0 opacity-75" />
                      <span className="truncate">{doc.titleKo}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="flex-1 bg-slate-200 dark:bg-slate-950 min-h-0">
            <iframe
              key={`${currentDoc.id}-${clampedPage}`}
              src={iframeSrc}
              title={currentDoc.titleKo}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

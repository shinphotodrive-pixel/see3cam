import { useCallback, useEffect, useState } from 'react';
import { Camera, FileText, Moon, Search, Sun } from 'lucide-react';
import { MainTabId, SearchResultEntry } from './types/manual';
import { OverviewSection } from './components/OverviewSection';
import { HardwareSection } from './components/HardwareSection';
import { SoftwareSection } from './components/SoftwareSection';
import { SdkSection } from './components/SdkSection';
import { AnprSection } from './components/AnprSection';
import { PdfLibrarySection } from './components/PdfLibrarySection';
import { SearchModal } from './components/SearchModal';
import { PdfViewerDrawer } from './components/PdfViewerDrawer';

const NAV_ITEMS: { id: MainTabId; label: string; desc: string }[] = [
  { id: 'overview', label: '개요·검색', desc: '통합 검색 · 핵심 사양 · 전력 · 트러블슈팅' },
  { id: 'hardware', label: '하드웨어·핀맵', desc: '6핀 GPIO · USB-C · 광학 · 기구 · 신뢰성' },
  { id: 'software', label: '소프트웨어', desc: 'e-CAMView · QtCAM · 노출 매핑 · DFU 복구' },
  { id: 'sdk', label: 'SDK API (31)', desc: 'C/C++ Extension Unit 전체 함수 레퍼런스' },
  { id: 'anpr', label: '번호인식', desc: '3.5m 레이더(80m) 과속 검지 · 10m 베스트 셔터링 · 야간 Strobe & SDK 제어' },
  { id: 'pdfs', label: '원본 PDF (14)', desc: '공식 데이터시트·매뉴얼·성적서 원문 뷰어' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTabId>('overview');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Global Search Modal State
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalPrefill, setSearchModalPrefill] = useState('');

  // Selected SDK API for deep linking
  const [selectedApiId, setSelectedApiId] = useState<string | null>('InitExtensionUnit');

  // Inline PDF Viewer Drawer State
  const [viewerPdfId, setViewerPdfId] = useState<string | null>(null);
  const [viewerPage, setViewerPage] = useState<number>(1);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Global Cmd+K / Ctrl+K Shortcut
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalPrefill('');
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleOpenPdf = useCallback((pdfId: string, page = 1) => {
    setViewerPdfId(pdfId);
    setViewerPage(page);
  }, []);

  const handleOpenCommandModal = useCallback((prefill = '') => {
    setSearchModalPrefill(prefill);
    setSearchModalOpen(true);
  }, []);

  const handleSelectSearchResult = useCallback((entry: SearchResultEntry) => {
    setActiveTab(entry.targetTab);

    if (entry.targetApiId) {
      setSelectedApiId(entry.targetApiId);
    }

    if (entry.targetSection) {
      setTimeout(() => {
        const el = document.getElementById(entry.targetSection!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const currentNavMeta = NAV_ITEMS.find((n) => n.id === activeTab) ?? NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left shrink-0 group"
          >
            <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-slate-50 whitespace-nowrap">
              See3CAM_24CUG 매뉴얼
            </span>
          </button>

          {/* Zone 2: 5 Single-line Navigation Links */}
          <nav
            aria-label="주요 매뉴얼 메뉴"
            className="hidden md:flex items-center gap-6 overflow-x-auto"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-sm font-medium whitespace-nowrap py-5 border-b-2 transition-colors ${
                    active
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Search Action Button */}
          <button
            type="button"
            onClick={() => handleOpenCommandModal('')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium whitespace-nowrap transition-colors shrink-0 shadow-2xs"
          >
            <Search className="w-4 h-4" />
            <span>매뉴얼 검색</span>
            <kbd className="hidden sm:inline-block font-mono text-[11px] bg-blue-700/80 px-1.5 py-0.5 rounded text-blue-100">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Mobile Secondary Horizontal Nav */}
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-1.5 overflow-x-auto bg-slate-50/80 dark:bg-slate-950/60">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Secondary Workspace Bar (Breadcrumb + Quick Datasheet + Theme Switcher) */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              {currentNavMeta.label}
            </span>{' '}
            · {currentNavMeta.desc}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenPdf('datasheet', 1)}
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>데이터시트 즉시 열기</span>
            </button>

            <span className="text-slate-300 dark:text-slate-700">|</span>

            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              aria-label="테마 전환"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>라이트 모드</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span>다크 모드</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'overview' && (
          <OverviewSection
            onSelectSearchResult={handleSelectSearchResult}
            onOpenPdf={handleOpenPdf}
            onOpenCommandModal={handleOpenCommandModal}
          />
        )}
        {activeTab === 'hardware' && (
          <HardwareSection onOpenPdf={handleOpenPdf} />
        )}
        {activeTab === 'software' && (
          <SoftwareSection onOpenPdf={handleOpenPdf} />
        )}
        {activeTab === 'sdk' && (
          <SdkSection
            selectedApiId={selectedApiId}
            onSelectApiId={setSelectedApiId}
            onOpenPdf={handleOpenPdf}
          />
        )}
        {activeTab === 'anpr' && (
          <AnprSection
            onOpenPdf={handleOpenPdf}
            onJumpToSdkApi={(apiId) => {
              setSelectedApiId(apiId);
              setActiveTab('sdk');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {activeTab === 'pdfs' && (
          <PdfLibrarySection onOpenPdf={handleOpenPdf} />
        )}
      </main>

      {/* Clean Technical Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            See3CAM_24CUG 기술자료 매뉴얼 포털 · onsemi AR0234CS 2.3MP Global Shutter USB 3.2 Gen 1 UVC Camera
          </div>
          <div className="font-mono">
            VID 0x2560 · PID 0xC128 · 공식 문서 14종 수록
          </div>
        </div>
      </footer>

      {/* Global Search Command Palette Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        initialQuery={searchModalPrefill}
        onClose={() => setSearchModalOpen(false)}
        onSelectResult={handleSelectSearchResult}
        onOpenPdf={handleOpenPdf}
      />

      {/* Embedded Original PDF Drawer */}
      <PdfViewerDrawer
        pdfId={viewerPdfId}
        initialPage={viewerPage}
        onClose={() => setViewerPdfId(null)}
        onChangePdf={handleOpenPdf}
      />
    </div>
  );
}

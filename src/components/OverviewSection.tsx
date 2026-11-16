import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  FileText,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  CAMERA_VARIANTS,
  CORE_SPECS_SUMMARY,
  STREAM_POWER_SPECS,
} from '../data/hardwareData';
import {
  FAQ_ITEMS,
  TROUBLESHOOTING_ITEMS,
} from '../data/softwareAndFaqData';
import { SearchCategory, SearchResultEntry } from '../types/manual';
import { POPULAR_SEARCH_QUERIES, searchManual } from '../utils/searchEngine';
import { HighlightText } from './HighlightText';

interface OverviewSectionProps {
  onSelectSearchResult: (entry: SearchResultEntry) => void;
  onOpenPdf: (pdfId: string, page: number) => void;
  onOpenCommandModal: (prefill?: string) => void;
}

const INLINE_CATEGORIES: { id: SearchCategory; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'spec', label: '사양·기구' },
  { id: 'pinout', label: '핀맵·회로' },
  { id: 'software', label: '소프트웨어' },
  { id: 'sdk', label: 'SDK API' },
  { id: 'faq', label: '트러블슈팅' },
  { id: 'pdf', label: '원본 PDF' },
];

export function OverviewSection({
  onSelectSearchResult,
  onOpenPdf,
  onOpenCommandModal,
}: OverviewSectionProps) {
  const [heroQuery, setHeroQuery] = useState('');
  const [heroCategory, setHeroCategory] = useState<SearchCategory>('all');

  // Stream & Power Explorer Filters
  const [formatFilter, setFormatFilter] = useState<'ALL' | 'UYVY' | 'MJPEG'>('ALL');
  const [usbFilter, setUsbFilter] = useState<'ALL' | 'USB 3.2 Gen 1' | 'USB 2.0'>('USB 3.2 Gen 1');

  // Troubleshooting & FAQ Filters
  const [tsOsFilter, setTsOsFilter] = useState<'전체' | '공통' | 'DFU'>('전체');
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0]?.id ?? '');

  const inlineResults = useMemo(() => {
    if (!heroQuery.trim()) return [];
    return searchManual(heroQuery, heroCategory, 12);
  }, [heroQuery, heroCategory]);

  const filteredStreams = useMemo(() => {
    return STREAM_POWER_SPECS.filter((row) => {
      const matchFmt = formatFilter === 'ALL' || row.format === formatFilter;
      const matchUsb = usbFilter === 'ALL' || row.usbGeneration === usbFilter;
      return matchFmt && matchUsb;
    });
  }, [formatFilter, usbFilter]);

  const filteredTroubleshooting = useMemo(() => {
    if (tsOsFilter === '전체') return TROUBLESHOOTING_ITEMS;
    return TROUBLESHOOTING_ITEMS.filter((item) => item.osScope === tsOsFilter);
  }, [tsOsFilter]);

  return (
    <div className="space-y-12">
      {/* 1. Prominent Technical Search Hero */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 tracking-wide">
            e-con Systems 공식 기술문서 14종 통합 지식베이스 · AR0234CS 2.3MP Global Shutter UVC
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            See3CAM_24CUG 기술자료 매뉴얼 통합 검색
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            데이터시트, 6핀 GPIO·USB-C 핀맵, 기구 마운팅, Windows/Linux 스트리밍 제어, 31개 C++ SDK API, DFU 펌웨어 복구 절차를 한글·영문 키워드로 즉시 검색하세요.
          </p>
        </div>

        {/* Main Search Input Box */}
        <div className="mt-6">
          <div className="relative flex items-center rounded-xl border-2 border-slate-300 dark:border-slate-700 focus-within:border-blue-600 dark:focus-within:border-blue-500 bg-slate-50/70 dark:bg-slate-950 transition-colors">
            <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 ml-4 shrink-0" />
            <input
              type="text"
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              placeholder="검색어 입력: 예) GPIO 핀맵, TRIG 전압, 120fps 전력, 노출 매핑, QtCAM 설치, SetStreamMode24CUG, DFU..."
              aria-label="기술자료 통합 검색"
              className="w-full py-3.5 px-3.5 bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            />
            {heroQuery && (
              <button
                type="button"
                onClick={() => setHeroQuery('')}
                aria-label="검색어 지우기"
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenCommandModal(heroQuery)}
              className="mr-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium whitespace-nowrap transition-colors"
            >
              상세 검색창
            </button>
          </div>

          {/* Quick Keyword Buttons */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">추천 검색:</span>
            {POPULAR_SEARCH_QUERIES.map((q) => (
              <button
                key={q.query}
                type="button"
                onClick={() => setHeroQuery(q.query)}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Inline Search Results Panel */}
        {heroQuery.trim().length > 0 && (
          <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 overflow-x-auto">
                {INLINE_CATEGORIES.map((cat) => {
                  const active = heroCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setHeroCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                        active
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                일치 항목 {inlineResults.length}건
              </span>
            </div>

            {inlineResults.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-600 dark:text-slate-400">
                일치하는 결과가 없습니다. 다른 기술 용어(예: <span className="font-mono">STROBE</span>, <span className="font-mono">M12</span>, <span className="font-mono">0xFFBC</span>)로 검색해 보세요.
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-96 overflow-y-auto">
                {inlineResults.map((entry) => (
                  <div
                    key={entry.id}
                    className="px-4 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectSearchResult(entry)}
                      className="text-left flex-1 min-w-0 group"
                    >
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {entry.categoryLabel} · 원본 PDF p.{entry.pdfPage}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mt-0.5">
                        <HighlightText text={entry.title} query={heroQuery} />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        <HighlightText text={entry.body} query={heroQuery} />
                      </p>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSelectSearchResult(entry)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                      >
                        <span>바로 이동</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenPdf(entry.pdfId, entry.pdfPage)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors tabular-nums"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF p.{entry.pdfPage}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 2. Core Specifications Summary Grid */}
      <section aria-labelledby="core-specs-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <div>
            <h2 id="core-specs-heading" className="text-lg font-bold text-slate-900 dark:text-slate-100">
              핵심 하드웨어 및 인터페이스 요약
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              출처: See3CAM_24CUG Datasheet (Rev 1.6) · Lens Datasheet (Rev 1.5)
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenPdf('datasheet', 6)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>데이터시트 원문 확인 (p.6)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CORE_SPECS_SUMMARY.map((spec) => (
            <div
              key={spec.label}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
            >
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {spec.label}
              </div>
              <div className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50 font-mono tabular-nums">
                {spec.value}
              </div>
              <div className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {spec.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 3-Variant Comparison Table */}
      <section id="variants-section" className="scroll-mt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              제품군 3종 모델 비교 (Ordering Variants)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              인클로저 유무에 따라 외부 GPIO 트리거/스트로브 사용 가능 여부와 동작 온도가 달라집니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenPdf('datasheet', 4)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>모델 사양 원문 (p.4)</span>
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold whitespace-nowrap">파트 넘버 (모델명)</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">렌즈 & 하우징</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">외형 치수</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">6핀 GPIO · 스트림 모드</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">동작 온도 / 보관 한계</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {CAMERA_VARIANTS.map((v) => (
                <tr key={v.partNumber} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {v.partNumber}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {v.nameKo}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-top text-slate-700 dark:text-slate-300">
                    <div>{v.lensIncluded}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      하우징: {v.enclosure} · LED {v.ledVisible}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-top font-mono tabular-nums text-xs text-slate-700 dark:text-slate-300">
                    <div>{v.dimensionsMm}</div>
                    <div className="font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                      {v.cableIncluded}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-top text-slate-700 dark:text-slate-300">
                    <div className="font-medium">{v.streamModes}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      GPIO: {v.gpioHeader} · Strobe: {v.strobeSupport}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-top font-mono tabular-nums text-xs text-slate-700 dark:text-slate-300">
                    <div>동작: {v.operatingTemp}</div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                      보관: {v.highStorageTemp}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Interactive Stream Format, FPS & Power Consumption Explorer */}
      <section id="power-explorer-section" className="scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              해상도 · 프레임레이트 · 소비전력 측정 매트릭스
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              5V 공급 기준 실측 전류/전력 및 센서 FOV 크롭 비율 (유휴 대기 전력: 62 mA / 0.31 W)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
              {(['ALL', 'UYVY', 'MJPEG'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormatFilter(fmt)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    formatFilter === fmt
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {fmt === 'ALL' ? '포맷 전체' : fmt}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
              {(['USB 3.2 Gen 1', 'USB 2.0', 'ALL'] as const).map((usb) => (
                <button
                  key={usb}
                  type="button"
                  onClick={() => setUsbFilter(usb)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    usbFilter === usb
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {usb === 'ALL' ? 'USB 전체' : usb}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">출력 포맷</th>
                <th className="py-3 px-4 font-semibold">인터페이스</th>
                <th className="py-3 px-4 font-semibold">해상도</th>
                <th className="py-3 px-4 font-semibold">측정 FPS (지원 옵션)</th>
                <th className="py-3 px-4 font-semibold">FOV 크롭 (H / V)</th>
                <th className="py-3 px-4 font-semibold">소비 전류 (@5V)</th>
                <th className="py-3 px-4 font-semibold">소비 전력</th>
                <th className="py-3 px-4 font-semibold">기본 AE 보정</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredStreams.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {row.format}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">
                    {row.usbGeneration}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-800 dark:text-slate-200">
                    {row.resolutionPx}{' '}
                    <span className="font-sans text-xs text-slate-500 dark:text-slate-400">
                      {row.resolutionLabel}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-900 dark:text-slate-100">
                    <span className="font-semibold">{row.measuredFps} fps</span>{' '}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ({row.fpsOptions})
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    H {row.cropHorizontal} · V {row.cropVertical}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-800 dark:text-slate-200">
                    {row.currentMa} mA
                  </td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {row.powerW.toFixed(3)} W
                  </td>
                  <td className="py-2.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {row.defaultExpCompUs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Status LED Diagnostics & Troubleshooting + Technical FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Troubleshooting (7 cols) */}
        <section id="troubleshooting-section" className="lg:col-span-7 scroll-mt-24">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                상태 표시 LED 판독 및 현장 트러블슈팅
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                적색(전원 대기) · 황색(정상 스트리밍) · 점멸/미인식 증상별 즉시 해결책
              </p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
              {(['전체', '공통', 'DFU'] as const).map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => setTsOsFilter(scope)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    tsOsFilter === scope
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {scope}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
            {filteredTroubleshooting.map((ts) => (
              <div key={ts.id} className="p-4">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    LED 상태: {ts.ledState} · 범위: {ts.osScope}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenPdf(ts.relatedPdfId, ts.relatedPage)}
                    className="font-mono hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2"
                  >
                    매뉴얼 p.{ts.relatedPage}
                  </button>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {ts.symptomKo}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  원인: {ts.causeKo}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">
                  조치: {ts.solutionKo}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical FAQ Accordion (5 cols) */}
        <section id="faq-section" className="lg:col-span-5 scroll-mt-24">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              엔지니어링 자주 묻는 질문 (FAQ)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              프레임 드랍 방지, 최소 초점 거리(10cm), 방열, 레지스터 접근 정책
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                    className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                        {faq.category}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                        {faq.questionKo}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                      <p>{faq.answerKo}</p>
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => onOpenPdf(faq.relatedPdfId, faq.relatedPage)}
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>출처 PDF 열기 (p.{faq.relatedPage})</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

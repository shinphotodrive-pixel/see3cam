import { useEffect, useMemo, useState } from 'react';
import { Check, Code2, Copy, FileText, Search } from 'lucide-react';
import { SDK_APIS, SDK_PREREQUISITES } from '../data/sdkApis';
import { SdkApiItem } from '../types/manual';

interface SdkSectionProps {
  selectedApiId: string | null;
  onSelectApiId: (apiId: string) => void;
  onOpenPdf: (pdfId: string, page: number) => void;
}

const API_GROUPS: { id: 'all' | SdkApiItem['group']; label: string }[] = [
  { id: 'all', label: '전체 (31)' },
  { id: 'init', label: '장치 초기화·정보 (7)' },
  { id: 'image', label: '화질·특수효과·플립 (8)' },
  { id: 'exposure', label: '노출·ROI·FPS (8)' },
  { id: 'trigger', label: '트리거·스트로브 (4)' },
  { id: 'face-system', label: '얼굴인식·복원·리셋 (4)' },
];

export function SdkSection({
  selectedApiId,
  onSelectApiId,
  onOpenPdf,
}: SdkSectionProps) {
  const [groupFilter, setGroupFilter] = useState<'all' | SdkApiItem['group']>('all');
  const [filterText, setFilterText] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredApis = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return SDK_APIS.filter((api) => {
      const matchGroup = groupFilter === 'all' || api.group === groupFilter;
      if (!matchGroup) return false;
      if (!q) return true;
      return (
        api.name.toLowerCase().includes(q) ||
        api.summaryKo.toLowerCase().includes(q) ||
        api.signature.toLowerCase().includes(q) ||
        api.params.some((p) => p.name.toLowerCase().includes(q))
      );
    });
  }, [groupFilter, filterText]);

  const activeApi = useMemo(() => {
    if (selectedApiId) {
      const found = SDK_APIS.find((a) => a.id === selectedApiId);
      if (found) return found;
    }
    return filteredApis[0] ?? SDK_APIS[0];
  }, [selectedApiId, filteredApis]);

  useEffect(() => {
    setCopiedCode(false);
  }, [activeApi.id]);

  const handleCopySample = () => {
    navigator.clipboard.writeText(activeApi.sampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header & Build Environment Summary */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
              See3CAM_24CUG Extension Unit SDK API Manual (Ver 1.7)
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-0.5">
              C/C++ Extension Unit SDK API 레퍼런스 (전 31개 함수)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              런타임 요구사항: {SDK_PREREQUISITES.runtime} · 빌드 환경: {SDK_PREREQUISITES.ide}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenPdf('sdk-api', 4)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>SDK 원본 PDF 열기</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
          호출 순서: {SDK_PREREQUISITES.callOrder}
        </div>
      </div>

      {/* Group Segmented Bar + Filter Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {API_GROUPS.map((grp) => {
            const active = groupFilter === grp.id;
            return (
              <button
                key={grp.id}
                type="button"
                onClick={() => setGroupFilter(grp.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500'
                }`}
              >
                {grp.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="API 함수명 또는 기능 필터..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Master-Detail Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Function List (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>함수 목록</span>
            <span className="tabular-nums">{filteredApis.length}개</span>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-[620px] overflow-y-auto">
            {filteredApis.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                조건에 맞는 API 함수가 없습니다.
              </div>
            ) : (
              filteredApis.map((api) => {
                const isSelected = api.id === activeApi.id;
                return (
                  <button
                    key={api.id}
                    type="button"
                    onClick={() => onSelectApiId(api.id)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-mono text-xs font-semibold truncate ${
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {api.name}()
                      </span>
                      <span className="font-mono text-[11px] text-slate-400 tabular-nums shrink-0">
                        p.{api.pdfPage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {api.summaryKo}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Selected API Detail Pane (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {activeApi.groupLabel} · SDK 매뉴얼 p.{activeApi.pdfPage}
              </div>
              <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-slate-50 mt-1">
                {activeApi.name}()
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onOpenPdf('sdk-api', activeApi.pdfPage)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors tabular-nums"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>원본 PDF p.{activeApi.pdfPage} 보기</span>
            </button>
          </div>

          {/* C++ Prototype */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              함수 원형 (C/C++ Prototype)
            </div>
            <pre className="p-3.5 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto">
              {activeApi.signature};
            </pre>
          </div>

          {/* Description & Return */}
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>{activeApi.summaryKo}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              반환값(Return): <span className="font-mono text-slate-800 dark:text-slate-200">{activeApi.returnDesc}</span>
            </p>
            {activeApi.notesKo && (
              <p className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-950/30 rounded-lg px-3 py-2">
                참고: {activeApi.notesKo}
              </p>
            )}
          </div>

          {/* Parameters Table */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              파라미터 명세
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2 px-3 font-semibold">인자명</th>
                    <th className="py-2 px-3 font-semibold">데이터 타입</th>
                    <th className="py-2 px-3 font-semibold">방향</th>
                    <th className="py-2 px-3 font-semibold">설명</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {activeApi.params.map((p) => (
                    <tr key={p.name}>
                      <td className="py-2 px-3 font-mono font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {p.name}
                      </td>
                      <td className="py-2 px-3 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {p.type}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {p.direction}
                      </td>
                      <td className="py-2 px-3 text-slate-700 dark:text-slate-300">
                        {p.descriptionKo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Constants Table if applicable */}
          {activeApi.constants && activeApi.constants.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                지원 상수 코드 (Hex Constants)
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2 px-3 font-semibold w-24">Hex 값</th>
                      <th className="py-2 px-3 font-semibold w-44">심볼 / 모드</th>
                      <th className="py-2 px-3 font-semibold">동작 설명</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {activeApi.constants.map((c) => (
                      <tr key={c.hex}>
                        <td className="py-2 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {c.hex}
                        </td>
                        <td className="py-2 px-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                          {c.label}
                        </td>
                        <td className="py-2 px-3 text-slate-700 dark:text-slate-300">
                          {c.descriptionKo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Copyable Sample Code */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Code2 className="w-3.5 h-3.5" />
                <span>C++ 호출 예제 코드</span>
              </span>
              <button
                type="button"
                onClick={handleCopySample}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>예제 복사</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto">
              {activeApi.sampleCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

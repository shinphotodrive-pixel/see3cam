import { useState } from 'react';
import { FileText } from 'lucide-react';
import {
  CONNECTOR_PARTS,
  DC_CHARACTERISTICS,
  GPIO_PINOUT,
  MOUNTING_SPECS,
  OPTICAL_LENS_SPECS,
  RELIABILITY_AND_EMC_TESTS,
  USBC_PINOUT,
} from '../data/hardwareData';

interface HardwareSectionProps {
  onOpenPdf: (pdfId: string, page: number) => void;
}

export function HardwareSection({ onOpenPdf }: HardwareSectionProps) {
  const [selectedGpioPin, setSelectedGpioPin] = useState<number>(4);

  const activePin = GPIO_PINOUT.find((p) => p.pin === selectedGpioPin) ?? GPIO_PINOUT[0];

  return (
    <div className="space-y-12">
      {/* Sub-navigation Anchors */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            하드웨어 · 핀맵 · 광학 · 기구 명세
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            회로 설계용 6핀 GPIO 및 24핀 USB Type-C 핀배열, M12 광학 특성, M2 마운팅 홀 깊이 및 환경 신뢰성 성적서
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { href: '#hw-pinout', label: '6핀 GPIO & USB-C 핀맵' },
            { href: '#hw-optics', label: 'AR0234 광학 & FOV 크롭' },
            { href: '#hw-mechanical', label: '기구 도면 & M2 마운팅' },
            { href: '#hw-reliability', label: '신뢰성 & CE/FCC 인증' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* 1. 6-Pin GPIO Interactive Diagram & Pinout + DC Specs */}
      <section id="hw-pinout" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              1. 6핀 GPIO 헤더 (CN6 / CN2) 및 24핀 USB Type-C 핀맵
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              보드 장착 파트: Molex 202396-0607 (1.00mm 피치) · 케이블 매칭 하우징: Molex 0151330602 (보드형 CHL_TC / CH_TC 지원)
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenPdf('datasheet', 8)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>데이터시트 핀맵 원문 (p.8–12)</span>
          </button>
        </div>

        {/* Interactive SVG 6-Pin Header Schematic + Selected Pin Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                인터랙티브 6핀 GPIO 커넥터 다이어그램 (핀 클릭 시 회로 주의사항 표시)
              </div>
              <svg
                viewBox="0 0 380 185"
                className="w-full h-auto select-none"
                role="img"
                aria-label="See3CAM_24CUG 6-Pin GPIO Header CN6 Pinout"
              >
                {/* Connector Outer Shroud */}
                <rect
                  x="24"
                  y="24"
                  width="332"
                  height="112"
                  rx="10"
                  className="fill-slate-100 dark:fill-slate-950 stroke-slate-300 dark:stroke-slate-700"
                  strokeWidth="2"
                />
                <rect
                  x="38"
                  y="38"
                  width="304"
                  height="84"
                  rx="6"
                  className="fill-white dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-800"
                  strokeWidth="1.5"
                />
                <text
                  x="190"
                  y="16"
                  textAnchor="middle"
                  className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono"
                >
                  Molex 202396-0607 · 1.00mm Pitch Right-Angle SMT
                </text>

                {GPIO_PINOUT.map((p, idx) => {
                  const cx = 65 + idx * 50;
                  const isSelected = p.pin === selectedGpioPin;
                  return (
                    <g
                      key={p.pin}
                      onClick={() => setSelectedGpioPin(p.pin)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={cx - 18}
                        y={48}
                        width="36"
                        height="64"
                        rx="6"
                        className={
                          isSelected
                            ? 'fill-blue-600 stroke-blue-700 dark:stroke-blue-400'
                            : 'fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700 hover:stroke-blue-500'
                        }
                        strokeWidth="1.5"
                      />
                      {/* Gold contact pin */}
                      <rect
                        x={cx - 5}
                        y={66}
                        width="10"
                        height="26"
                        rx="2"
                        className={isSelected ? 'fill-amber-300' : 'fill-amber-400/90'}
                      />
                      <text
                        x={cx}
                        y={60}
                        textAnchor="middle"
                        className={`text-[10px] font-mono font-bold ${
                          isSelected ? 'fill-white' : 'fill-slate-700 dark:fill-slate-300'
                        }`}
                      >
                        P{p.pin}
                      </text>
                      <text
                        x={cx}
                        y={156}
                        textAnchor="middle"
                        className={`text-[10px] font-mono font-semibold ${
                          isSelected
                            ? 'fill-blue-600 dark:fill-blue-400'
                            : 'fill-slate-600 dark:fill-slate-400'
                        }`}
                      >
                        {p.signal}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
                Pin {activePin.pin} · {activePin.signal} ({activePin.type})
              </div>
              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                전압 규격: {activePin.voltageLevel}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {activePin.descriptionKo} — {activePin.remarksKo}
              </p>
            </div>
          </div>

          {/* Full 6-Pin Table */}
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400">
                  <th className="py-3 px-3.5 font-semibold whitespace-nowrap">핀</th>
                  <th className="py-3 px-3.5 font-semibold whitespace-nowrap">신호명</th>
                  <th className="py-3 px-3.5 font-semibold whitespace-nowrap">입출력 / 전압</th>
                  <th className="py-3 px-3.5 font-semibold">설계 유의사항</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {GPIO_PINOUT.map((pin) => {
                  const selected = pin.pin === selectedGpioPin;
                  return (
                    <tr
                      key={pin.pin}
                      onClick={() => setSelectedGpioPin(pin.pin)}
                      className={`cursor-pointer transition-colors ${
                        selected
                          ? 'bg-blue-50/70 dark:bg-blue-950/30'
                          : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-2.5 px-3.5 font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                        {pin.pin}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {pin.signal}
                      </td>
                      <td className="py-2.5 px-3.5 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <div>{pin.type}</div>
                        <div className="font-mono text-slate-500 dark:text-slate-400">
                          {pin.voltageLevel}
                        </div>
                      </td>
                      <td className="py-2.5 px-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {pin.remarksKo}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* DC Characteristics & Connector Part Numbers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                GPIO 절대 최대 정격 및 DC 전기적 특성
              </h3>
            </div>
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400">
                  <th className="py-2.5 px-3.5 font-semibold">구분 / 기호</th>
                  <th className="py-2.5 px-3.5 font-semibold">Min</th>
                  <th className="py-2.5 px-3.5 font-semibold">Max</th>
                  <th className="py-2.5 px-3.5 font-semibold">비고</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {DC_CHARACTERISTICS.map((dc, i) => (
                  <tr key={i}>
                    <td className="py-2.5 px-3.5">
                      <div className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {dc.symbol}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">{dc.condition}</div>
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {dc.min}
                    </td>
                    <td className="py-2.5 px-3.5 font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {dc.max}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400">
                      {dc.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto flex flex-col justify-between">
            <div>
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  24핀 USB 3.2 Type-C 리셉터클 핀맵 (Molex 2012670005)
                </h3>
              </div>
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400">
                    <th className="py-2 px-3 font-semibold">Pin A</th>
                    <th className="py-2 px-3 font-semibold">신호 (Top)</th>
                    <th className="py-2 px-3 font-semibold">Pin B</th>
                    <th className="py-2 px-3 font-semibold">신호 (Bottom)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {USBC_PINOUT.slice(0, 6).map((pair) => (
                    <tr key={pair.pinA}>
                      <td className="py-1.5 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {pair.pinA}
                      </td>
                      <td className="py-1.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                        {pair.signalA}{' '}
                        <span className="font-sans text-slate-500 dark:text-slate-400">
                          ({pair.descAKo.split('(')[0].trim()})
                        </span>
                      </td>
                      <td className="py-1.5 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {pair.pinB}
                      </td>
                      <td className="py-1.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                        {pair.signalB}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              {CONNECTOR_PARTS.map((c) => (
                <div key={c.boardPartNo}>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {c.connector}:
                  </span>{' '}
                  <span className="font-mono">{c.manufacturer} {c.boardPartNo}</span> → 상대물:{' '}
                  <span className="font-mono">{c.matingPartNo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Optical & FOV Crop Diagram */}
      <section id="hw-optics" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              2. AR0234CS 이미지 센서 및 M12 광각 렌즈 광학 명세
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              해상도 변경 시 수평 화각 손실 없이 수직 10%만 센터 크롭(1080p/720p)됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenPdf('lens-datasheet', 4)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>렌즈 데이터시트 원문 (p.4–5)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SVG Sensor FOV Crop Visualizer */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                센서 유효 화소 영역 및 해상도별 수직 크롭(Crop in FOV) 다이어그램
              </div>
              <svg
                viewBox="0 0 360 240"
                className="w-full h-auto"
                role="img"
                aria-label="AR0234CS 1920x1200 Full FOV vs 1920x1080 Vertical 10% Crop"
              >
                {/* Full 1920x1200 Active Sensor Area */}
                <rect
                  x="24"
                  y="20"
                  width="312"
                  height="195"
                  rx="6"
                  className="fill-blue-50/70 dark:fill-blue-950/30 stroke-blue-600 dark:stroke-blue-400"
                  strokeWidth="2"
                />
                <text
                  x="34"
                  y="38"
                  className="fill-blue-700 dark:fill-blue-300 text-[11px] font-mono font-semibold"
                >
                  1920 × 1200 (WUXGA · 16:10) — H 0% / V 0% Crop
                </text>

                {/* 1080p / 720p Vertical 10% Crop Region */}
                <rect
                  x="24"
                  y="39.5"
                  width="312"
                  height="156"
                  className="fill-emerald-500/10 stroke-emerald-600 dark:stroke-emerald-400"
                  strokeWidth="1.75"
                  strokeDasharray="6 4"
                />
                <text
                  x="180"
                  y="112"
                  textAnchor="middle"
                  className="fill-slate-900 dark:fill-slate-100 text-[12px] font-mono font-bold"
                >
                  1920 × 1080 / 1280 × 720 (16:9)
                </text>
                <text
                  x="180"
                  y="130"
                  textAnchor="middle"
                  className="fill-emerald-700 dark:fill-emerald-300 text-[11px] font-mono"
                >
                  수평 크롭 0% · 상/하 수직 합계 10% 크롭 (720p는 2×2 스케일링)
                </text>
                <text
                  x="180"
                  y="232"
                  textAnchor="middle"
                  className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono"
                >
                  FOV @ 1920×1200: 128.2°(D) · 104.6°(H) · 61.6°(V)
                </text>
              </svg>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              글로벌 셔터(Global Shutter) 전 픽셀 동시 노광 방식으로 고속 이동체(컨베이어 벨트, AMR 로봇, 드론, 번호판 인식) 촬영 시 롤링 셔터 젤로 왜곡(Jello Effect)이 발생하지 않습니다.
            </div>
          </div>

          {/* Optical Spec Table */}
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400">
                  <th className="py-3 px-4 font-semibold w-56">광학 항목</th>
                  <th className="py-3 px-4 font-semibold">규격 및 측정치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {OPTICAL_LENS_SPECS.map((spec) => (
                  <tr key={spec.param}>
                    <td className="py-2.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {spec.param}
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Mechanical & Mounting Guide */}
      <section id="hw-mechanical" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              3. 기구 치수 및 인클로저 M2 마운팅 · 삼각대 브라켓 규격
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              후면 M2 나사홀(최대 깊이 2.5mm)과 측면/상하단 홀(5.5mm / 4.9mm) 깊이 차이를 반드시 준수하십시오.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onOpenPdf('datasheet', 13)}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>보드/홀더 도면 (p.13)</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPdf('mounting-guide', 5)}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>마운팅 가이드 (p.5)</span>
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">장착 위치 / 어셈블리</th>
                <th className="py-3 px-4 font-semibold">나사 규격</th>
                <th className="py-3 px-4 font-semibold">홀 간격(Pitch) / 파트넘버</th>
                <th className="py-3 px-4 font-semibold">최대 체결 깊이</th>
                <th className="py-3 px-4 font-semibold">조립 주의사항</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {MOUNTING_SPECS.map((m) => (
                <tr key={m.side}>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {m.side}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {m.holes}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                    {m.pitch}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {m.maxDepth}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">
                    {m.caution}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Reliability & EMC Certification Matrix */}
      <section id="hw-reliability" className="scroll-mt-24 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              4. 환경 신뢰성 시험 (IEC 60068 · HALT/HASS) 및 CE/FCC 적합성 선언
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              보드형(CHL_TC) 및 박스형(CHL_TC_BX) 신뢰성 시험 성적서 및 EU 적합성 선언서(DoC) 검증 결과
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onOpenPdf('reliability-board', 1)}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>보드형 성적서</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPdf('doc-conformity', 1)}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CE/FCC 선언서</span>
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">적용 규격</th>
                <th className="py-3 px-4 font-semibold">시험 항목</th>
                <th className="py-3 px-4 font-semibold">시험 조건</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">보드형 (CHL_TC)</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">박스형 (CHL_TC_BX)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {RELIABILITY_AND_EMC_TESTS.map((test) => (
                <tr key={test.testName}>
                  <td className="py-2.5 px-4 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {test.standard}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                    {test.testName}
                  </td>
                  <td className="py-2.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                    {test.condition}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {test.boardResult}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {test.boxResult}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

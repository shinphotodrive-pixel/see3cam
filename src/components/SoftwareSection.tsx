import { useState } from 'react';
import { Check, Copy, FileText, Terminal } from 'lucide-react';
import {
  EXPOSURE_MAPPING_DIRECTSHOW,
  EXPOSURE_MAPPING_QTCAM,
  LINUX_INSTALL_COMMANDS,
  ROI_WINDOW_SIZES,
  UVC_CONTROLS,
} from '../data/softwareAndFaqData';

interface SoftwareSectionProps {
  onOpenPdf: (pdfId: string, page: number) => void;
}

export function SoftwareSection({ onOpenPdf }: SoftwareSectionProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopyCommand = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  return (
    <div className="space-y-12">
      {/* Header + Anchor Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            소프트웨어 · UVC 화질 제어 · 펌웨어 매뉴얼
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Windows e-CAMView, Linux Ubuntu QtCAM, 노출/ROI 매핑 테이블, 얼굴 인식 164바이트 패킷 및 DFU 복구 절차
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { href: '#sw-windows', label: 'Windows (e-CAMView)' },
            { href: '#sw-linux', label: 'Linux Ubuntu (QtCAM)' },
            { href: '#sw-uvc-controls', label: 'UVC & 노출·ROI 매핑' },
            { href: '#sw-face-dfu', label: '얼굴 인식 164B & DFU 복구' },
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

      {/* 1. Windows & Linux Application Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Windows e-CAMView (5 cols) */}
        <section
          id="sw-windows"
          className="lg:col-span-5 scroll-mt-24 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-5"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Windows 10 / 11 (DirectShow)
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  e-CAMView 설치 및 스트리밍 제어
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onOpenPdf('ecamview-user', 9)}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>매뉴얼 p.9</span>
              </button>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed list-decimal list-inside">
              <li>
                설치 파일 실행 시 기본 경로{' '}
                <code className="font-mono text-[11px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  C:\Program Files (x86)\e-con Systems\e-CAMView\
                </code>
                에 설치되며 VC++ 런타임 및 MJPEG 코덱 구성이 진행됩니다.
              </li>
              <li>
                상단 <span className="font-semibold">Devices</span> 메뉴에서{' '}
                <span className="font-mono">See3CAM_24CUG</span>를 선택하면 상태 LED가 적색에서 황색으로 전환되며 프리뷰가 시작됩니다.
              </li>
              <li>
                <span className="font-semibold">Options → Video Capture Pin</span>에서 출력 포맷(<span className="font-mono">UYVY</span> / <span className="font-mono">MJPG</span>), 해상도(<span className="font-mono">1920×1200</span> 등), 목표 FPS를 변경합니다.
              </li>
              <li>
                <span className="font-semibold">UVC Extension</span> 탭에서 Master/Trigger 전환, Auto Exposure ROI, Flip, De-Noise, Q-Factor(10~96), Face Detection, Strobe, Exposure Compensation을 실시간 제어합니다.
              </li>
              <li>
                스틸 캡처는 비압축 <span className="font-mono">.bmp</span> 및 <span className="font-mono">.jpg</span> 저장을 지원하며 Burst Length 설정으로 연속 촬영 매수를 지정할 수 있습니다.
              </li>
            </ol>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => onOpenPdf('ecamview-install', 5)}
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2"
            >
              설치 마법사 가이드 (PDF p.5)
            </button>
            <button
              type="button"
              onClick={() => onOpenPdf('ecamview-user', 17)}
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2"
            >
              UVC Extension 상세 (PDF p.17)
            </button>
          </div>
        </section>

        {/* Linux QtCAM (7 cols) */}
        <section
          id="sw-linux"
          className="lg:col-span-7 scroll-mt-24 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Linux Ubuntu 18.04 / 20.04 / 22.04 LTS (64-bit · V4L2)
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                QtCAM 오픈소스 스트리밍 앱 APT 설치 명령어
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenPdf('qtcam-install', 5)}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>설치 매뉴얼 p.5</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenPdf('qtcam-user', 9)}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>사용자 매뉴얼 p.9</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LINUX_INSTALL_COMMANDS.map((item, idx) => (
              <div
                key={item.ubuntu}
                className={`rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 ${
                  idx === LINUX_INSTALL_COMMANDS.length - 1 ? 'sm:col-span-2' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    {item.ubuntu}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCommand(item.commands, idx)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>복사</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
                  {item.commands}
                </pre>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            QtCAM 주요 특징: 스틸 캡처 4종 포맷(<span className="font-mono">jpg, bmp, raw, png</span>), 비디오 레코딩(<span className="font-mono">.avi</span> 컨테이너, <span className="font-mono">MJPG / H264</span> 인코더), 프리뷰 화면 마우스 우클릭 기반 수동 AE ROI 좌표 지정 지원. 실행 시 HID 권한 확보를 위해 <code className="font-mono">sudo qtcam</code> 실행을 권장합니다.
          </p>
        </section>
      </div>

      {/* 2. UVC Controls & Exposure / ROI Mapping */}
      <section id="sw-uvc-controls" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              표준 UVC 화질 파라미터 범위 및 노출 시간 · AE ROI 매핑 테이블
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Windows DirectShow(-14 ~ 0)와 Linux QtCAM(0 ~ 10000)의 슬라이더 노출 시간 변환 규격
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenPdf('ecamview-user', 13)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>파라미터 원문 확인 (p.13–21)</span>
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">제어 항목</th>
                <th className="py-3 px-4 font-semibold">최소 (Min)</th>
                <th className="py-3 px-4 font-semibold">최대 (Max)</th>
                <th className="py-3 px-4 font-semibold">기본값</th>
                <th className="py-3 px-4 font-semibold">Step / 모드</th>
                <th className="py-3 px-4 font-semibold">동작 특성</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {UVC_CONTROLS.map((ctrl) => (
                <tr key={ctrl.nameEn}>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {ctrl.nameKo}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {ctrl.minVal}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {ctrl.maxVal}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {ctrl.defaultVal}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    Step {ctrl.stepSize} · {ctrl.autoSupported ? 'Auto/수동' : '수동 전용'}
                  </td>
                  <td className="py-2.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                    {ctrl.descriptionKo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3-Column Sub-tables: DirectShow Exposure, QtCAM Exposure, AE ROI Window Size */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Windows DirectShow 노출 매핑
              </h3>
            </div>
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2 px-3.5 font-semibold">슬라이더 값</th>
                    <th className="py-2 px-3.5 font-semibold">실제 센서 노광 시간</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {EXPOSURE_MAPPING_DIRECTSHOW.map((row) => (
                    <tr key={row.slider}>
                      <td className="py-1.5 px-3.5 font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {row.slider}
                      </td>
                      <td className="py-1.5 px-3.5 font-mono text-slate-700 dark:text-slate-300">
                        {row.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Linux QtCAM 노출 슬라이더 매핑
              </h3>
            </div>
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2 px-3.5 font-semibold">QtCAM 설정값</th>
                  <th className="py-2 px-3.5 font-semibold">실제 센서 노광 시간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {EXPOSURE_MAPPING_QTCAM.map((row) => (
                  <tr key={row.slider}>
                    <td className="py-2 px-3.5 font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {row.slider}
                    </td>
                    <td className="py-2 px-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Manual AE ROI 윈도우 크기 (1~8)
              </h3>
            </div>
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2 px-3 font-semibold">크기</th>
                  <th className="py-2 px-3 font-semibold">720p 영역</th>
                  <th className="py-2 px-3 font-semibold">1200p 영역</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {ROI_WINDOW_SIZES.map((roi) => (
                  <tr key={roi.winSize}>
                    <td className="py-1.5 px-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {roi.winSize} ({roi.ratio})
                    </td>
                    <td className="py-1.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                      {roi.region720p}
                    </td>
                    <td className="py-1.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                      {roi.region1200p}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Face Detection 164-Byte Packet & DFU Firmware Recovery */}
      <section id="sw-face-dfu" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Face Detection 164B Packet */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Application Note · Face Detection
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                온보드 얼굴 인식 164바이트 임베디드 패킷 규격
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onOpenPdf('face-detection', 6)}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>앱노트 p.6</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="font-mono">Embed Data</span> 옵션을 활성화하면 수신된 각 비디오 프레임의 마지막 <strong className="text-slate-900 dark:text-slate-100">164 Bytes</strong>가 아래의 상태 구조체 패킷으로 치환되어 최대 16명의 얼굴 ID 및 사각형 좌표를 실시간 파싱할 수 있습니다 (Normal 및 Grayscale 모드 전용).
          </p>

          {/* Clean Byte-Layout Diagram */}
          <div className="grid grid-cols-12 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-center font-mono text-xs">
            <div className="col-span-3 bg-blue-600 text-white p-2.5 flex flex-col justify-center">
              <div className="font-bold">SOSS</div>
              <div className="text-[11px] opacity-90">0xFFBC (2B)</div>
            </div>
            <div className="col-span-6 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 border-x border-slate-200 dark:border-slate-700">
              <div className="font-bold">Face Status Structure (160B)</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                Face_ID[1..16] + (X0, Y0, X1, Y1) × 16명
              </div>
            </div>
            <div className="col-span-3 bg-slate-900 dark:bg-slate-700 text-white p-2.5 flex flex-col justify-center">
              <div className="font-bold">EOSS</div>
              <div className="text-[11px] opacity-90">0xFFBD (2B)</div>
            </div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div>
              · <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">SOSS (0xFFBC):</span> Start of Status Structure (패킷 시작 마커, 2바이트)
            </div>
            <div>
              · <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">EOSS (0xFFBD):</span> End of Status Structure (패킷 종료 마커, 2바이트)
            </div>
          </div>
        </div>

        {/* DFU Firmware Updater & Recovery */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                See3CAM_DFU v1.0.49.1+
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                DFU 펌웨어 업데이트 및 실패 시 부트로더 복구
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onOpenPdf('dfu-manual', 8)}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>DFU 매뉴얼 p.8</span>
            </button>
          </div>

          <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed list-decimal list-inside">
            <li>
              <span className="font-semibold">Select Device:</span> 드롭다운에서{' '}
              <span className="font-mono">See3CAM_24CUG(VID_2560, PID_C128_0)</span>를 선택합니다.
            </li>
            <li>
              <span className="font-semibold">Browse Firmware:</span> 공식 제공된 전용{' '}
              <span className="font-mono">.img</span> 펌웨어 바이너리를 지정합니다 (타 모델 펌웨어 선택 금지).
            </li>
            <li>
              <span className="font-semibold">F/W UPDATE:</span> 업데이트 중에는 절대로 USB 케이블을 분리하지 마십시오.
            </li>
            <li>
              <span className="font-semibold">검증:</span> 진행률 100% 도달 시 카메라가 자동 재부팅되며{' '}
              <span className="font-mono">READ F/W VERSION</span>으로 반영된 버전을 확인합니다.
            </li>
          </ol>

          <div className="rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/25 p-3 text-xs text-slate-800 dark:text-slate-200">
            <div className="font-semibold mb-1">
              업데이트 중단 오류 (&ldquo;Firmware Download Failed!&rdquo;) 발생 시 복구 방법
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              케이블 흔들림 등으로 플래싱이 중단되면 장치가 자동으로{' '}
              <code className="font-mono font-semibold">e-conDFU_USB_x_HUB_0(VID_2560, PID_DF01_0)</code>{' '}
              부트로더 복구 모드로 열거됩니다. 당황하지 말고 해당 항목을 선택한 뒤 위 1~4단계를 그대로 다시 실행하면 정상 복구됩니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

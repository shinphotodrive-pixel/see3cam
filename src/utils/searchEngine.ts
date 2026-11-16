import { SearchCategory, SearchResultEntry } from '../types/manual';
import { PDF_DOCUMENTS } from '../data/pdfDocuments';
import {
  CAMERA_VARIANTS,
  CONNECTOR_PARTS,
  DC_CHARACTERISTICS,
  GPIO_PINOUT,
  MOUNTING_SPECS,
  OPTICAL_LENS_SPECS,
  RELIABILITY_AND_EMC_TESTS,
  STREAM_POWER_SPECS,
} from '../data/hardwareData';
import {
  FAQ_ITEMS,
  LINUX_INSTALL_COMMANDS,
  TROUBLESHOOTING_ITEMS,
  UVC_CONTROLS,
} from '../data/softwareAndFaqData';
import { SDK_APIS } from '../data/sdkApis';

const SYNONYM_GROUPS: string[][] = [
  ['트리거', 'trigger', 'trig', '외부동기', '펄스', 'pin 4', 'pin4', '스냅샷'],
  ['스트로브', 'strobe', '플래시', 'flash', '조명', '오픈드레인', 'open drain', 'pin 5', 'pin5'],
  ['핀맵', '핀배열', '커넥터', '헤더', 'pinout', 'pin', 'gpio', 'cn6', 'cn2', 'usb-c', 'type-c', 'molex', 'i2c'],
  ['노출', '셔터', 'exposure', 'ae', 'roi', '66666', '노출보정'],
  ['해상도', '프레임', '프레임레이트', '전력', '소비전력', '전류', 'fps', '120fps', '114fps', 'uyvy', 'mjpeg', 'wuxga', '1920x1200', '1080p', '720p'],
  ['렌즈', '광학', '화각', '초점', '왜곡', 'lens', 'fov', 'm12', 's-mount', '128.2', '3.0mm', 'f2.8', '10cm'],
  ['마운팅', '브라켓', '삼각대', '나사', '치수', '기구', '외형', '하우징', '인클로저', 'mounting', 'tripod', 'm2', 'e-met-mb-002', '1/4-20unc'],
  ['펌웨어', '업데이트', '복구', '벽돌', '플래싱', 'firmware', 'dfu', 'pid_df01', 'df01', '.img', 'see3cam_dfu'],
  ['리눅스', '우분투', '설치', '터미널', 'linux', 'ubuntu', 'qtcam', 'v4l2', 'ppa', 'apt', 'dmesg', 'jammy', 'focal', 'bionic'],
  ['윈도우', 'windows', 'ecamview', 'e-camview', 'directshow', '코덱'],
  ['얼굴', '안면', '얼굴인식', '패킷', '임베디드', 'face', 'soss', 'eoss', '0xffbc', '0xffbd', '164'],
  ['신뢰성', '인증', '온도', '진동', '습도', '보관', '전자파', 'reliability', 'emc', 'ce', 'fcc', 'esd', 'halt', 'hass', 'iec 60068'],
  ['불량', '오류', '문제', '안나옴', '검은화면', '하얀화면', '깜빡임', '빨간불', '노란불', 'led', '트러블슈팅', '고장'],
  ['sdk', 'api', 'c++', '함수', '코드', '예제', 'extension unit', 'hid'],
];

function buildSearchIndex(): SearchResultEntry[] {
  const entries: SearchResultEntry[] = [];

  // 1. 3종 카메라 모델 및 핵심 사양
  CAMERA_VARIANTS.forEach((v) => {
    entries.push({
      id: `variant-${v.partNumber}`,
      title: `${v.partNumber} — ${v.nameKo}`,
      subtitle: `모델 사양 비교 · ${v.dimensionsMm}`,
      category: 'spec',
      categoryLabel: '하드웨어/사양',
      body: `인클로저: ${v.enclosure} | 렌즈: ${v.lensIncluded} | GPIO: ${v.gpioHeader} | 스트림 모드: ${v.streamModes} | 스트로브: ${v.strobeSupport} | 동작 온도: ${v.operatingTemp} | 보관 온도: ${v.highStorageTemp} | 동봉 케이블: ${v.cableIncluded}`,
      keywords: [v.partNumber, v.nameKo, '모델', '비교', '변형', 'variant', '온도', '케이블'],
      targetTab: 'overview',
      targetSection: 'variants-section',
      pdfId: 'datasheet',
      pdfPage: 4,
    });
  });

  // 2. 스트리밍 포맷/해상도/소비전력 요약 엔트리 + 대표 항목
  entries.push({
    id: 'spec-stream-power-matrix',
    title: '해상도 · 프레임레이트(최대 120fps) · 소비전력 측정표 (UYVY / MJPEG)',
    subtitle: 'USB 3.2 Gen 1 & USB 2.0 전 구간 전류(mA) / 전력(W) / FOV 크롭 비율',
    category: 'spec',
    categoryLabel: '하드웨어/사양',
    body: STREAM_POWER_SPECS.map(
      (s) =>
        `${s.format} ${s.usbGeneration} ${s.resolutionPx}(${s.resolutionLabel}) ${s.measuredFps}fps: ${s.currentMa}mA / ${s.powerW}W (수직 크롭 ${s.cropVertical})`
    ).join(' · '),
    keywords: ['해상도', 'FPS', '120fps', '114fps', '55fps', 'UYVY', 'MJPEG', '소비전력', '전류', '404mA', '2.02W', '크롭', 'FOV'],
    targetTab: 'overview',
    targetSection: 'power-explorer-section',
    pdfId: 'datasheet',
    pdfPage: 7,
  });

  // 3. 광학 & 렌즈 사양
  entries.push({
    id: 'spec-optical-lens',
    title: 'AR0234CS 센서 및 M12 기본 광각 렌즈 광학 사양 (f=3.0mm, F/2.8, 128.2°)',
    subtitle: '화각 128.2°(D) / 104.6°(H) / 61.6°(V) · 왜곡률 <35% · 최소 초점 10cm',
    category: 'spec',
    categoryLabel: '하드웨어/사양',
    body: OPTICAL_LENS_SPECS.map((o) => `${o.param}: ${o.value}`).join(' | '),
    keywords: ['렌즈', '광학', 'AR0234CS', '글로벌 셔터', 'global shutter', 'M12', 'S-Mount', '화각', 'FOV', '3.0mm', 'F/2.8', '128.2', 'CRA', '왜곡률', '10cm'],
    targetTab: 'hardware',
    targetSection: 'hw-optics',
    pdfId: 'lens-datasheet',
    pdfPage: 4,
  });

  // 4. 마운팅 & 기구 치수
  entries.push({
    id: 'spec-mounting-dimensions',
    title: '기구 외형 치수 및 인클로저 M2 마운팅 홀 · 삼각대 브라켓(e-MET-MB-002)',
    subtitle: '보드 30×30×26mm · 박스 35.3×35.3×29mm · 후면 2.5mm / 측면·상하단 5.5mm 홀 깊이',
    category: 'spec',
    categoryLabel: '하드웨어/사양',
    body: MOUNTING_SPECS.map((m) => `${m.side}: ${m.holes}, 피치 ${m.pitch}, ${m.maxDepth} (${m.caution})`).join(' | '),
    keywords: ['기구', '치수', '도면', '마운팅', 'M2', '나사', '삼각대', 'tripod', '1/4-20UNC', 'e-MET-MB-002', '30x30', '35.3'],
    targetTab: 'hardware',
    targetSection: 'hw-mechanical',
    pdfId: 'mounting-guide',
    pdfPage: 5,
  });

  // 5. 신뢰성 시험 및 CE/FCC 인증
  entries.push({
    id: 'spec-reliability-emc',
    title: '환경 신뢰성 시험(IEC 60068 / HALT / HASS / 21일 내구) 및 CE·FCC 전자파 적합성',
    subtitle: '-30°C~+70°C 동작 · 500사이클 전원 스위칭 · ESD ±4kV/±8kV 전 항목 PASS',
    category: 'spec',
    categoryLabel: '하드웨어/사양',
    body: RELIABILITY_AND_EMC_TESTS.map((r) => `${r.standard} ${r.testName}: ${r.condition} (${r.boardResult})`).join(' | '),
    keywords: ['신뢰성', '인증', 'CE', 'FCC', 'EMC', 'ESD', 'IEC 60068', 'HALT', 'HASS', '진동', '습도', '고온', '저온', '21일'],
    targetTab: 'hardware',
    targetSection: 'hw-reliability',
    pdfId: 'reliability-board',
    pdfPage: 1,
  });

  // 6. 6핀 GPIO 핀맵 개별 엔트리 + DC 전기적 특성 + 커넥터 파트넘버
  GPIO_PINOUT.forEach((pin) => {
    entries.push({
      id: `gpio-pin-${pin.pin}`,
      title: `6핀 GPIO Pin ${pin.pin}: ${pin.signal} (${pin.type})`,
      subtitle: `전압 레벨: ${pin.voltageLevel} · CN6/CN2 헤더 (Molex 202396-0607)`,
      category: 'pinout',
      categoryLabel: '핀맵/회로',
      body: `${pin.descriptionKo} — ${pin.remarksKo}`,
      keywords: [`Pin ${pin.pin}`, `핀 ${pin.pin}`, pin.signal, 'GPIO', 'CN6', 'CN2', '핀맵', '헤더', 'Molex'],
      targetTab: 'hardware',
      targetSection: 'hw-pinout',
      pdfId: 'datasheet',
      pdfPage: 8,
    });
  });

  entries.push({
    id: 'pinout-usbc-dc-connectors',
    title: '24핀 USB 3.2 Type-C 핀배열 · GPIO DC 전압 한계 및 Molex 커넥터 파트넘버',
    subtitle: 'USB-C Molex 2012670005 · GPIO 매칭 하우징 Molex 0151330602 · 일반 GPIO 최대 2.8V / TRIG 6.5V',
    category: 'pinout',
    categoryLabel: '핀맵/회로',
    body:
      CONNECTOR_PARTS.map((c) => `${c.connector}: ${c.manufacturer} ${c.boardPartNo} (상대물 ${c.matingPartNo})`).join(' | ') +
      ' | ' +
      DC_CHARACTERISTICS.map((d) => `${d.category} ${d.symbol}: min ${d.min}, max ${d.max} (${d.note})`).join(' | '),
    keywords: ['USB Type-C', 'USB-C', '24핀', 'SSTX', 'SSRX', 'VBUS', 'CC1', 'CC2', 'Molex', '2012670005', '202396-0607', '0151330602', 'DC 특성', '풀업', '풀다운', '2.8V', '6.5V'],
    targetTab: 'hardware',
    targetSection: 'hw-pinout',
    pdfId: 'datasheet',
    pdfPage: 9,
  });

  // 7. 소프트웨어: Windows e-CAMView, Linux QtCAM, UVC 제어, 얼굴 인식 164B, DFU 업데이트
  entries.push({
    id: 'sw-uvc-exposure-roi',
    title: 'UVC 표준 화질 제어 및 노출 시간 매핑(DirectShow -14~0 / QtCAM 0~10000) · AE ROI 윈도우',
    subtitle: '밝기·명암·채도·선명도·감마(220=2.2)·화이트밸런스·게인·노출 시간 변환표',
    category: 'software',
    categoryLabel: '소프트웨어/제어',
    body: UVC_CONTROLS.map(
      (c) => `${c.nameKo}(${c.nameEn}): 범위 ${c.minVal}~${c.maxVal}, 기본값 ${c.defaultVal} — ${c.descriptionKo}`
    ).join(' | '),
    keywords: ['UVC', '화질', '밝기', '명암', '채도', '선명도', '감마', '화이트밸런스', '게인', '노출', 'exposure', '-14', '-5', 'ROI', 'e-CAMView', 'QtCAM'],
    targetTab: 'software',
    targetSection: 'sw-uvc-controls',
    pdfId: 'ecamview-user',
    pdfPage: 13,
  });

  entries.push({
    id: 'sw-linux-qtcam-install',
    title: 'Linux Ubuntu 18.04 / 20.04 / 22.04 QtCAM 설치 명령어 및 V4L2 실행 가이드',
    subtitle: 'ppa:qtcam/bionic · focal · jammy APT 저장소 등록 및 sudo qtcam / dmesg 점검',
    category: 'software',
    categoryLabel: '소프트웨어/제어',
    body: LINUX_INSTALL_COMMANDS.map((l) => `[${l.ubuntu}] ${l.commands.replace(/\n/g, ' ; ')}`).join(' | '),
    keywords: ['Linux', '리눅스', 'Ubuntu', '우분투', 'QtCAM', '설치', 'apt-get', 'ppa', '18.04', '20.04', '22.04', 'V4L2', 'dmesg', 'H264', 'raw'],
    targetTab: 'software',
    targetSection: 'sw-linux',
    pdfId: 'qtcam-install',
    pdfPage: 5,
  });

  entries.push({
    id: 'sw-windows-ecamview',
    title: 'Windows 10/11 e-CAMView 스트리밍 앱 설치 및 UVC Extension 14개 메뉴 사용법',
    subtitle: 'DirectShow 기반 프리뷰 · 스틸 캡처(.bmp/.jpg) · 마스터/트리거 · Q-Factor · 플립 제어',
    category: 'software',
    categoryLabel: '소프트웨어/제어',
    body: 'Windows 10/11 환경에서 setup.exe를 통해 C:\\Program Files (x86)\\e-con Systems\\e-CAMView 경로에 설치하며 MJPEG 코덱 구성, Video Capture Pin 해상도 변경, UVC Extension 확장 제어창을 제공합니다.',
    keywords: ['Windows', '윈도우', 'e-CAMView', '설치', 'DirectShow', 'MJPEG', '코덱', '스틸 캡처', '녹화'],
    targetTab: 'software',
    targetSection: 'sw-windows',
    pdfId: 'ecamview-user',
    pdfPage: 9,
  });

  entries.push({
    id: 'sw-face-detection-packet',
    title: '온보드 얼굴 인식(Face Detection) 164바이트 임베디드 패킷 구조 (0xFFBC ~ 0xFFBD)',
    subtitle: '프레임 마지막 164 Bytes 치환 · SOSS(2B) + 최대 16명 Face_ID/X0/Y0/X1/Y1(160B) + EOSS(2B)',
    category: 'software',
    categoryLabel: '소프트웨어/제어',
    body: 'Embed Data 활성화 시 영상 프레임 말미 164바이트에 시작 마커 SOSS(0xFFBC), 최대 16명의 얼굴 ID 및 사각형 좌표 구조체(160바이트), 종료 마커 EOSS(0xFFBD)가 삽입됩니다. Normal 및 Grayscale 모드에서 작동합니다.',
    keywords: ['얼굴 인식', 'face detection', '164바이트', '164 bytes', 'SOSS', 'EOSS', '0xFFBC', '0xFFBD', '임베디드 데이터', '오버레이'],
    targetTab: 'software',
    targetSection: 'sw-face-dfu',
    pdfId: 'face-detection',
    pdfPage: 6,
  });

  entries.push({
    id: 'sw-dfu-firmware-recovery',
    title: 'See3CAM_DFU 펌웨어 업데이트(.img) 4단계 절차 및 실패 시 복구 모드(PID_DF01_0)',
    subtitle: 'VID_2560 / PID_C128_0 펌웨어 플래싱 및 중단 오류 시 부트로더 재복구 가이드',
    category: 'software',
    categoryLabel: '소프트웨어/제어',
    body: 'See3CAM_DFU 유틸리티에서 장치 선택 → .img 바이너리 지정 → F/W UPDATE 실행(전원 분리 금지) → 100% 완료 후 자동 리셋 및 버전 확인. 실패 시 e-conDFU_USB_x_HUB_0(VID_2560, PID_DF01_0)으로 잡히며 동일 절차 반복 시 복구됩니다.',
    keywords: ['DFU', '펌웨어', 'firmware', '업데이트', '복구', '벽돌', 'PID_DF01_0', 'See3CAM_DFU', '.img'],
    targetTab: 'software',
    targetSection: 'sw-face-dfu',
    pdfId: 'dfu-manual',
    pdfPage: 8,
  });

  // 8. 31개 C/C++ Extension Unit SDK API 전체 인덱싱
  SDK_APIS.forEach((api) => {
    const constText = api.constants
      ? api.constants.map((c) => `${c.hex} ${c.label}(${c.descriptionKo})`).join(', ')
      : '';
    const paramText = api.params.map((p) => `${p.type} ${p.name}: ${p.descriptionKo}`).join('; ');
    entries.push({
      id: `sdk-${api.id}`,
      title: `${api.name}() — ${api.groupLabel}`,
      subtitle: `${api.signature} · SDK 매뉴얼 p.${api.pdfPage}`,
      category: 'sdk',
      categoryLabel: 'SDK API (C/C++)',
      body: `${api.summaryKo} 파라미터: ${paramText}. ${constText} ${api.notesKo ?? ''}`,
      keywords: [api.name, api.groupLabel, 'SDK', 'API', 'C++', ...api.params.map((p) => p.name)],
      targetTab: 'sdk',
      targetApiId: api.id,
      pdfId: 'sdk-api',
      pdfPage: api.pdfPage,
    });
  });

  // 9. 트러블슈팅(LED 진단) & FAQ 인덱싱
  TROUBLESHOOTING_ITEMS.forEach((ts) => {
    entries.push({
      id: ts.id,
      title: `[트러블슈팅 · ${ts.ledState}] ${ts.symptomKo}`,
      subtitle: `대상 환경: ${ts.osScope} · 원인: ${ts.causeKo}`,
      category: 'faq',
      categoryLabel: '트러블슈팅/FAQ',
      body: `원인: ${ts.causeKo} 해결 방법: ${ts.solutionKo}`,
      keywords: ['트러블슈팅', '오류', 'LED', ts.ledState, ts.osScope, '해결', '불량'],
      targetTab: 'overview',
      targetSection: 'troubleshooting-section',
      pdfId: ts.relatedPdfId,
      pdfPage: ts.relatedPage,
    });
  });

  FAQ_ITEMS.forEach((faq) => {
    entries.push({
      id: faq.id,
      title: `Q. ${faq.questionKo}`,
      subtitle: `${faq.category} · ${faq.questionEn}`,
      category: 'faq',
      categoryLabel: '트러블슈팅/FAQ',
      body: faq.answerKo,
      keywords: ['FAQ', '질문', faq.category, faq.questionEn],
      targetTab: 'overview',
      targetSection: 'faq-section',
      pdfId: faq.relatedPdfId,
      pdfPage: faq.relatedPage,
    });
  });

  // 10. 14종 원본 PDF 문서 및 주요 목차 인덱싱
  PDF_DOCUMENTS.forEach((doc) => {
    entries.push({
      id: `pdf-${doc.id}`,
      title: `[원본 PDF] ${doc.titleKo}`,
      subtitle: `${doc.titleEn} · ${doc.version} (${doc.pages}p)`,
      category: 'pdf',
      categoryLabel: '원본 PDF 문서',
      body: `${doc.summaryKo} 주요 목차: ${doc.toc.map((t) => `p.${t.page} ${t.title}`).join(' / ')}`,
      keywords: [...doc.keywords, doc.titleEn, doc.fileName, 'PDF', '원본', '매뉴얼', '다운로드'],
      targetTab: 'pdfs',
      pdfId: doc.id,
      pdfPage: 1,
    });
  });

  return entries;
}

export const SEARCH_INDEX: SearchResultEntry[] = buildSearchIndex();

function expandTokenWithSynonyms(token: string): string[] {
  const lower = token.toLowerCase();
  const expanded = new Set<string>([lower]);
  for (const group of SYNONYM_GROUPS) {
    if (group.some((term) => term.includes(lower) || lower.includes(term))) {
      group.forEach((term) => expanded.add(term.toLowerCase()));
    }
  }
  return Array.from(expanded);
}

export function searchManual(
  rawQuery: string,
  category: SearchCategory = 'all',
  limit = 40
): SearchResultEntry[] {
  const trimmed = rawQuery.trim();
  const pool =
    category === 'all'
      ? SEARCH_INDEX
      : SEARCH_INDEX.filter((item) => item.category === category);

  if (!trimmed) {
    return pool.slice(0, limit);
  }

  const rawTokens = trimmed
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  const scored: { entry: SearchResultEntry; score: number }[] = [];

  for (const entry of pool) {
    const titleLower = entry.title.toLowerCase();
    const subtitleLower = entry.subtitle.toLowerCase();
    const bodyLower = entry.body.toLowerCase();
    const kwLower = entry.keywords.map((k) => k.toLowerCase()).join(' ');
    const fullLower = `${titleLower} ${subtitleLower} ${kwLower} ${bodyLower}`;

    let totalScore = 0;
    let matchedAllTokens = true;

    // Exact full phrase bonus
    const phraseLower = trimmed.toLowerCase();
    if (titleLower.includes(phraseLower)) totalScore += 60;
    else if (kwLower.includes(phraseLower)) totalScore += 45;
    else if (subtitleLower.includes(phraseLower)) totalScore += 35;
    else if (bodyLower.includes(phraseLower)) totalScore += 25;

    for (const token of rawTokens) {
      let tokenScore = 0;
      if (titleLower.includes(token)) tokenScore += 30;
      if (kwLower.includes(token)) tokenScore += 22;
      if (subtitleLower.includes(token)) tokenScore += 15;
      if (bodyLower.includes(token)) tokenScore += 10;

      if (tokenScore === 0 && token.length >= 2) {
        const synonyms = expandTokenWithSynonyms(token);
        for (const syn of synonyms) {
          if (syn === token) continue;
          if (fullLower.includes(syn)) {
            tokenScore = Math.max(tokenScore, titleLower.includes(syn) ? 14 : 8);
          }
        }
      }

      if (tokenScore === 0) {
        matchedAllTokens = false;
        break;
      }
      totalScore += tokenScore;
    }

    if (matchedAllTokens && totalScore > 0) {
      scored.push({ entry, score: totalScore });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.entry);
}

export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

export function getHighlightSegments(text: string, query: string): HighlightSegment[] {
  const trimmed = query.trim();
  if (!trimmed || !text) {
    return [{ text, highlighted: false }];
  }

  const tokens = Array.from(
    new Set(
      trimmed
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    )
  ).sort((a, b) => b.length - a.length);

  if (tokens.length === 0) {
    return [{ text, highlighted: false }];
  }

  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      highlighted: tokens.some((t) => t.toLowerCase() === part.toLowerCase()),
    }));
}

export const POPULAR_SEARCH_QUERIES = [
  { label: '6핀 GPIO 핀맵 (TRIG / STROBE)', query: 'GPIO 핀맵' },
  { label: '해상도별 소비전력 · 120fps', query: '120fps 소비전력' },
  { label: '외부 트리거 모드 설정', query: '트리거 모드' },
  { label: 'Ubuntu QtCAM 설치 명령어', query: 'Ubuntu QtCAM 설치' },
  { label: '노출 시간 매핑 (-14 ~ 0)', query: '노출 매핑' },
  { label: 'LED 점멸 상태별 진단', query: 'LED 트러블슈팅' },
  { label: 'DFU 펌웨어 복구 (PID_DF01)', query: 'DFU 펌웨어 복구' },
  { label: '얼굴 인식 164B 패킷 (0xFFBC)', query: '0xFFBC' },
];

export type MainTabId = 'overview' | 'hardware' | 'software' | 'sdk' | 'pdfs';

export type SearchCategory =
  | 'all'
  | 'spec'
  | 'pinout'
  | 'software'
  | 'sdk'
  | 'faq'
  | 'pdf';

export type PdfCategory =
  | 'datasheet'
  | 'getting-started'
  | 'software-win'
  | 'software-linux'
  | 'sdk-appnote'
  | 'certification';

export interface PdfDocumentItem {
  id: string;
  titleKo: string;
  titleEn: string;
  category: PdfCategory;
  categoryLabel: string;
  version: string;
  date: string;
  pages: number;
  path: string;
  fileName: string;
  summaryKo: string;
  highlights: string[];
  keywords: string[];
  toc: { page: number; title: string }[];
}

export interface VariantSpec {
  partNumber: string;
  nameKo: string;
  enclosure: string;
  lensIncluded: string;
  dimensionsMm: string;
  gpioHeader: string;
  ledVisible: string;
  streamModes: string;
  strobeSupport: string;
  operatingTemp: string;
  highStorageTemp: string;
  cableIncluded: string;
}

export interface StreamPowerSpec {
  id: string;
  format: 'UYVY' | 'MJPEG';
  usbGeneration: 'USB 3.2 Gen 1' | 'USB 2.0';
  resolutionLabel: string;
  resolutionPx: string;
  fpsOptions: string;
  measuredFps: number;
  cropHorizontal: string;
  cropVertical: string;
  voltageV: number;
  currentMa: number;
  powerW: number;
  defaultExpCompUs: string;
}

export interface GpioPinItem {
  pin: number;
  signal: string;
  type: string;
  voltageLevel: string;
  descriptionKo: string;
  remarksKo: string;
}

export interface UsbCPinPair {
  pinA: string;
  signalA: string;
  descAKo: string;
  pinB: string;
  signalB: string;
  descBKo: string;
}

export interface SdkApiParam {
  name: string;
  type: string;
  direction: 'IN' | 'OUT' | 'IN/OUT' | 'NONE';
  descriptionKo: string;
}

export interface SdkApiConstant {
  hex: string;
  label: string;
  descriptionKo: string;
}

export interface SdkApiItem {
  id: string;
  name: string;
  signature: string;
  group: 'init' | 'image' | 'exposure' | 'trigger' | 'face-system';
  groupLabel: string;
  pdfPage: number;
  summaryKo: string;
  returnDesc: string;
  params: SdkApiParam[];
  constants?: SdkApiConstant[];
  notesKo?: string;
  sampleCode: string;
}

export interface UvcControlItem {
  nameKo: string;
  nameEn: string;
  tabWin: string;
  minVal: string;
  maxVal: string;
  defaultVal: string;
  stepSize: string;
  manualSupported: boolean;
  autoSupported: boolean;
  descriptionKo: string;
}

export interface TroubleshootingItem {
  id: string;
  symptomKo: string;
  ledState: string;
  osScope: '공통' | 'Windows' | 'Linux' | 'DFU';
  causeKo: string;
  solutionKo: string;
  relatedPdfId: string;
  relatedPage: number;
}

export interface FaqItem {
  id: string;
  questionKo: string;
  questionEn: string;
  answerKo: string;
  category: '하드웨어/광학' | '스트리밍/성능' | '소프트웨어/OS' | '지원/보증';
  relatedPdfId: string;
  relatedPage: number;
}

export interface SearchResultEntry {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<SearchCategory, 'all'>;
  categoryLabel: string;
  body: string;
  keywords: string[];
  targetTab: MainTabId;
  targetSection?: string;
  targetApiId?: string;
  pdfId: string;
  pdfPage: number;
}

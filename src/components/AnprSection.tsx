import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Code2,
  Copy,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

interface AnprSectionProps {
  onOpenPdf: (pdfId: string, page: number) => void;
  onJumpToSdkApi: (apiId: string) => void;
}

interface ProcedureStep {
  step: number;
  phase: string;
  title: string;
  specSummary: string;
  description: string;
  engineeringNote: string;
}

const ANPR_PROCEDURE_STEPS: ProcedureStep[] = [
  {
    step: 1,
    phase: '기구 설치 · 레이더',
    title: '레이더 지상 3.5 m 높이 설치',
    specSummary: '설치 높이 H_radar = 3.5 m (차선 상부 갠트리 또는 측면 암 폴)',
    description:
      '과속 검지용 도플러/FMCW 레이더를 노면으로부터 3.5 m 높이에 견고하게 고정합니다. 차선 진행 방향과 수평 정렬(Azimuth 0° 근접)하여 코사인 오차(Cosine Effect)를 최소화합니다.',
    engineeringNote:
      '차량 루프에 의한 후속 차량 가림을 줄이고 80 m 원거리 반사파 수신율을 확보하기 위한 표준 단속 높이입니다.',
  },
  {
    step: 2,
    phase: '조준 정렬 · 레이더',
    title: '전방 80 m 검지 시작점 하향 틸트 조준',
    specSummary: '검지 시작 거리 D_detect = 80 m · 하향 부각 θ_radar ≈ 2.50° (사선 거리 80.08 m)',
    description:
      '전방 80 m 지점에 진입하는 차량부터 안정적으로 검지할 수 있도록 레이더를 수평선 기준 약 2.5°(arctan(3.5 / 80)) 아래로 살짝 숙여 고정합니다.',
    engineeringNote:
      '과도하게 숙이면 80 m 원거리 감도가 저하되고, 너무 들면 근거리(15~10 m) 진입 시 빔 상단을 벗어나므로 2.5° 전후 틸트가 적합합니다.',
  },
  {
    step: 3,
    phase: '과속 판정 · 추적',
    title: '80 m 전방에서부터 실시간 속도 측정 및 과속 여부 판단',
    specSummary: '추적 구간 80 m → 10 m (이동 거리 70 m · 100 km/h 기준 약 2.52초 여유)',
    description:
      '차량이 80 m 지점에 진입한 순간부터 레이더가 실시간 거리(R)와 접근 속도(V)를 계측합니다. 제한속도 초과가 확인되면 과속 단속 타겟으로 확정하고, 카메라 조준 센터(10 m) 도달 예상 시각(ETA = (R - 10) / V)을 지속 갱신합니다.',
    engineeringNote:
      '약 2~3초의 선행 추적 시간 동안 카메라 주/야간 노출값 및 Strobe 조명 충전 상태를 사전 대기(Pre-arm)시킬 수 있습니다.',
  },
  {
    step: 4,
    phase: '기구 설치 · 카메라',
    title: 'See3CAM_24CUG 카메라 지상 3.5 m 높이 설치',
    specSummary: '설치 높이 H_cam = 3.5 m · 권장 모델: See3CAM_24CUG_CH_TC / CHL_TC (외부 방수 하우징)',
    description:
      'AR0234CS 글로벌 셔터 기반 See3CAM_24CUG 카메라를 레이더와 동일한 3.5 m 높이에 장착합니다. 하드웨어 트리거 및 야간 Strobe 핀을 사용해야 하므로 6핀 GPIO 헤더(CN6)가 노출된 보드형 모델(CH_TC 또는 CHL_TC)을 방수 하우징 내부에 구성합니다.',
    engineeringNote:
      '밀폐 인클로저 모델(CHL_TC_BX)은 6핀 GPIO 헤더가 외부로 인출되지 않아 하드웨어 Strobe/Trigger 사용이 불가합니다.',
  },
  {
    step: 5,
    phase: '조준 정렬 · 카메라',
    title: '카메라 지면 조준선 센터 약 10 m 설정',
    specSummary: '지면 조준 센터 D_aim = 10 m · 하향 부각 θ_cam ≈ 19.29° (사선 거리 10.59 m)',
    description:
      '카메라 광축 중심이 전방 지면 약 10 m 지점을 향하도록 수평 대비 약 19.3°(arctan(3.5 / 10)) 숙여 조준합니다. 차량 전면 번호판(지상 약 0.4~0.6 m 높이)은 지면 10 m 도달 직전인 약 9.0~10.5 m 구간에서 프레임 정중앙을 통과합니다.',
    engineeringNote:
      '10.6 m 거리에서 번호판(폭 520 mm) 해상력을 확보하려면 CH_TC 모델에 f=12 mm~16 mm급 M12 저왜곡 협각 렌즈 장착을 권장합니다.',
  },
  {
    step: 6,
    phase: '고속 연속 촬영',
    title: '과속 차량 조준선 센터 진입 시 다연발 베스트 셔터링 (Burst Shuttering)',
    specSummary: '글로벌 셔터 무왜곡 · 1920×1200 @ 114fps 또는 외부 TRIG 다연발 펄스 (5~8매 연속)',
    description:
      '레이더 추적 거리가 카메라 조준 센터 진입 구간(예: 11.5 m → 8.5 m)에 들어오면, 짧은 노광 시간(200~500 µs)으로 설정된 See3CAM_24CUG로 연속 다중 프레임(베스트 셔터링)을 취득합니다.',
    engineeringNote:
      'AR0234CS 글로벌 셔터는 전 픽셀을 동시에 노광하므로 고속 주행 차량 번호판이 기울어지는 롤링 셔터 왜곡(Jello Effect)이 전혀 발생하지 않습니다.',
  },
  {
    step: 7,
    phase: '야간 동기 발광',
    title: '야간 촬영 시 See3CAM_24CUG Pin 5 (STROBE) 기반 조명 동기 제어',
    specSummary: 'CN6 Pin 5 Open-Drain 출력 + 외부 4.7 kΩ 풀업 → 고출력 LED/IR 스트로브 드라이버',
    description:
      '야간 또는 터널/악천후 시 SetStrobeMode24CUG(0x01)로 Strobe 출력을 활성화합니다. 베스트 셔터링의 각 프레임이 노광되는 수백 µs 동안에만 Pin 5에서 동기 신호가 출력되어 외부 LED/IR 투광기를 정밀 펄스 발광시킵니다.',
    engineeringNote:
      '상시 점등 조명 대비 운전자 눈부심과 조명 발열을 획기적으로 줄이면서도 순간 광량을 극대화해 야간 셔터 스피드(250 µs 이하)를 확보합니다.',
  },
  {
    step: 8,
    phase: '최적 영상 선별',
    title: '연속 촬영 프레임 중 최적 번호판 이미지 선별 (Best-Shot Selection)',
    specSummary: '번호판 ROI 검출 신뢰도 + Laplacian 엣지 선명도 + 적정 휘도(포화 배제) 스코어링',
    description:
      '버스트로 수집된 5~10장의 프레임 각각에서 번호판 후보 영역을 탐지한 뒤, 초점/모션 선명도(Laplacian 분산 또는 Tenengrad 기울기), 반사 포화 없는 적정 밝기, 프레임 중앙 근접도를 가중 합산하여 가장 인식하기 좋은 대표 사진을 자동 선택합니다.',
    engineeringNote:
      '와이퍼 가림, 헤드라이트 순간 난반사, 노면 진동 등이 발생한 불량 프레임을 걸러내어 단속 성공률을 극대화합니다.',
  },
  {
    step: 9,
    phase: '번호 인식 · 패킷화',
    title: '선별된 베스트 이미지 기반 번호판 인식(ANPR) 및 증거 생성',
    specSummary: '고화질 원본 크롭 → 문자 분할/딥러닝 OCR → 속도·시각·차선·고유 카메라 ID 결합',
    description:
      '최종 선택된 베스트 프레임에서 번호판 문자열을 인식하고, 레이더 계측 과속 수치, 촬영 타임스탬프, GetCameraUniqueID()로 조회한 카메라 시리얼 정보를 결합하여 단속 레코드를 완성합니다.',
    engineeringNote:
      '필요 시 전체 차량 전경 이미지 1장과 번호판 확대 크롭 이미지를 함께 저장하여 판독 증빙 신뢰성을 높입니다.',
  },
];

const SDK_WORKFLOW_MAPPING = [
  {
    stage: '1. 장치 열거 및 초기화',
    apiId: 'InitExtensionUnit',
    apiCall: 'GetDevicesCount() → GetDevicePaths() → InitExtensionUnit(szInstanceID)',
    pdfPage: 6,
    role: '호스트 PC/엣지 보드에 연결된 See3CAM_24CUG 인스턴스를 탐색하고 HID 확장 제어 채널을 초기화합니다.',
  },
  {
    stage: '2. 장비 식별 및 버전 검증',
    apiId: 'GetCameraUniqueID',
    apiCall: 'ReadFirmwareVersion(...) · GetCameraUniqueID(szUniqueID)',
    pdfPage: 9,
    role: '다차선 운용 시 차선별 물리 카메라를 고유 ID로 매칭하고 현장 펌웨어 버전을 로그에 기록합니다.',
  },
  {
    stage: '3. 장착 방향·포맷·화질 최적화',
    apiId: 'SetQFactor24CUG',
    apiCall: 'SetFlipMode24CUG(0x00) · SetSpecialEffects24CUG(0x01/0x07) · SetQFactor24CUG(90) · SetDenoiseValue24CUG(4)',
    pdfPage: 15,
    role: '하우징 장착 방향 보정, 주간 컬러(0x01)/야간 IR 흑백(0x07 Grayscale), MJPEG 고화질 Q-Factor(90~96) 및 과도한 문자 뭉개짐 방지를 위한 낮은 De-Noise(2~5)를 설정합니다.',
  },
  {
    stage: '4. 고속 셔터 노광 및 AE 상한 제어',
    apiId: 'SetExposureCompensation24CUG',
    apiCall: 'UVC 수동 노출(200~500µs) 또는 SetExposureCompensation24CUG(500) + SetExpRoiMode24CUG(0x02, 128, 140, 4)',
    pdfPage: 20,
    role: '모션 블러 방지를 위해 수동 고속 셔터(DirectShow -12/-11, V4L2 2~5)를 권장하며, 주간 AE 사용 시에도 노출 상한을 500 µs 이하로 묶고 번호판 통과 지점에 AE ROI를 지정합니다.',
  },
  {
    stage: '5. 야간 Pin 5 Strobe 동기 활성화',
    apiId: 'SetStrobeMode24CUG',
    apiCall: 'SetStrobeMode24CUG(0x01) [야간 ON] / SetStrobeMode24CUG(0x00) [주간 OFF]',
    pdfPage: 22,
    role: '야간/조도 센서 트리거 시 Pin 5 오픈 드레인 Strobe 신호를 켜서 셔터 노광 순간에만 외부 고출력 LED/IR 조명이 동기 발광하도록 합니다.',
  },
  {
    stage: '6. 베스트 셔터링 스트림/트리거 구동',
    apiId: 'SetStreamMode24CUG',
    apiCall: '방식 A: SetStreamMode24CUG(0x01, 0x01) [외부 TRIG 펄스열] / 방식 B: SetStreamMode24CUG(0x00, 0x00) + SetFrameRateValue24CUG(120)',
    pdfPage: 24,
    role: '외부 제어기가 Pin 4(TRIG)에 다연발 펄스를 인가해 정밀 위치별 N장을 찍거나(방식 A), Master 114/120fps 고속 스트리밍 버퍼에서 진입 구간 프레임을 일괄 추출합니다(방식 B).',
  },
  {
    stage: '7. 종료 및 이상 시 원격 복구',
    apiId: 'ResetDevice',
    apiCall: 'DeinitExtensionUnit() · (비정상 응답 시 ResetDevice())',
    pdfPage: 25,
    role: '단속 서비스 종료 시 핸들을 안전하게 닫으며, 무인 함체 운용 중 예외 발생 시 소프트웨어 리셋으로 자동 복구합니다.',
  },
];

const CODE_SNIPPETS = {
  initAndSetup: `// [1단계] See3CAM_24CUG 초기화 및 과속 번호인식(주/야간 Strobe) 설정 예제 (C++)
#include <windows.h>
#include <tchar.h>
#include <stdio.h>
#include "See3CAM_24CUG_SDK.h" // e-con Extension Unit SDK 헤더

bool ConfigureCameraForSpeedANPR(bool isNightMode, bool useHardwareTrigger) {
    UINT32 devCount = 0;
    if (!GetDevicesCount(&devCount) || devCount == 0) {
        printf("[오류] 연결된 See3CAM_24CUG 카메라를 찾을 수 없습니다.\\n");
        return false;
    }

    TCHAR **devPaths = new TCHAR*[devCount];
    for (UINT32 i = 0; i < devCount; i++) devPaths[i] = new TCHAR[MAX_PATH];

    bool ok = false;
    if (GetDevicePaths(devPaths) && InitExtensionUnit(devPaths[0])) {
        UINT8 major = 0, minor1 = 0;
        UINT16 minor2 = 0, minor3 = 0;
        TCHAR uniqueId[50] = { 0 };
        ReadFirmwareVersion(&major, &minor1, &minor2, &minor3);
        GetCameraUniqueID(uniqueId);
        _tprintf(_T("[초기화 완료] Camera ID: %s (FW %u.%u.%u.%u)\\n"),
                 uniqueId, major, minor1, minor2, minor3);

        // 1) 정방향 장착(0x00), 번호판 엣지 보존을 위해 낮은 디노이즈(3), 고화질 MJPEG Q-Factor(92)
        SetFlipMode24CUG(0x00);
        SetDenoiseValue24CUG(0x03);
        SetQFactor24CUG(92);

        // 2) 주간: 일반 컬러(0x01) / 야간 IR 조명 사용 시: Grayscale(0x07) 전환으로 대비 향상
        SetSpecialEffects24CUG(isNightMode ? 0x07 : 0x01);

        // 3) 번호판 통과 영역(중앙~중하단: X=128, Y=148, WinSize=4) 중심 노출 참조 및 최대 400us 제한
        //    * 참고: 고속 단속에서는 DirectShow IAMCameraControl::Set(CameraControl_Exposure, -12 [200us], Manual) 병행 권장
        SetExpRoiMode24CUG(0x02, 128, 148, 4);
        SetExposureCompensation24CUG(400); // AE 동작 시에도 400us(0.4ms) 초과 노광 방지

        // 4) 야간 모드 시 CN6 Pin 5 (STROBE) 동기 출력 활성화 (0x01: ON, 0x00: OFF)
        SetStrobeMode24CUG(isNightMode ? 0x01 : 0x00);

        // 5) 스트리밍 모드 설정
        //    - 하드웨어 트리거(0x01): 레이더 제어기가 10m 진입 시 Pin 4(TRIG)에 N회 펄스 인가, AE/AWB Lock(0x01)
        //    - 마스터 고속 버스트(0x00): 114~120fps 연속 스트리밍 후 소프트웨어 버스트 추출
        if (useHardwareTrigger) {
            SetStreamMode24CUG(0x01, 0x01); // Trigger Mode + Auto Functions Lock
        } else {
            SetStreamMode24CUG(0x00, 0x00); // Master Mode
            SetFrameRateValue24CUG(120);    // 최대 프레임레이트(1920x1200 MJPEG 114fps / 1080p 120fps)
        }
        ok = true;
    }

    for (UINT32 i = 0; i < devCount; i++) delete[] devPaths[i];
    delete[] devPaths;
    return ok;
}`,
  radarBurstSequence: `// [2단계] 레이더 80m 과속 추적 → 10m 조준선 진입 시 다연발 베스트 셔터링 제어 시퀀스
struct RadarTrack {
    int trackId;
    double distanceM;   // 카메라/레이더 폴 기준 전방 거리 (80.0m -> 0.0m)
    double speedKmh;    // 측정 속도 (km/h)
    bool isOverspeed;   // 제한속도 초과 여부
};

// 레이더 콜백 (예: 20~50Hz 주기로 수신)
void OnRadarTelemetryUpdate(const RadarTrack& target, double speedLimitKmh) {
    // 1. 전방 80m 이내 진입 차량의 과속 여부 판단
    if (target.distanceM <= 80.0 && target.speedKmh > speedLimitKmh) {
        // 사전 준비(Pre-Arm): 20m 이내 접근 시 AE/AWB 수렴값을 고정하여 버스트 간 밝기 흔들림 방지
        if (target.distanceM <= 20.0 && target.distanceM > 12.0) {
            SetStreamMode24CUG(0x01, 0x01); // 외부 Trigger 대기 + 노출/화이트밸런스 Lock
        }

        // 2. 카메라 지면 조준선 센터(10m) 진입 윈도우(11.5m ~ 8.5m) 도달 시 베스트 셔터링 발사
        if (target.distanceM <= 11.5 && target.distanceM >= 8.5) {
            // MCU / GPIO 제어기를 통해 CN6 Pin 4 (TRIG, VIH 3.3V~5V)로 8.8ms 간격 7연발 펄스 출력
            // -> 매 펄스마다 글로벌 셔터 노광(예: 250us)과 동시에 Pin 5 (STROBE) 야간 조명이 동기 점등됨!
            FireHardwareTriggerBurst(/*pulseCount=*/7, /*pulseWidthUs=*/1000, /*intervalUs=*/8800);
        }
    }
}`,
  bestShotSelection: `// [3단계] 연속 촬영된 다중 프레임 중 번호판 인식 최적 사진(Best Shot) 선별 예제
#include <vector>
#include <cmath>

struct BurstFrame {
    int frameIndex;
    const unsigned char* grayBuffer; // 1920x1200 Y 채널 또는 Grayscale 버퍼
    int width;
    int height;
    int plateX, plateY, plateW, plateH; // 1차 경량 번호판 탐지기 ROI 좌표
    float plateConfidence;
};

// 번호판 ROI 내부의 Laplacian 엣지 선명도 + 노출 적정도(과포화 패널티) 계산
double EvaluatePlateQualityScore(const BurstFrame& f) {
    if (f.plateConfidence < 0.5f || f.plateW < 60 || f.plateH < 20) return -1.0;

    double sumLum = 0.0, sumLapSq = 0.0;
    int saturatedPixels = 0, count = 0;

    for (int y = f.plateY + 1; y < f.plateY + f.plateH - 1; ++y) {
        for (int x = f.plateX + 1; x < f.plateX + f.plateW - 1; ++x) {
            int idx = y * f.width + x;
            int c = f.grayBuffer[idx];
            // 2차 미분 라플라시안 커널 (초점 및 무블러 선명도 측정)
            int lap = -4 * c
                      + f.grayBuffer[idx - 1] + f.grayBuffer[idx + 1]
                      + f.grayBuffer[idx - f.width] + f.grayBuffer[idx + f.width];
            sumLum += c;
            sumLapSq += static_cast<double>(lap * lap);
            if (c >= 250) saturatedPixels++; // 야간 Strobe 과반사(백화) 픽셀 체크
            count++;
        }
    }
    if (count == 0) return -1.0;

    double sharpness = sumLapSq / count;                     // 값이 클수록 문자 윤곽이 또렷함
    double meanLum = sumLum / count;                         // 이상적 번호판 평균 휘도: 110 ~ 190
    double satRatio = static_cast<double>(saturatedPixels) / count;
    double exposurePenalty = std::abs(meanLum - 150.0) * 1.5 + (satRatio * 5000.0);

    return (sharpness * f.plateConfidence) - exposurePenalty;
}

int SelectBestFrameForANPR(const std::vector<BurstFrame>& burstFrames) {
    int bestIdx = -1;
    double bestScore = -1e9;
    for (size_t i = 0; i < burstFrames.size(); ++i) {
        double score = EvaluatePlateQualityScore(burstFrames[i]);
        if (score > bestScore) {
            bestScore = score;
            bestIdx = static_cast<int>(i);
        }
    }
    return bestIdx; // 이 인덱스의 원본 이미지를 최종 번호판 문자 인식(ANPR OCR) 엔진에 전달
}`,
};

export function AnprSection({ onOpenPdf, onJumpToSdkApi }: AnprSectionProps) {
  // Interactive Speed & Shutter Timing Simulator State
  const [speedKmh, setSpeedKmh] = useState<number>(110);
  const [shutterUs, setShutterUs] = useState<number>(250);
  const [burstFps, setBurstFps] = useState<number>(114);

  // Code Tab State
  const [activeCodeTab, setActiveCodeTab] = useState<'initAndSetup' | 'radarBurstSequence' | 'bestShotSelection'>('initAndSetup');
  const [copiedCode, setCopiedCode] = useState(false);

  const metrics = useMemo(() => {
    const speedMs = speedKmh / 3.6;
    const trackingTimeSec = 70 / speedMs; // 80m -> 10m (70m)
    const frameIntervalMs = 1000 / burstFps;
    const interFrameMoveCm = speedMs * (frameIntervalMs / 1000) * 100;
    const motionBlurMm = speedMs * (shutterUs / 1_000_000) * 1000;
    // Capture zone: 3.0m window around 10m center (11.5m -> 8.5m)
    const zonePassMs = (3.0 / speedMs) * 1000;
    const burstFramesIn3m = Math.max(1, Math.floor(zonePassMs / frameIntervalMs) + 1);

    return {
      speedMs,
      trackingTimeSec,
      frameIntervalMs,
      interFrameMoveCm,
      motionBlurMm,
      zonePassMs,
      burstFramesIn3m,
    };
  }, [speedKmh, shutterUs, burstFps]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <div className="space-y-12">
      {/* Page Title & Quick Anchor Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            응용 시스템 아키텍처 · 3.5m 폴대 레이더(80m) + See3CAM_24CUG(10m) + 야간 Strobe 동기화
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-0.5">
            차량 과속 검지 및 번호 인식 (ANPR) 설계 매뉴얼
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { href: '#anpr-geometry', label: '기하 배치 & 타이밍 계산' },
            { href: '#anpr-procedure', label: '9단계 운용 절차' },
            { href: '#anpr-strobe-circuit', label: '야간 Strobe 회로 설계' },
            { href: '#anpr-sdk-guide', label: 'SDK API & C++ 코드' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* 1. System Geometry Diagram & Interactive Burst Calculator */}
      <section id="anpr-geometry" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              1. 레이더(80m) · 카메라(10m) 기하학적 배치 및 베스트 셔터링 시뮬레이터
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              지상 3.5 m 동일 높이 기준: 레이더 하향각 약 2.50° (80 m 검지) · See3CAM_24CUG 하향각 약 19.29° (10 m 지면 센터 조준)
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenPdf('datasheet', 7)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>글로벌 셔터 센서 사양 (PDF p.7)</span>
          </button>
        </div>

        {/* Side-View SVG Engineering Diagram */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <svg
            viewBox="0 0 880 275"
            className="w-full h-auto select-none"
            role="img"
            aria-label="3.5m 높이 레이더 80m 과속 검지 및 See3CAM_24CUG 10m 베스트 셔터링 측면 기하도"
          >
            {/* Ground Road Line */}
            <line
              x1="40"
              y1="225"
              x2="850"
              y2="225"
              className="stroke-slate-400 dark:stroke-slate-600"
              strokeWidth="2.5"
            />

            {/* Gantry Pole at X=110 (0m Reference) */}
            <rect
              x="98"
              y="55"
              width="14"
              height="170"
              rx="3"
              className="fill-slate-700 dark:fill-slate-300"
            />
            <line
              x1="72"
              y1="55"
              x2="72"
              y2="225"
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text
              x="64"
              y="145"
              textAnchor="end"
              className="fill-slate-700 dark:fill-slate-300 text-[11px] font-mono font-bold"
            >
              H = 3.5m
            </text>

            {/* Camera + Strobe Unit + Radar on 3.5m Gantry */}
            <rect
              x="112"
              y="46"
              width="74"
              height="22"
              rx="4"
              className="fill-blue-600"
            />
            <text
              x="149"
              y="60"
              textAnchor="middle"
              className="fill-white text-[10px] font-mono font-bold"
            >
              Radar 3.5m
            </text>

            <rect
              x="112"
              y="72"
              width="98"
              height="24"
              rx="4"
              className="fill-slate-900 dark:fill-slate-100"
            />
            <text
              x="161"
              y="87"
              textAnchor="middle"
              className="fill-white dark:fill-slate-900 text-[10px] font-mono font-bold"
            >
              24CUG + Strobe
            </text>

            {/* Radar Beam to 80m (X=790) */}
            <polygon
              points="186,57 790,225 710,225"
              className="fill-amber-500/12 dark:fill-amber-400/12"
            />
            <line
              x1="186"
              y1="57"
              x2="790"
              y2="225"
              className="stroke-amber-500 dark:stroke-amber-400"
              strokeWidth="2"
              strokeDasharray="7 5"
            />
            <text
              x="510"
              y="132"
              className="fill-amber-700 dark:fill-amber-300 text-[11px] font-mono font-semibold"
            >
              레이더 검지선 (θ ≈ 2.50° 하향 · 80m 과속 추적 시작)
            </text>

            {/* Camera FOV & Strobe Sync Cone to 10m Center (X=295) */}
            <polygon
              points="180,96 250,225 345,225"
              className="fill-blue-500/15 dark:fill-blue-400/20"
            />
            <line
              x1="180"
              y1="96"
              x2="295"
              y2="225"
              className="stroke-blue-600 dark:stroke-blue-400"
              strokeWidth="2.2"
            />
            <text
              x="262"
              y="152"
              className="fill-blue-700 dark:fill-blue-300 text-[11px] font-mono font-semibold"
            >
              카메라 광축 & Strobe 동조 (θ ≈ 19.29°)
            </text>

            {/* Burst Zone Highlight on Road around 10m */}
            <rect
              x="250"
              y="220"
              width="95"
              height="10"
              rx="3"
              className="fill-blue-600 dark:fill-blue-500"
            />

            {/* Approaching Vehicle at 80m */}
            <rect
              x="752"
              y="198"
              width="58"
              height="24"
              rx="5"
              className="fill-amber-500/90"
            />
            <text
              x="781"
              y="214"
              textAnchor="middle"
              className="fill-white text-[10px] font-mono font-bold"
            >
              과속검지
            </text>

            {/* Target Vehicle in 10m Burst Zone */}
            <rect
              x="268"
              y="196"
              width="62"
              height="26"
              rx="5"
              className="fill-blue-600"
            />
            <text
              x="299"
              y="213"
              textAnchor="middle"
              className="fill-white text-[10px] font-mono font-bold"
            >
              연속촬영
            </text>

            {/* Direction Arrow */}
            <line
              x1="730"
              y1="209"
              x2="355"
              y2="209"
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <polygon
              points="355,209 365,204 365,214"
              className="fill-slate-500 dark:fill-slate-400"
            />
            <text
              x="545"
              y="202"
              textAnchor="middle"
              className="fill-slate-600 dark:fill-slate-400 text-[11px]"
            >
              차량 접근 및 속도 추적 구간 (80m → 10m, 70m 이동)
            </text>

            {/* Distance Markers on Bottom */}
            <text
              x="105"
              y="250"
              textAnchor="middle"
              className="fill-slate-700 dark:fill-slate-300 text-[11px] font-mono font-semibold"
            >
              0 m (폴 기준)
            </text>
            <text
              x="295"
              y="250"
              textAnchor="middle"
              className="fill-blue-600 dark:fill-blue-400 text-[11px] font-mono font-bold"
            >
              약 10 m (조준선 센터 · 베스트 셔터링)
            </text>
            <text
              x="790"
              y="250"
              textAnchor="middle"
              className="fill-amber-600 dark:fill-amber-400 text-[11px] font-mono font-bold"
            >
              80 m (레이더 검지 시작)
            </text>
          </svg>
        </div>

        {/* Interactive Speed / Exposure / Burst Timing Calculator */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>과속 주행 속도별 셔터 블러 및 베스트 셔터링 간격 계산기</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">차량 주행 속도</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {speedKmh} km/h ({metrics.speedMs.toFixed(1)} m/s)
                </span>
              </div>
              <input
                type="range"
                min={60}
                max={180}
                step={5}
                value={speedKmh}
                onChange={(e) => setSpeedKmh(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">글로벌 셔터 노광 시간</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {shutterUs} µs ({(shutterUs / 1000).toFixed(2)} ms)
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={shutterUs}
                onChange={(e) => setShutterUs(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">연속 촬영 속도 (FPS / TRIG)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {burstFps} fps ({metrics.frameIntervalMs.toFixed(2)} ms 간격)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[60, 114, 120].map((fps) => (
                  <button
                    key={fps}
                    type="button"
                    onClick={() => setBurstFps(fps)}
                    className={`py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                      burstFps === fps
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {fps} fps
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 tabular-nums">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">80m → 10m 도달 여유 시간</div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-50 mt-0.5">
                {metrics.trackingTimeSec.toFixed(2)} 초
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">과속 확정 및 Strobe 대기 충분</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">프레임 간 차량 전진 간격</div>
              <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                {metrics.interFrameMoveCm.toFixed(1)} cm
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">조준 센터 통과 시 촘촘한 샘플링</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">센터 ±1.5m 구간 확보 매수</div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-50 mt-0.5">
                약 {metrics.burstFramesIn3m} 장
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">통과 시간 {metrics.zonePassMs.toFixed(0)} ms 동안 취득</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">노광 중 차량 이동량 (모션 블러)</div>
              <div
                className={`text-lg font-bold font-mono mt-0.5 ${
                  metrics.motionBlurMm <= 12
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {metrics.motionBlurMm.toFixed(1)} mm
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {metrics.motionBlurMm <= 12 ? '번호판 문자 윤곽 선명 (권장 범위)' : '노광 시간을 300µs 이하로 단축 권장'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 9-Step Standard Operating Procedure */}
      <section id="anpr-procedure" className="scroll-mt-24 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            2. 차량 과속 검지 및 번호 인식 9단계 수행 절차
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            80 m 원거리 레이더 검지부터 10 m 조준선 베스트 셔터링, 야간 Strobe 발광, 베스트 프레임 선별 인식까지의 전체 흐름입니다.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
          {ANPR_PROCEDURE_STEPS.map((item) => (
            <div key={item.step} className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6">
              <div className="lg:col-span-4">
                <div className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                  STEP 0{item.step} · {item.phase}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {item.title}
                </h3>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                  {item.specSummary}
                </div>
              </div>
              <div className="lg:col-span-8 space-y-1.5 text-xs sm:text-sm">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  설계 포인트: {item.engineeringNote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Nighttime Strobe & External Trigger Hardware Interface */}
      <section id="anpr-strobe-circuit" className="scroll-mt-24 space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              3. 야간 조명 동기화를 위한 See3CAM_24CUG Strobe · Trigger 하드웨어 연동 설계
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              6핀 GPIO 커넥터(CN6/CN2: Molex 202396-0607, 상대 하우징 Molex 0151330602) 회로 구성 규격
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenPdf('datasheet', 8)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>데이터시트 GPIO DC 규격 (PDF p.8–12)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SVG Wiring Block Diagram */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
              CN6 Pin 4 (TRIG) 및 Pin 5 (STROBE Open-Drain) 외부 조명 드라이버 결선 개념도
            </div>
            <svg
              viewBox="0 0 460 225"
              className="w-full h-auto"
              role="img"
              aria-label="See3CAM_24CUG Pin 4 TRIG and Pin 5 STROBE Open-Drain LED Driver Schematic"
            >
              {/* Camera Block */}
              <rect
                x="14"
                y="24"
                width="155"
                height="180"
                rx="8"
                className="fill-slate-100 dark:fill-slate-950 stroke-slate-300 dark:stroke-slate-700"
                strokeWidth="1.75"
              />
              <text
                x="91"
                y="46"
                textAnchor="middle"
                className="fill-slate-900 dark:fill-slate-100 text-[11px] font-mono font-bold"
              >
                See3CAM_24CUG (CN6)
              </text>
              <text
                x="91"
                y="61"
                textAnchor="middle"
                className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono"
              >
                CHL_TC / CH_TC 보드형
              </text>

              <text x="158" y="95" textAnchor="end" className="fill-blue-600 dark:fill-blue-400 text-[11px] font-mono font-bold">
                Pin 4: TRIG (IN)
              </text>
              <text x="158" y="142" textAnchor="end" className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-mono font-bold">
                Pin 5: STROBE (OD)
              </text>
              <text x="158" y="185" textAnchor="end" className="fill-slate-600 dark:fill-slate-400 text-[11px] font-mono font-bold">
                Pin 6: GND
              </text>

              {/* Pull-up Resistor on Pin 5 */}
              <line x1="169" y1="138" x2="305" y2="138" className="stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="2" />
              <line x1="235" y1="138" x2="235" y2="112" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
              <rect x="227" y="88" width="16" height="24" rx="2" className="fill-white dark:fill-slate-800 stroke-slate-500" strokeWidth="1.5" />
              <text x="250" y="103" className="fill-slate-700 dark:fill-slate-300 text-[10px] font-mono">
                4.7 kΩ 풀업 (3.3V/5V)
              </text>

              {/* Radar / Edge Controller Block */}
              <rect
                x="305"
                y="24"
                width="140"
                height="72"
                rx="8"
                className="fill-blue-50 dark:fill-blue-950/40 stroke-blue-500/60"
                strokeWidth="1.5"
              />
              <text x="375" y="48" textAnchor="middle" className="fill-slate-900 dark:fill-slate-100 text-[11px] font-bold">
                레이더·단속 제어기
              </text>
              <text x="375" y="64" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[10px] font-mono">
                3.3V / 5V Pulse Out
              </text>
              <line x1="305" y1="91" x2="169" y2="91" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="2" />

              {/* High-Power Strobe Driver Block */}
              <rect
                x="305"
                y="114"
                width="140"
                height="90"
                rx="8"
                className="fill-emerald-50 dark:fill-emerald-950/35 stroke-emerald-500/60"
                strokeWidth="1.5"
              />
              <text x="375" y="138" textAnchor="middle" className="fill-slate-900 dark:fill-slate-100 text-[11px] font-bold">
                절연 게이트 / 조명 드라이버
              </text>
              <text x="375" y="155" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[10px] font-mono">
                고출력 IR / 백색 Strobe
              </text>
              <text x="375" y="172" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[9.5px] font-mono">
                (별도 12V/24V 전원 공급)
              </text>

              {/* Common GND */}
              <line x1="169" y1="181" x2="305" y2="181" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.75" strokeDasharray="4 3" />
            </svg>
          </div>

          {/* Electrical Design Checklist */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3.5 text-xs sm:text-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              야간 Strobe 및 외부 트리거 회로 설계 필수 체크리스트
            </h3>
            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">1. Pin 5 (STROBE) 오픈 드레인 풀업 필수:</span>{' '}
                내부 오픈 드레인(Open-Drain) 구조이므로 외부 제어 전압(<span className="font-mono">1.8V ~ 5V</span>)에 약 <span className="font-mono">4.7 kΩ</span> 풀업 저항을 연결해야 유효한 구형파 신호가 형성됩니다 (<span className="font-mono">VOL ≤ 0.1 V @ 100 µA</span>).
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">2. 조명 드라이버 전원 분리 및 절연:</span>{' '}
                10 m 거리 야간 번호판 촬영용 고출력 LED/IR 스트로브는 순간 수 A의 전류를 소모합니다. 카메라의 Pin 1(<span className="font-mono">VCC_5V</span>, USB3 최대 <span className="font-mono">400 mA</span> 한계)을 조명 전원으로 절대 사용하지 말고, 별도 <span className="font-mono">12V/24V SMPS</span>와 고속 포토커플러/MOSFET 드라이버로 구동하십시오.
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">3. Pin 4 (TRIG) 다연발 트리거 전압:</span>{' '}
                Active-High 입력(<span className="font-mono">VIH 1.17V ~ 5.0V</span>, 절대 최대 <span className="font-mono">6.5V</span>, 내부 <span className="font-mono">150 kΩ</span> 풀다운)으로 3.3V 또는 5V MCU/FPGA 출력과 직결 가능합니다. 기계식 접점이 아닌 전자식 클린 펄스를 인가하십시오.
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">4. 야간 IR(850nm/940nm) 대 가시광 Strobe 광학 팁:</span>{' '}
                기본 포함 렌즈(`CHL_TC`)에는 컬러 재현용 IR-Cut 필터가 적용되어 있을 수 있으므로, 불가시 적외선(850nm) 스트로브를 사용할 경우 <span className="font-mono">See3CAM_24CUG_CH_TC</span>(렌즈 미포함 보드)에 IR 투과형 M12 망원 렌즈 + 밴드패스 필터를 조합하고 <span className="font-mono">SetSpecialEffects24CUG(0x07)</span>(Grayscale)을 설정하면 야간 번호판 대비가 가장 뛰어납니다.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Extension Unit SDK API Mapping & C/C++ Implementation */}
      <section id="anpr-sdk-guide" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              4. See3CAM_24CUG Extension Unit SDK API 제어 절차 및 C/C++ 구현 코드
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              각 단계의 API를 클릭하면 SDK 레퍼런스 탭의 상세 파라미터 명세로 이동하거나 원본 PDF를 열 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenPdf('sdk-api', 6)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>SDK API 매뉴얼 원문 (PDF p.6–25)</span>
          </button>
        </div>

        {/* SDK Workflow Mapping Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold whitespace-nowrap">제어 단계</th>
                <th className="py-3 px-4 font-semibold">호출 SDK API 및 권장 인자</th>
                <th className="py-3 px-4 font-semibold">과속·번호인식 적용 역할</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">상세 명세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {SDK_WORKFLOW_MAPPING.map((row) => (
                <tr key={row.stage} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap align-top">
                    {row.stage}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-blue-600 dark:text-blue-400 align-top">
                    {row.apiCall}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed align-top">
                    {row.role}
                  </td>
                  <td className="py-3 px-4 align-top whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onJumpToSdkApi(row.apiId)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                      >
                        <span>API 보기</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenPdf('sdk-api', row.pdfPage)}
                        className="text-xs font-mono text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 tabular-nums"
                      >
                        p.{row.pdfPage}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* C/C++ Complete Reference Code Tabs */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1">
              {[
                { id: 'initAndSetup' as const, label: '1. 초기화 · 고속노출 · 야간 Strobe 설정' },
                { id: 'radarBurstSequence' as const, label: '2. 레이더 80m→10m 추적 & 다연발 트리거' },
                { id: 'bestShotSelection' as const, label: '3. 베스트 사진(Best Shot) 선별 알고리즘' },
              ].map((tab) => {
                const active = activeCodeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCodeTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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

            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>코드 복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>C++ 예제 복사</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 sm:p-5 bg-slate-950">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-2">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>See3CAM_24CUG Speed Enforcement &amp; ANPR Reference (C/C++)</span>
            </div>
            <pre className="font-mono text-xs leading-relaxed text-slate-100 overflow-x-auto">
              {CODE_SNIPPETS[activeCodeTab]}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}

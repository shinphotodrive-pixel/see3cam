import {
  FaqItem,
  TroubleshootingItem,
  UvcControlItem,
} from '../types/manual';

export const UVC_CONTROLS: UvcControlItem[] = [
  {
    nameKo: '밝기 (Brightness)',
    nameEn: 'Brightness',
    tabWin: 'Video Proc Amp',
    minVal: '-15',
    maxVal: '15',
    defaultVal: '0',
    stepSize: '1',
    manualSupported: true,
    autoSupported: false,
    descriptionKo: '저조도 환경에서의 화면 밝기를 보정하며, 변경 즉시 프리뷰에 반영됩니다.',
  },
  {
    nameKo: '명암비 (Contrast)',
    nameEn: 'Contrast',
    tabWin: 'Video Proc Amp',
    minVal: '0',
    maxVal: '30',
    defaultVal: '9',
    stepSize: '1',
    manualSupported: true,
    autoSupported: false,
    descriptionKo: '이미지의 휘도 대비(Luminance ratio)를 조절합니다.',
  },
  {
    nameKo: '채도 (Saturation)',
    nameEn: 'Saturation',
    tabWin: 'Video Proc Amp',
    minVal: '0',
    maxVal: '40',
    defaultVal: '16',
    stepSize: '1',
    manualSupported: true,
    autoSupported: false,
    descriptionKo: '컬러 강도를 조절합니다 (Rev 1.9/1.10 최신 펌웨어 기준 최대값 40).',
  },
  {
    nameKo: '선명도 (Sharpness)',
    nameEn: 'Sharpness',
    tabWin: 'Video Proc Amp',
    minVal: '0',
    maxVal: '127',
    defaultVal: '16',
    stepSize: '1',
    manualSupported: true,
    autoSupported: false,
    descriptionKo: '윤곽선 선명도(Clarity)를 강조하거나 부드럽게 조정합니다.',
  },
  {
    nameKo: '감마 (Gamma)',
    nameEn: 'Gamma',
    tabWin: 'Video Proc Amp',
    minVal: '40',
    maxVal: '500',
    defaultVal: '220',
    stepSize: '1',
    manualSupported: true,
    autoSupported: false,
    descriptionKo: '설정값 ÷ 100이 감마 지수입니다. 기본값 220은 sRGB 표준 감마 2.2를 의미합니다.',
  },
  {
    nameKo: '화이트 밸런스 (White Balance)',
    nameEn: 'White Balance',
    tabWin: 'Video Proc Amp',
    minVal: '1000 K',
    maxVal: '10000 K',
    defaultVal: '4500 K',
    stepSize: '50',
    manualSupported: true,
    autoSupported: true,
    descriptionKo: '색온도를 수동(1000~10000) 또는 자동(Auto 체크박스)으로 제어합니다.',
  },
  {
    nameKo: '게인 (Gain)',
    nameEn: 'Gain',
    tabWin: 'Video Proc Amp',
    minVal: '1',
    maxVal: '40',
    defaultVal: '1',
    stepSize: '1',
    manualSupported: true,
    autoSupported: false,
    descriptionKo: '수동 노출(Manual Exposure) 모드일 때만 유효하며, 자동 노출 시에는 비활성화됩니다.',
  },
  {
    nameKo: '전원 주파수 (Powerline Freq)',
    nameEn: 'Powerline Frequency',
    tabWin: 'Video Proc Amp',
    minVal: '50 Hz',
    maxVal: '60 Hz',
    defaultVal: 'Auto',
    stepSize: '-',
    manualSupported: true,
    autoSupported: true,
    descriptionKo: 'AC 조명으로 인한 플리커 방지. Auto/Disable 선택은 UVC Extension 메뉴와 연동됩니다.',
  },
  {
    nameKo: '노출 (Exposure)',
    nameEn: 'Exposure',
    tabWin: 'Camera Control',
    minVal: '-14 (50 µs) / QtCAM 0',
    maxVal: '0 (1 sec) / QtCAM 10000',
    defaultVal: '-5 (31.2 ms)',
    stepSize: '2배수 단계 / 0.1ms',
    manualSupported: true,
    autoSupported: true,
    descriptionKo:
      '노출 시간이 프레임 주기보다 길어지면(DirectShow -6 [15.6ms] 또는 -5 [31.2ms] 초과) 실제 FPS가 감소합니다.',
  },
];

export const EXPOSURE_MAPPING_DIRECTSHOW = [
  { slider: '-14', time: '50 µs (0.05 ms)' },
  { slider: '-13', time: '100 µs (0.1 ms)' },
  { slider: '-12', time: '200 µs (0.2 ms)' },
  { slider: '-11', time: '500 µs (0.5 ms)' },
  { slider: '-10', time: '1 ms' },
  { slider: '-9', time: '2 ms' },
  { slider: '-8', time: '3.9 ms' },
  { slider: '-7', time: '7.8 ms' },
  { slider: '-6', time: '15.6 ms' },
  { slider: '-5 (기본값)', time: '31.2 ms' },
  { slider: '-4', time: '62.5 ms' },
  { slider: '-3', time: '125 ms' },
  { slider: '-2', time: '250 ms' },
  { slider: '-1', time: '500 ms' },
  { slider: '0', time: '1 second (1,000 ms)' },
];

export const EXPOSURE_MAPPING_QTCAM = [
  { slider: '0', time: '0.05 ms (50 µs)' },
  { slider: '1', time: '0.1 ms' },
  { slider: '2', time: '0.2 ms' },
  { slider: '3', time: '0.3 ms' },
  { slider: '10', time: '1.0 ms' },
  { slider: '11', time: '1.1 ms' },
  { slider: '100', time: '10 ms' },
  { slider: '1000', time: '100 ms' },
  { slider: '10000', time: '1 second (1,000 ms)' },
];

export const ROI_WINDOW_SIZES = [
  { winSize: 1, ratio: '1/8', region720p: '160 × 90', region1080p: '240 × 135', region1200p: '240 × 150' },
  { winSize: 2, ratio: '2/8', region720p: '320 × 180', region1080p: '480 × 270', region1200p: '480 × 300' },
  { winSize: 3, ratio: '3/8', region720p: '480 × 270', region1080p: '720 × 405', region1200p: '720 × 450' },
  { winSize: 4, ratio: '4/8', region720p: '640 × 360', region1080p: '960 × 540', region1200p: '960 × 600' },
  { winSize: 5, ratio: '5/8', region720p: '800 × 450', region1080p: '1200 × 675', region1200p: '1200 × 750' },
  { winSize: 6, ratio: '6/8', region720p: '960 × 540', region1080p: '1440 × 810', region1200p: '1440 × 900' },
  { winSize: 7, ratio: '7/8', region720p: '1120 × 630', region1080p: '1680 × 945', region1200p: '1680 × 1050' },
  { winSize: 8, ratio: '8/8 (전체)', region720p: '1280 × 720', region1080p: '1920 × 1080', region1200p: '1920 × 1200' },
];

export const LINUX_INSTALL_COMMANDS = [
  {
    ubuntu: '구버전 QtCAM 제거 (선행 작업)',
    commands: `sudo rm -rf /usr/share/applications/Qtcam*.desktop
sudo rm -rf /usr/share/qml
sudo apt-get remove qtcam`,
  },
  {
    ubuntu: 'Ubuntu 18.04 LTS (Bionic)',
    commands: `sudo apt-add-repository ppa:qtcam/bionic
sudo apt-get update
sudo apt-get install qtcam`,
  },
  {
    ubuntu: 'Ubuntu 20.04 LTS (Focal)',
    commands: `sudo apt-add-repository ppa:qtcam/focal
sudo apt-get update
sudo apt-get install qtcam`,
  },
  {
    ubuntu: 'Ubuntu 22.04 LTS (Jammy)',
    commands: `sudo apt-add-repository ppa:qtcam/jammy
sudo apt-get update
sudo apt-get install qtcam`,
  },
  {
    ubuntu: '장치 커널 인식 확인 및 실행',
    commands: `sudo dmesg | grep -i -E "See3CAM_24CUG|2560:c128"
sudo qtcam`,
  },
];

export const TROUBLESHOOTING_ITEMS: TroubleshootingItem[] = [
  {
    id: 'ts-led-off-blink',
    symptomKo: '카메라 연결 후 전원 표시 LED가 꺼져 있거나 적색(Red)과 OFF 상태를 반복 점멸함',
    ledState: 'OFF 또는 적색↔꺼짐 반복',
    osScope: '공통',
    causeKo: '디바이스에 안정적인 USB 전원이 공급되지 않거나 케이블/커넥터 접촉 불량',
    solutionKo:
      'USB Type-A to Type-C 케이블 및 포트 체결 상태를 점검하십시오. USB 허브를 사용하는 경우 반드시 외부 유전원(Powered) USB 3.2 허브를 사용해야 합니다.',
    relatedPdfId: 'getting-started',
    relatedPage: 14,
  },
  {
    id: 'ts-led-red-ready',
    symptomKo: '카메라 연결 후 표시 LED가 적색(Red)으로 상시 점등되어 있음 (정상 대기)',
    ledState: '적색(Red) 상시 점등',
    osScope: '공통',
    causeKo: '고장이 아니며 보드에 정상적으로 전원이 인가되어 스트리밍 대기(Ready) 상태임',
    solutionKo:
      'Windows에서는 e-CAMView, Linux에서는 QtCAM을 실행하여 장치 목록에서 See3CAM_24CUG를 선택하면 황색(Yellow) LED로 전환되며 스트리밍이 시작됩니다.',
    relatedPdfId: 'getting-started',
    relatedPage: 14,
  },
  {
    id: 'ts-led-red-unlisted',
    symptomKo: '표시 LED는 적색(Red)으로 켜져 있으나 장치 관리자나 앱 목록에 카메라가 나타나지 않음',
    ledState: '적색 점등 · PC 미인식',
    osScope: 'DFU',
    causeKo: '카메라 내부 펌웨어 이미지가 손상(Corrupted)되었을 가능성이 높음',
    solutionKo:
      'See3CAM_DFU 펌웨어 업데이터 애플리케이션을 실행하여 공식 펌웨어(.img)를 재플래싱하십시오. 해결되지 않으면 support@e-consystems.com으로 문의합니다.',
    relatedPdfId: 'dfu-manual',
    relatedPage: 15,
  },
  {
    id: 'ts-yellow-blink-corrupt',
    symptomKo: '스트리밍 중 황색(Yellow) LED가 간헐적/빈번하게 깜빡이며 화면 깨짐(Frame Corruption) 발생',
    ledState: '황색(Yellow) 불규칙 점멸',
    osScope: '공통',
    causeKo: '단일 USB 호스트 컨트롤러에 다중 카메라를 연결했거나 임베디드 보드의 USB 호스트 대역폭 한계 도달',
    solutionKo:
      '독립된 USB 3.2 호스트 컨트롤러 포트에 분산 연결하거나, UYVY에서는 낮은 프레임레이트로 변경하고 MJPEG에서는 Q-Factor 값을 낮추거나 De-Noise 값을 높여 프레임 크기를 줄이십시오.',
    relatedPdfId: 'getting-started',
    relatedPage: 14,
  },
  {
    id: 'ts-preview-white',
    symptomKo: 'e-CAMView 또는 QtCAM에서 장치를 선택했으나 프리뷰 창이 하얗게(White) 표시됨',
    ledState: '황색 또는 적색',
    osScope: '공통',
    causeKo: '구버전 e-CAMView(v1.0.66.9 미만) 또는 구버전 QtCAM 소프트웨어 사용, 혹은 MJPEG 코덱 미설치',
    solutionKo:
      'Developer Resources에서 최신 버전의 e-CAMView 또는 QtCAM을 재설치하십시오. Windows MJPEG 스트리밍 시 설치 폴더 내 MainConcept-MJPEG 코덱 설치 여부도 확인하십시오.',
    relatedPdfId: 'ecamview-user',
    relatedPage: 29,
  },
  {
    id: 'ts-preview-black-redyellow',
    symptomKo: '장치 선택 후 프리뷰 창이 검은색(Black)이며 LED가 적색과 황색 사이를 연속 교차 점멸함',
    ledState: '적색 ↔ 황색 연속 교차 점멸',
    osScope: '공통',
    causeKo: '카메라 센서로부터 유효한 이미지 프레임이 수신되지 않거나 Trigger 모드 대기 상태임',
    solutionKo:
      '먼저 UVC Extension에서 Stream Mode가 Trigger 모드로 설정되어 외부 펄스를 기다리고 있는지 확인(Master 모드로 변경)하고, 동일 증상 지속 시 e-con 기술지원팀에 문의하십시오.',
    relatedPdfId: 'qtcam-user',
    relatedPage: 31,
  },
  {
    id: 'ts-dfu-failed',
    symptomKo: '펌웨어 업데이트 도중 "Firmware Download Failed!" 오류 발생 및 PID_DF01_0 인식',
    ledState: 'DFU 복구 모드 진입',
    osScope: 'DFU',
    causeKo: '펌웨어 전송 중 USB 케이블 흔들림, 분리 또는 전원 불안정 발생',
    solutionKo:
      '카메라는 자동으로 e-conDFU_USB (VID_2560, PID_DF01_0) 부트로더 모드로 연결됩니다. 케이블을 안정된 포트에 연결한 채 See3CAM_DFU에서 Step 1~4 절차를 처음부터 다시 수행하면 정상 복구됩니다.',
    relatedPdfId: 'dfu-manual',
    relatedPage: 13,
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-trigger-variants',
    questionKo: 'See3CAM_24CUG의 모든 모델이 외부 하드웨어 트리거(Trigger)와 스트로브를 지원합니까?',
    questionEn: 'Does the See3CAM_24CUG device support trigger and strobe mode across all variants?',
    answerKo:
      '아닙니다. 인클로저가 없는 보드형 2종(See3CAM_24CUG_CHL_TC 및 CH_TC)만 6핀 GPIO 헤더에 접근할 수 있어 외부 하드웨어 Trigger 모드 및 Strobe 출력을 지원합니다. 박스형 인클로저 모델(See3CAM_24CUG_CHL_TC_BX)은 GPIO 헤더가 밀폐되어 Master 모드만 지원합니다.',
    category: '하드웨어/광학',
    relatedPdfId: 'getting-started',
    relatedPage: 15,
  },
  {
    id: 'faq-min-focus',
    questionKo: '기본 장착된 M12 렌즈의 최소 초점 거리(Minimum Working Distance)와 스펙은 무엇입니까?',
    questionEn: 'What is the lens used in this camera and what is the minimum distance it could focus?',
    answerKo:
      '초점거리 3.0mm, 조리개 F/2.8, 대각 화각 128.2°의 S-마운트(M12×0.5) 광각 렌즈가 장착되어 있으며, 카메라와 피사체 간 최소 초점 작동 거리는 10 cm입니다.',
    category: '하드웨어/광학',
    relatedPdfId: 'qtcam-user',
    relatedPage: 32,
  },
  {
    id: 'faq-fps-drop-uyvy',
    questionKo: 'UYVY 포맷에서 프레임레이트(FPS)가 일정하지 않고 15fps 수준까지 떨어집니다. 어떻게 고정합니까?',
    questionEn: 'The frame rate is not consistent in UYVY format. Can I fix it?',
    answerKo:
      '자동 노출(Auto Exposure) 모드에서는 저조도 확보를 위해 노출 시간을 최대 66.66ms까지 허용하므로 프레임레이트가 15fps까지 하락할 수 있습니다. 일정한 고속 FPS가 필요하면 UVC Extension의 Exposure Compensation(노출 보정 상한값)을 줄이거나 수동 노출(Manual Exposure) 모드로 전환하십시오.',
    category: '스트리밍/성능',
    relatedPdfId: 'ecamview-user',
    relatedPage: 30,
  },
  {
    id: 'faq-fps-drop-mjpeg',
    questionKo: 'MJPEG 포맷에서 프레임 드랍이 발생하거나 PC마다 FPS가 다르게 나오는 이유는 무엇입니까?',
    questionEn: 'The frame rate is not consistent in MJPEG format. Can I fix it?',
    answerKo:
      '장면의 복잡도(디테일)에 따라 MJPEG 압축 프레임 용량이 커지며 PC 그래픽카드/CPU의 디코딩 렌더링 성능 영향을 받습니다. UVC Extension 메뉴에서 Q-Factor 값을 낮추거나 De-Noise 값을 높이면 프레임 데이터 크기가 줄어들어 FPS와 다중 카메라 안정성이 향상됩니다.',
    category: '스트리밍/성능',
    relatedPdfId: 'ecamview-user',
    relatedPage: 30,
  },
  {
    id: 'faq-heat-sink',
    questionKo: '장시간 스트리밍 시 카메라 모듈이 상당히 뜨거워집니다. 연속 사용해도 안전합니까?',
    questionEn: 'The camera is getting very hot. Is it suitable for prolonged usage?',
    answerKo:
      '정상 동작 범위 내에서는 사용 가능하지만, 보드형 모듈을 장시간 연속 운용할 경우에는 열 발산을 위해 외부 방열판(Heat Sink)을 부착하는 것을 권장합니다. (신뢰성 시험에서 +70°C 21일 연속 스트리밍 검증 완료)',
    category: '하드웨어/광학',
    relatedPdfId: 'getting-started',
    relatedPage: 16,
  },
  {
    id: 'faq-isp-sensor-reg',
    questionKo: 'ISP 레지스터나 AR0234 이미지 센서 레지스터에 직접 접근할 수 있습니까?',
    questionEn: 'Can I get access to ISP registers or image sensor registers?',
    answerKo:
      '이미지 센서 레지스터는 온보드 ISP가 직접 제어하므로 사용자 직접 접근이 불가합니다. ISP 레지스터 접근 또한 기본 제공되지 않으나, 프로젝트 요구사항에 따른 별도 펌웨어 커스터마이징을 통해 케이스별로 지원 가능합니다.',
    category: '하드웨어/광학',
    relatedPdfId: 'getting-started',
    relatedPage: 15,
  },
  {
    id: 'faq-supported-os-audio',
    questionKo: '공식 지원 운영체제(OS)와 오디오 녹음 지원 여부는 어떻게 됩니까?',
    questionEn: 'What are the supported OSes and is audio capture supported?',
    answerKo:
      'Windows 10 / 11 및 Linux Ubuntu 18.04 / 20.04 / 22.04 (64-bit)를 공식 지원하며 UVC 기본 드라이버로 즉시 동작합니다. See3CAM_24CUG 하드웨어에는 마이크가 내장되어 있지 않으며, Windows e-CAMView 녹화 시에는 PC의 별도 오디오 입력 장치를 선택해야 하고 Linux QtCAM 현 버전에서는 비디오 전용 녹화만 지원됩니다.',
    category: '소프트웨어/OS',
    relatedPdfId: 'qtcam-user',
    relatedPage: 31,
  },
  {
    id: 'faq-custom-lens-warranty',
    questionKo: '다른 화각의 커스텀 렌즈 적용(NRE)이나 제품 반품/보증 정책은 어떻게 됩니까?',
    questionEn: 'I would like to use a different lens (NRE charge) or check warranty/return policy.',
    answerKo:
      '기본 M12 홀더를 통해 타 M12 렌즈를 장착하거나 sales@e-consystems.com을 통해 NRE(비반복 엔지니어링) 기반 맞춤형 광학/펌웨어/하드웨어 제작을 요청할 수 있습니다. 평가 키트는 반품/환불이 불가하나 보증 기간 내 불량 발생 시 무상 교체(RMA)가 지원됩니다.',
    category: '지원/보증',
    relatedPdfId: 'ecamview-user',
    relatedPage: 31,
  },
];

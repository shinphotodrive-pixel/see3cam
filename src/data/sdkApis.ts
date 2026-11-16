import { SdkApiItem } from '../types/manual';

export const SDK_PREREQUISITES = {
  runtime: 'Visual Studio 2017 VC++ Redistributable Package (x86 / x64)',
  ide: 'Visual Studio 2005 이상 C/C++ 빌드 환경',
  returnConvention: '모든 API는 성공 시 TRUE (1), 실패 시 FALSE (0)를 반환합니다.',
  callOrder: 'GetDevicesCount → GetDevicePaths → InitExtensionUnit(szInstanceID) → 기능 제어 API → DeinitExtensionUnit()',
};

export const SDK_APIS: SdkApiItem[] = [
  {
    id: 'InitExtensionUnit',
    name: 'InitExtensionUnit',
    signature: 'BOOL InitExtensionUnit(TCHAR *USBInstanceID)',
    group: 'init',
    groupLabel: '장치 탐색 및 초기화',
    pdfPage: 6,
    summaryKo: '지정된 USB 장치 인스턴스 ID를 사용하여 See3CAM_24CUG Extension Unit 핸들을 초기화합니다. 다른 확장 API 호출 전에 반드시 가장 먼저 호출해야 합니다.',
    returnDesc: '초기화 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'USBInstanceID',
        type: 'TCHAR *',
        direction: 'IN',
        descriptionKo: 'GetDevicePaths()를 통해 획득한 대상 카메라의 고유 USB 장치 인스턴스 경로 문자열',
      },
    ],
    notesKo: '동일 PC에 여러 대의 See3CAM_24CUG가 연결된 경우 원하는 인덱스의 InstanceID를 전달하여 개별 초기화합니다.',
    sampleCode: `UINT32 uCount = 0;
if (GetDevicesCount(&uCount) && uCount > 0) {
    TCHAR **pszDevicePaths = new TCHAR*[uCount];
    for (UINT32 i = 0; i < uCount; i++) pszDevicePaths[i] = new TCHAR[MAX_PATH];
    if (GetDevicePaths(pszDevicePaths)) {
        BOOL bInit = InitExtensionUnit(pszDevicePaths[0]);
    }
}`,
  },
  {
    id: 'DeinitExtensionUnit',
    name: 'DeinitExtensionUnit',
    signature: 'BOOL DeinitExtensionUnit()',
    group: 'init',
    groupLabel: '장치 탐색 및 초기화',
    pdfPage: 6,
    summaryKo: '열려 있는 See3CAM_24CUG Extension Unit 리소스와 HID 핸들을 해제합니다.',
    returnDesc: '해제 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'void',
        type: 'NONE',
        direction: 'NONE',
        descriptionKo: '전달 인자 없음',
      },
    ],
    notesKo: '이 함수 호출 이후에는 InitExtensionUnit()을 다시 호출하기 전까지 다른 확장 API가 동작하지 않습니다.',
    sampleCode: `if (!DeinitExtensionUnit()) {
    printf("Extension Unit 해제 실패\\n");
}`,
  },
  {
    id: 'GetDevicesCount',
    name: 'GetDevicesCount',
    signature: 'BOOL GetDevicesCount(UINT32 *Cnt)',
    group: 'init',
    groupLabel: '장치 탐색 및 초기화',
    pdfPage: 7,
    summaryKo: '현재 호스트 PC에 연결된 See3CAM_24CUG 카메라의 총 개수를 조회합니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'Cnt',
        type: 'UINT32 *',
        direction: 'OUT',
        descriptionKo: '연결된 See3CAM_24CUG 디바이스 대수가 저장될 포인터 변수',
      },
    ],
    sampleCode: `UINT32 uDeviceCount = 0;
if (GetDevicesCount(&uDeviceCount)) {
    printf("감지된 See3CAM_24CUG 대수: %u\\n", uDeviceCount);
}`,
  },
  {
    id: 'GetDevicePaths',
    name: 'GetDevicePaths',
    signature: 'BOOL GetDevicePaths(TCHAR **DevicePaths)',
    group: 'init',
    groupLabel: '장치 탐색 및 초기화',
    pdfPage: 8,
    summaryKo: '호스트에 연결된 모든 See3CAM_24CUG 장치의 USB 인스턴스 경로(szInstanceID) 목록을 가져옵니다.',
    returnDesc: '경로 목록 획득 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'DevicePaths',
        type: 'TCHAR **',
        direction: 'OUT',
        descriptionKo: '각 장치별 MAX_PATH 버퍼 배열에 USB Instance ID 문자열을 기록',
      },
    ],
    sampleCode: `TCHAR **pPaths = new TCHAR*[uDeviceCount];
for (UINT32 i = 0; i < uDeviceCount; i++) pPaths[i] = new TCHAR[MAX_PATH];
if (GetDevicePaths(pPaths)) {
    _tprintf(_T("Device[0] Path: %s\\n"), pPaths[0]);
}`,
  },
  {
    id: 'GetDeviceName',
    name: 'GetDeviceName',
    signature: 'BOOL GetDeviceName(TCHAR *Name)',
    group: 'init',
    groupLabel: '장치 탐색 및 초기화',
    pdfPage: 8,
    summaryKo: '현재 초기화된 연결 디바이스의 장치 이름(Friendly Name) 문자열을 반환합니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'Name',
        type: 'TCHAR *',
        direction: 'OUT',
        descriptionKo: '장치 이름(예: See3CAM_24CUG)이 저장될 MAX_PATH 크기 이상의 문자 버퍼',
      },
    ],
    sampleCode: `TCHAR szDeviceName[MAX_PATH] = { 0 };
if (GetDeviceName(szDeviceName)) {
    _tprintf(_T("연결된 장치명: %s\\n"), szDeviceName);
}`,
  },
  {
    id: 'ReadFirmwareVersion',
    name: 'ReadFirmwareVersion',
    signature: 'BOOL ReadFirmwareVersion(UINT8 *pMajorVersion, UINT8 *pMinorVersion1, UINT16 *pMinorVersion2, UINT16 *pMinorVersion3)',
    group: 'init',
    groupLabel: '장치 탐색 및 초기화',
    pdfPage: 9,
    summaryKo: '카메라 내부에 플래싱된 4자리 펌웨어 버전(Major.Minor1.Minor2.Minor3)을 읽어옵니다.',
    returnDesc: '펌웨어 버전 조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      { name: 'pMajorVersion', type: 'UINT8 *', direction: 'OUT', descriptionKo: '주 버전 번호 (예: 1)' },
      { name: 'pMinorVersion1', type: 'UINT8 *', direction: 'OUT', descriptionKo: '부 버전 1 (예: 17)' },
      { name: 'pMinorVersion2', type: 'UINT16 *', direction: 'OUT', descriptionKo: '부 버전 2 / SDK 호환 번호 (예: 122)' },
      { name: 'pMinorVersion3', type: 'UINT16 *', direction: 'OUT', descriptionKo: '부 버전 3 / 빌드 리비전 (예: 232)' },
    ],
    sampleCode: `UINT8 uMajor = 0, uMinor1 = 0;
UINT16 uMinor2 = 0, uMinor3 = 0;
if (ReadFirmwareVersion(&uMajor, &uMinor1, &uMinor2, &uMinor3)) {
    printf("Firmware Version: %u.%u.%u.%u\\n", uMajor, uMinor1, uMinor2, uMinor3);
}`,
  },
  {
    id: 'GetCameraUniqueID',
    name: 'GetCameraUniqueID',
    signature: 'BOOL GetCameraUniqueID(TCHAR *szUniqueID)',
    group: 'init',
    groupLabel: '장치 탐색 및 초기화',
    pdfPage: 10,
    summaryKo: '각 See3CAM_24CUG 하드웨어에 부여된 고유 시리얼 식별자(Unique ID)를 읽어옵니다.',
    returnDesc: '고유 ID 읽기 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'szUniqueID',
        type: 'TCHAR *',
        direction: 'OUT',
        descriptionKo: '카메라 고유 시리얼 문자열을 저장할 TCHAR 버퍼 (최소 50자 이상 권장)',
      },
    ],
    notesKo: '멀티 카메라 비전 장비에서 포트 위치가 바뀌어도 물리적 좌/우 카메라를 고정 식별할 때 유용합니다.',
    sampleCode: `TCHAR szUniqueID[50] = { 0 };
if (GetCameraUniqueID(szUniqueID)) {
    _tprintf(_T("Camera Unique ID: %s\\n"), szUniqueID);
}`,
  },
  {
    id: 'GetSpecialEffects24CUG',
    name: 'GetSpecialEffects24CUG',
    signature: 'BOOL GetSpecialEffects24CUG(UINT8 *uEffectsMode)',
    group: 'image',
    groupLabel: '영상 처리 및 화질 제어',
    pdfPage: 10,
    summaryKo: '카메라 ISP에 현재 적용된 특수 효과(Special Effects) 모드 값을 조회합니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uEffectsMode',
        type: 'UINT8 *',
        direction: 'OUT',
        descriptionKo: '현재 특수 효과 상수값 반환 포인터',
      },
    ],
    constants: [
      { hex: '0x01', label: 'EFFECT_NORMAL', descriptionKo: '일반 컬러 영상 모드 (기본값)' },
      { hex: '0x04', label: 'EFFECT_BLACK_WHITE', descriptionKo: '이진화 흑백(임계값 기반 Black & White) 모드' },
      { hex: '0x07', label: 'EFFECT_GREYSCALE', descriptionKo: '8비트 그레이스케일(명암) 모드' },
      { hex: '0x08', label: 'EFFECT_NEGATIVE', descriptionKo: '색상 반전(네거티브) 모드' },
      { hex: '0x10', label: 'EFFECT_SKETCH', descriptionKo: '윤곽선 검출 스케치(Edge Detection) 모드' },
    ],
    sampleCode: `UINT8 uEffect = 0;
if (GetSpecialEffects24CUG(&uEffect)) {
    printf("현재 특수 효과 코드: 0x%02X\\n", uEffect);
}`,
  },
  {
    id: 'SetSpecialEffects24CUG',
    name: 'SetSpecialEffects24CUG',
    signature: 'BOOL SetSpecialEffects24CUG(UINT8 uEffectsMode)',
    group: 'image',
    groupLabel: '영상 처리 및 화질 제어',
    pdfPage: 11,
    summaryKo: '카메라 ISP 출력에 특수 효과(Normal, 흑백, 그레이스케일, 반전, 스케치)를 설정합니다.',
    returnDesc: '설정 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uEffectsMode',
        type: 'UINT8',
        direction: 'IN',
        descriptionKo: '적용할 특수 효과 상수 (0x01, 0x04, 0x07, 0x08, 0x10)',
      },
    ],
    constants: [
      { hex: '0x01', label: 'Normal', descriptionKo: '기본 컬러 출력' },
      { hex: '0x04', label: 'Black & White', descriptionKo: '흑백 이진화' },
      { hex: '0x07', label: 'Grayscale', descriptionKo: '그레이스케일 (얼굴 인식 호환)' },
      { hex: '0x08', label: 'Negative', descriptionKo: '네거티브 반전' },
      { hex: '0x10', label: 'Sketch', descriptionKo: '스케치 엣지 효과' },
    ],
    notesKo: '얼굴 인식(Face Detection)은 Normal(0x01) 및 Grayscale(0x07) 모드에서만 동작합니다.',
    sampleCode: `// 그레이스케일 모드 적용
if (SetSpecialEffects24CUG(0x07)) {
    printf("그레이스케일 모드로 전환되었습니다.\\n");
}`,
  },
  {
    id: 'GetDenoiseValue24CUG',
    name: 'GetDenoiseValue24CUG',
    signature: 'BOOL GetDenoiseValue24CUG(UINT8 *uDenoiseValue)',
    group: 'image',
    groupLabel: '영상 처리 및 화질 제어',
    pdfPage: 12,
    summaryKo: '현재 설정된 ISP 노이즈 제거(De-Noise) 강도 값을 읽어옵니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uDenoiseValue',
        type: 'UINT8 *',
        direction: 'OUT',
        descriptionKo: '현재 디노이즈 설정값 (0x00 ~ 0x0F / 0 ~ 15)',
      },
    ],
    sampleCode: `UINT8 uDenoise = 0;
if (GetDenoiseValue24CUG(&uDenoise)) {
    printf("현재 De-Noise 레벨: %u (0~15)\\n", uDenoise);
}`,
  },
  {
    id: 'SetDenoiseValue24CUG',
    name: 'SetDenoiseValue24CUG',
    signature: 'BOOL SetDenoiseValue24CUG(UINT8 uDenoiseValue)',
    group: 'image',
    groupLabel: '영상 처리 및 화질 제어',
    pdfPage: 12,
    summaryKo: '영상 노이즈 제거(De-Noise) 강도를 0x00(0)에서 0x0F(15) 사이로 설정합니다.',
    returnDesc: '설정 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uDenoiseValue',
        type: 'UINT8',
        direction: 'IN',
        descriptionKo: '디노이즈 레벨 (0x00 = 최소/해제 ~ 0x0F = 최대 노이즈 억제)',
      },
    ],
    notesKo: 'MJPEG 스트리밍 시 De-Noise 값을 높이면 고주파 노이즈가 줄어 프레임 압축 크기가 작아지고 대역폭 안정성이 개선됩니다.',
    sampleCode: `// 중간 강도 디노이즈(8) 설정
if (SetDenoiseValue24CUG(0x08)) {
    printf("De-Noise 레벨 8 적용 완료\\n");
}`,
  },
  {
    id: 'GetQFactor24CUG',
    name: 'GetQFactor24CUG',
    signature: 'BOOL GetQFactor24CUG(UINT8 *uQFactorValue)',
    group: 'image',
    groupLabel: '영상 처리 및 화질 제어',
    pdfPage: 14,
    summaryKo: 'MJPEG 압축 시 적용되는 양자화 품질 계수(Q-Factor) 현재 값을 조회합니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uQFactorValue',
        type: 'UINT8 *',
        direction: 'OUT',
        descriptionKo: '현재 MJPEG Q-Factor 값 (10 ~ 96)',
      },
    ],
    notesKo: '초기 기본값은 USB 3.2 연결 시 96, USB 2.0 연결 시 84입니다.',
    sampleCode: `UINT8 uQFactor = 0;
if (GetQFactor24CUG(&uQFactor)) {
    printf("현재 MJPEG Q-Factor: %u\\n", uQFactor);
}`,
  },
  {
    id: 'SetQFactor24CUG',
    name: 'SetQFactor24CUG',
    signature: 'BOOL SetQFactor24CUG(UINT8 uQFactorValue)',
    group: 'image',
    groupLabel: '영상 처리 및 화질 제어',
    pdfPage: 15,
    summaryKo: 'MJPEG 스트리밍 및 스틸 캡처의 압축 품질 계수(Q-Factor, 10~96)를 설정합니다.',
    returnDesc: '설정 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uQFactorValue',
        type: 'UINT8',
        direction: 'IN',
        descriptionKo: '양자화 계수 (10 = 고압축/저용량 ~ 96 = 최고 화질/고용량)',
      },
    ],
    notesKo: '다중 카메라 연결이나 저사양 임베디드 보드에서 MJPEG 프레임 드랍 발생 시 값을 60~75 수준으로 낮추면 효과적입니다.',
    sampleCode: `// USB 대역폭 절약을 위해 Q-Factor를 75로 설정
if (SetQFactor24CUG(75)) {
    printf("Q-Factor 75 설정 완료\\n");
}`,
  },
  {
    id: 'GetFlipMode24CUG',
    name: 'GetFlipMode24CUG',
    signature: 'BOOL GetFlipMode24CUG(UINT8 *uFlipMode)',
    group: 'image',
    groupLabel: '영상 처리 및 화질 제어',
    pdfPage: 16,
    summaryKo: '현재 설정된 하드웨어 영상 반전(수평/수직 Flip) 상태를 조회합니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uFlipMode',
        type: 'UINT8 *',
        direction: 'OUT',
        descriptionKo: '현재 플립 상태 비트값 (0x00 ~ 0x03)',
      },
    ],
    constants: [
      { hex: '0x00', label: 'FLIP_DISABLE', descriptionKo: '반전 해제 (정방향 원본)' },
      { hex: '0x01', label: 'FLIP_HORIZONTAL', descriptionKo: '좌우 수평 미러 반전' },
      { hex: '0x02', label: 'FLIP_VERTICAL', descriptionKo: '상하 수직 반전' },
      { hex: '0x03', label: 'FLIP_BOTH', descriptionKo: '수평 + 수직 동시 반전 (180° 회전 효과)' },
    ],
    sampleCode: `UINT8 uFlip = 0;
if (GetFlipMode24CUG(&uFlip)) {
    printf("Flip Mode: 0x%02X\\n", uFlip);
}`,
  },
  {
    id: 'SetFlipMode24CUG',
    name: 'SetFlipMode24CUG',
    signature: 'BOOL SetFlipMode24CUG(UINT8 iFlipMode)',
    group: 'image',
    groupLabel: '영상 처리 및 화질 제어',
    pdfPage: 17,
    summaryKo: '카메라 장착 방향(상하 역방향 마운팅 등)에 맞춰 영상을 수평/수직 반전합니다.',
    returnDesc: '설정 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'iFlipMode',
        type: 'UINT8',
        direction: 'IN',
        descriptionKo: '0x00(해제), 0x01(수평), 0x02(수직), 0x03(180° 양방향 반전)',
      },
    ],
    sampleCode: `// 카메라가 거꾸로 장착된 경우 180도 회전(0x03) 적용
if (SetFlipMode24CUG(0x03)) {
    printf("180도 양방향 반전(Flip Both) 적용 완료\\n");
}`,
  },
  {
    id: 'GetExpRoiMode24CUG',
    name: 'GetExpRoiMode24CUG',
    signature: 'BOOL GetExpRoiMode24CUG(UINT8 *uExpRoiMode, UINT8 *uXPos, UINT8 *uYPos, UINT8 *uWinSize)',
    group: 'exposure',
    groupLabel: '노출 · ROI · 프레임레이트',
    pdfPage: 13,
    summaryKo: '자동 노출 관심 영역(Auto Exposure ROI) 모드와 중심 좌표(X, Y), 윈도우 크기를 조회합니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      { name: 'uExpRoiMode', type: 'UINT8 *', direction: 'OUT', descriptionKo: '0x01: Full ROI, 0x02: Manual ROI, 0x03: Disabled(수동 노출 중)' },
      { name: 'uXPos', type: 'UINT8 *', direction: 'OUT', descriptionKo: '현재 ROI X 정규화 좌표 (0x00 ~ 0xFF)' },
      { name: 'uYPos', type: 'UINT8 *', direction: 'OUT', descriptionKo: '현재 ROI Y 정규화 좌표 (0x00 ~ 0xFF)' },
      { name: 'uWinSize', type: 'UINT8 *', direction: 'OUT', descriptionKo: '윈도우 크기 단계 (1 ~ 8, 8은 전체 영역)' },
    ],
    constants: [
      { hex: '0x01', label: 'FULL_ROI', descriptionKo: '전체 프레임 평균 기반 자동 노출' },
      { hex: '0x02', label: 'MANUAL_ROI', descriptionKo: '사용자 지정 좌표 및 윈도우 크기 기반 부분 자동 노출' },
      { hex: '0x03', label: 'ROI_DISABLED', descriptionKo: '수동 노출(Manual Exposure) 상태여서 AE ROI 비활성화됨' },
    ],
    sampleCode: `UINT8 uMode = 0, uX = 0, uY = 0, uWin = 0;
if (GetExpRoiMode24CUG(&uMode, &uX, &uY, &uWin)) {
    printf("AE ROI Mode=%u, Pos=(%u,%u), WinSize=%u\\n", uMode, uX, uY, uWin);
}`,
  },
  {
    id: 'SetExpRoiMode24CUG',
    name: 'SetExpRoiMode24CUG',
    signature: 'BOOL SetExpRoiMode24CUG(UINT8 uExpRoiMode, UINT8 uXPos, UINT8 uYPos, UINT8 uWinSize)',
    group: 'exposure',
    groupLabel: '노출 · ROI · 프레임레이트',
    pdfPage: 14,
    summaryKo: '자동 노출(Auto Exposure)이 참조할 관심 영역(Full 또는 Manual 좌표/크기)을 설정합니다.',
    returnDesc: '설정 성공 시 TRUE, 실패 시 FALSE',
    params: [
      { name: 'uExpRoiMode', type: 'UINT8', direction: 'IN', descriptionKo: '0x01 (Full ROI) 또는 0x02 (Manual ROI)' },
      { name: 'uXPos', type: 'UINT8', direction: 'IN', descriptionKo: 'ROI 중심 X 위치 (0x00 ~ 0xFF로 해상도를 정규화한 값)' },
      { name: 'uYPos', type: 'UINT8', direction: 'IN', descriptionKo: 'ROI 중심 Y 위치 (0x00 ~ 0xFF로 해상도를 정규화한 값)' },
      { name: 'uWinSize', type: 'UINT8', direction: 'IN', descriptionKo: 'ROI 윈도우 크기 (1=1/8 크기 ~ 8=전체 크기, Manual일 때 유효)' },
    ],
    notesKo: '표준 UVC 노출이 Auto Exposure로 활성화된 상태에서만 동작합니다.',
    sampleCode: `// 화면 정중앙(128, 128)에 3/8 크기(WinSize=3)로 수동 AE ROI 지정
if (SetExpRoiMode24CUG(0x02, 128, 128, 3)) {
    printf("중앙 집중 Manual AE ROI 설정 완료\\n");
}`,
  },
  {
    id: 'GetExposureCompensation24CUG',
    name: 'GetExposureCompensation24CUG',
    signature: 'BOOL GetExposureCompensation24CUG(UINT32 *iExposureValue)',
    group: 'exposure',
    groupLabel: '노출 · ROI · 프레임레이트',
    pdfPage: 19,
    summaryKo: '자동 노출(AE) 모드에서 허용하는 노출 보정 시간(마이크로초 단위)을 읽어옵니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'iExposureValue',
        type: 'UINT32 *',
        direction: 'OUT',
        descriptionKo: '현재 노출 보정 시간 (50 ~ 1,000,000 µs, 기본값 보통 66,666 µs)',
      },
    ],
    sampleCode: `UINT32 uExpCompUs = 0;
if (GetExposureCompensation24CUG(&uExpCompUs)) {
    printf("현재 AE 노출 보정값: %u us\\n", uExpCompUs);
}`,
  },
  {
    id: 'SetExposureCompensation24CUG',
    name: 'SetExposureCompensation24CUG',
    signature: 'BOOL SetExposureCompensation24CUG(UINT32 iExposureValue)',
    group: 'exposure',
    groupLabel: '노출 · ROI · 프레임레이트',
    pdfPage: 20,
    summaryKo: '자동 노출(AE) 동작 시 목표 노출 보정 시간(50 µs ~ 1,000,000 µs)을 설정합니다.',
    returnDesc: '설정 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'iExposureValue',
        type: 'UINT32',
        direction: 'IN',
        descriptionKo: '마이크로초(µs) 단위의 노출 보정값 (50 ~ 1000000)',
      },
    ],
    notesKo: '저조도에서 AE로 인해 FPS가 떨어지는 것을 막으려면 8333 µs(120fps 주기) 또는 16666 µs(60fps 주기) 이하로 낮추십시오.',
    sampleCode: `// 120fps 유지를 위해 AE 노출 상한 보정값을 8000us(8ms)로 제한
if (SetExposureCompensation24CUG(8000)) {
    printf("AE Exposure Compensation 8000us 적용 완료\\n");
}`,
  },
  {
    id: 'GetFrameRateValue24CUG',
    name: 'GetFrameRateValue24CUG',
    signature: 'BOOL GetFrameRateValue24CUG(UINT8 *uFrameRate)',
    group: 'exposure',
    groupLabel: '노출 · ROI · 프레임레이트',
    pdfPage: 20,
    summaryKo: '현재 프레임레이트 제어(Frame Rate Control) 설정값(1~120 fps)을 읽어옵니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uFrameRate',
        type: 'UINT8 *',
        direction: 'OUT',
        descriptionKo: '현재 제한/설정된 초당 프레임 수 (1 ~ 120 fps)',
      },
    ],
    sampleCode: `UINT8 uFps = 0;
if (GetFrameRateValue24CUG(&uFps)) {
    printf("설정된 목표 FPS: %u fps\\n", uFps);
}`,
  },
  {
    id: 'SetFrameRateValue24CUG',
    name: 'SetFrameRateValue24CUG',
    signature: 'BOOL SetFrameRateValue24CUG(UINT8 uFrameRate)',
    group: 'exposure',
    groupLabel: '노출 · ROI · 프레임레이트',
    pdfPage: 21,
    summaryKo: '스트리밍 출력 프레임레이트를 1 ~ 120 fps 범위에서 미세 제한합니다.',
    returnDesc: '설정 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uFrameRate',
        type: 'UINT8',
        direction: 'IN',
        descriptionKo: '설정할 프레임레이트 (1 ~ 120). 현재 해상도 기본 최대 FPS를 초과하는 값은 무시됩니다.',
      },
    ],
    notesKo: '수동 노출 시간이 긴 경우 실제 FPS는 노출 시간에 의해 먼저 제한될 수 있습니다.',
    sampleCode: `// 호스트 CPU 부하 감소를 위해 30fps로 제한
if (SetFrameRateValue24CUG(30)) {
    printf("프레임레이트 30fps 설정 완료\\n");
}`,
  },
  {
    id: 'GetAntiFlickerMode24CUG',
    name: 'GetAntiFlickerMode24CUG',
    signature: 'BOOL GetAntiFlickerMode24CUG(UINT8 *uMode)',
    group: 'exposure',
    groupLabel: '노출 · ROI · 프레임레이트',
    pdfPage: 22,
    summaryKo: '실내 교류(AC) 조명 플리커 억제(Anti-Flicker) 현재 모드를 읽어옵니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uMode',
        type: 'UINT8 *',
        direction: 'OUT',
        descriptionKo: '0: Auto, 1: 50 Hz, 2: 60 Hz, 3: Disable(해제)',
      },
    ],
    constants: [
      { hex: '0x00', label: 'AF_AUTO', descriptionKo: '주파수 자동 감지 억제' },
      { hex: '0x01', label: 'AF_50HZ', descriptionKo: '50 Hz 전원 지역 조명 플리커 제거' },
      { hex: '0x02', label: 'AF_60HZ', descriptionKo: '60 Hz 전원 지역(한국/미국 등) 조명 플리커 제거' },
      { hex: '0x03', label: 'AF_DISABLE', descriptionKo: '안티 플리커 비활성화' },
    ],
    sampleCode: `UINT8 uFlicker = 0;
if (GetAntiFlickerMode24CUG(&uFlicker)) {
    printf("Anti-Flicker Mode: %u\\n", uFlicker);
}`,
  },
  {
    id: 'SetAntiFlickerMode24CUG',
    name: 'SetAntiFlickerMode24CUG',
    signature: 'BOOL SetAntiFlickerMode24CUG(UINT8 uMode)',
    group: 'exposure',
    groupLabel: '노출 · ROI · 프레임레이트',
    pdfPage: 23,
    summaryKo: '한국(60Hz) 등 실내 형광등/LED 조명 환경에 맞춰 안티 플리커 주파수 모드를 설정합니다.',
    returnDesc: '설정 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uMode',
        type: 'UINT8',
        direction: 'IN',
        descriptionKo: '0(Auto), 1(50Hz), 2(60Hz), 3(Disable)',
      },
    ],
    sampleCode: `// 국내 60Hz 상용 전원 조명 환경 설정
if (SetAntiFlickerMode24CUG(2)) {
    printf("60Hz 안티 플리커 설정 완료\\n");
}`,
  },
  {
    id: 'GetStreamMode24CUG',
    name: 'GetStreamMode24CUG',
    signature: 'BOOL GetStreamMode24CUG(UINT8 *iStreamMode, UINT8 *iAutoFunctionsLockStatus)',
    group: 'trigger',
    groupLabel: '트리거 · 스트로브 동기화',
    pdfPage: 23,
    summaryKo: '현재 스트리밍 동작 모드(Master / 외부 Trigger) 및 자동 기능 잠금(Auto Functions Lock) 상태를 조회합니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      { name: 'iStreamMode', type: 'UINT8 *', direction: 'OUT', descriptionKo: '0x00: Master 모드 (연속 스트리밍), 0x01: 외부 하드웨어 Trigger 모드' },
      { name: 'iAutoFunctionsLockStatus', type: 'UINT8 *', direction: 'OUT', descriptionKo: '0x00: 잠금 해제, 0x01: AE/AWB 등 자동 기능 현재값 고정(Lock)' },
    ],
    sampleCode: `UINT8 uStreamMode = 0, uAflLock = 0;
if (GetStreamMode24CUG(&uStreamMode, &uAflLock)) {
    printf("StreamMode=%u, AutoLock=%u\\n", uStreamMode, uAflLock);
}`,
  },
  {
    id: 'SetStreamMode24CUG',
    name: 'SetStreamMode24CUG',
    signature: 'BOOL SetStreamMode24CUG(UINT8 iStreamMode, UINT8 iAutoFunctionsLockStatus)',
    group: 'trigger',
    groupLabel: '트리거 · 스트로브 동기화',
    pdfPage: 24,
    summaryKo: '카메라를 연속 스트리밍(Master) 또는 외부 GPIO Pin 4 펄스 동기화 캡처(Trigger) 모드로 전환합니다.',
    returnDesc: '설정 성공 시 TRUE, 실패 시 FALSE',
    params: [
      { name: 'iStreamMode', type: 'UINT8', direction: 'IN', descriptionKo: '0x00 = Master 모드, 0x01 = 외부 하드웨어 Trigger 모드' },
      { name: 'iAutoFunctionsLockStatus', type: 'UINT8', direction: 'IN', descriptionKo: '0x00 = Auto 기능 유지, 0x01 = 현재 AE/AWB 수렴값 고정(Lock)' },
    ],
    constants: [
      { hex: '0x00', label: 'STREAM_MASTER', descriptionKo: '자체 클럭 연속 프리뷰/스트리밍 모드' },
      { hex: '0x01', label: 'STREAM_TRIGGER', descriptionKo: 'CN6 Pin 4 (TRIG, VIH 1.17V~5V) 펄스 인가 시에만 프레임 출력 (보드형 전용)' },
    ],
    notesKo: '인클로저 박스형(See3CAM_24CUG_CHL_TC_BX)은 외부 GPIO 핀이 밀폐되어 있으므로 Trigger 모드 전환 시 영상이 멈추게 됩니다(Master 전용).',
    sampleCode: `// 외부 하드웨어 트리거 모드 활성화 + AE/AWB 값 고정(Lock)
if (SetStreamMode24CUG(0x01, 0x01)) {
    printf("외부 하드웨어 Trigger 모드 전환 완료 (Pin 4 펄스 대기)\\n");
}`,
  },
  {
    id: 'GetStrobeMode24CUG',
    name: 'GetStrobeMode24CUG',
    signature: 'BOOL GetStrobeMode24CUG(UINT8 *uStrobeMode)',
    group: 'trigger',
    groupLabel: '트리거 · 스트로브 동기화',
    pdfPage: 21,
    summaryKo: '6핀 GPIO 헤더 Pin 5 (STROBE)의 플래시 노광 동기화 출력 활성화 여부를 조회합니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uStrobeMode',
        type: 'UINT8 *',
        direction: 'OUT',
        descriptionKo: '0x00: Strobe OFF, 0x01: Strobe Flash Output ON',
      },
    ],
    sampleCode: `UINT8 uStrobe = 0;
if (GetStrobeMode24CUG(&uStrobe)) {
    printf("Strobe 상태: %s\\n", uStrobe ? "ON" : "OFF");
}`,
  },
  {
    id: 'SetStrobeMode24CUG',
    name: 'SetStrobeMode24CUG',
    signature: 'BOOL SetStrobeMode24CUG(UINT8 uStrobeValue)',
    group: 'trigger',
    groupLabel: '트리거 · 스트로브 동기화',
    pdfPage: 22,
    summaryKo: '글로벌 셔터 노광(Integration) 구간에 맞춘 Pin 5 오픈 드레인 스트로브 신호 출력을 켜거나 끕니다.',
    returnDesc: '설정 성공 시 TRUE, 실패 시 FALSE',
    params: [
      {
        name: 'uStrobeValue',
        type: 'UINT8',
        direction: 'IN',
        descriptionKo: '0x00 = OFF (비활성화), 0x01 = ON (노광 동기화 플래시 신호 출력)',
      },
    ],
    notesKo: 'Pin 5는 오픈 드레인(Open Drain) 출력이므로 외부 전원(1.8V~5V)에 약 4.7 kΩ 풀업 저항을 연결해야 합니다.',
    sampleCode: `// 외부 LED 조명 동기화용 Strobe 출력 활성화
if (SetStrobeMode24CUG(0x01)) {
    printf("Pin 5 Strobe 동기 출력 활성화 완료\\n");
}`,
  },
  {
    id: 'GetFaceDetectionRect24CUG',
    name: 'GetFaceDetectionRect24CUG',
    signature: 'BOOL GetFaceDetectionRect24CUG(UINT8 *uState, UINT8 *uEmbedDataState, UINT8 *uOverlayRectState)',
    group: 'face-system',
    groupLabel: '얼굴 인식 및 시스템 복원',
    pdfPage: 18,
    summaryKo: '온보드 얼굴 인식(Face Detection) 활성화 여부, 164바이트 좌표 패킷 삽입(Embed Data), 화면 사각형 오버레이 상태를 읽어옵니다.',
    returnDesc: '조회 성공 시 TRUE, 실패 시 FALSE',
    params: [
      { name: 'uState', type: 'UINT8 *', direction: 'OUT', descriptionKo: '0x00: 얼굴 인식 비활성화, 0x01: 활성화' },
      { name: 'uEmbedDataState', type: 'UINT8 *', direction: 'OUT', descriptionKo: '0x00: 해제, 0x01: 프레임 끝 164바이트에 얼굴 좌표 구조체 삽입' },
      { name: 'uOverlayRectState', type: 'UINT8 *', direction: 'OUT', descriptionKo: '0x00: 해제, 0x01: 감지된 얼굴 위치에 사각형 박스 오버레이 렌더링' },
    ],
    sampleCode: `UINT8 uFace = 0, uEmbed = 0, uOverlay = 0;
if (GetFaceDetectionRect24CUG(&uFace, &uEmbed, &uOverlay)) {
    printf("Face=%u, Embed164B=%u, Overlay=%u\\n", uFace, uEmbed, uOverlay);
}`,
  },
  {
    id: 'SetFaceDetectionRect24CUG',
    name: 'SetFaceDetectionRect24CUG',
    signature: 'BOOL SetFaceDetectionRect24CUG(UINT8 uState, UINT8 uEmbedDataState, UINT8 uOverlayRectState)',
    group: 'face-system',
    groupLabel: '얼굴 인식 및 시스템 복원',
    pdfPage: 18,
    summaryKo: '온보드 얼굴 인식과 164바이트 좌표 임베딩(SOSS 0xFFBC ~ EOSS 0xFFBD, 최대 16명) 및 박스 오버레이를 제어합니다.',
    returnDesc: '설정 성공 시 TRUE, 실패 시 FALSE',
    params: [
      { name: 'uState', type: 'UINT8', direction: 'IN', descriptionKo: '0x00: 비활성화 (이 경우 나머지 두 인자는 무시됨), 0x01: 활성화' },
      { name: 'uEmbedDataState', type: 'UINT8', direction: 'IN', descriptionKo: '0x01 설정 시 프레임 마지막 164바이트를 얼굴 상태 패킷으로 치환' },
      { name: 'uOverlayRectState', type: 'UINT8', direction: 'IN', descriptionKo: '0x01 설정 시 영상에 직접 가이드 사각형 표시' },
    ],
    notesKo: '자체 비전 알고리즘에서 원본 픽셀 훼손 없이 좌표만 파싱하려면 uEmbedDataState=0x01, uOverlayRectState=0x00 조합을 권장합니다.',
    sampleCode: `// 얼굴 인식 ON + 164바이트 패킷 삽입 ON + 화면 오버레이 박스는 OFF
if (SetFaceDetectionRect24CUG(0x01, 0x01, 0x00)) {
    printf("얼굴 좌표 패킷(164B) 임베딩 모드 활성화\\n");
}`,
  },
  {
    id: 'RestoreDefault24CUG',
    name: 'RestoreDefault24CUG',
    signature: 'BOOL RestoreDefault24CUG()',
    group: 'face-system',
    groupLabel: '얼굴 인식 및 시스템 복원',
    pdfPage: 16,
    summaryKo: '모든 See3CAM_24CUG 확장 설정을 공장 초기 기본값으로 일괄 복원합니다.',
    returnDesc: '복원 성공 시 TRUE, 실패 시 FALSE',
    params: [
      { name: 'void', type: 'NONE', direction: 'NONE', descriptionKo: '전달 인자 없음' },
    ],
    notesKo: '복원 항목: Special Effect(Normal), AE ROI(Full), De-Noise(0), Q-Factor(96), Face Detection(OFF), Flip(OFF), Exposure Comp(해상도 기본값), Frame Rate(해상도 기본값).',
    sampleCode: `if (RestoreDefault24CUG()) {
    printf("모든 확장 제어 파라미터가 기본값으로 초기화되었습니다.\\n");
}`,
  },
  {
    id: 'ResetDevice',
    name: 'ResetDevice',
    signature: 'BOOL ResetDevice()',
    group: 'face-system',
    groupLabel: '얼굴 인식 및 시스템 복원',
    pdfPage: 25,
    summaryKo: '연결된 See3CAM_24CUG 카메라 디바이스를 소프트웨어적으로 하드웨어 리셋(재부팅/재열거)합니다.',
    returnDesc: '리셋 명령 전송 성공 시 TRUE, 실패 시 FALSE',
    params: [
      { name: 'void', type: 'NONE', direction: 'NONE', descriptionKo: '전달 인자 없음' },
    ],
    notesKo: '리셋 후 USB 버스에 재연결(Re-enumeration)되므로 기존 Extension Unit 핸들을 닫고 재초기화해야 합니다.',
    sampleCode: `if (ResetDevice()) {
    DeinitExtensionUnit();
    printf("장치가 재시작 중입니다. 재열거 후 다시 초기화하십시오.\\n");
}`,
  },
];

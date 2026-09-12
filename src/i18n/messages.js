import { domainMessages } from './domain-messages.js';

export const supportedLocales = ['vi', 'en', 'zh-CN'];
export const defaultLocale = 'vi';
export const localeStorageKey = 'sewage-locale';

export function normalizeLocale(locale = '') {
  const value = String(locale).toLowerCase();
  if (value.startsWith('vi')) return 'vi';
  if (value.startsWith('en')) return 'en';
  if (value.startsWith('zh')) return 'zh-CN';
  return defaultLocale;
}

const vi = {
  app: { title: 'Nền tảng song sinh số thông minh nhà máy xử lý nước thải' },
  common: {
    query: 'Tra cứu', item: 'Chỉ tiêu', inflow: 'Nước vào', outflow: 'Nước ra',
    ammonia: 'Amoni', back: 'Quay lại', pause: 'Tạm dừng', continue: 'Tiếp tục',
    intro: 'Giới thiệu', dataRecord: 'Dữ liệu ghi nhận', inspector: 'Nhân viên kiểm tra: Tiểu Vương',
    buildingLabel: 'Nhãn công trình', inspectionProgress: 'Tiến độ kiểm tra', inspectionSpeed: 'Tốc độ kiểm tra',
    mom: 'So tháng trước', yoy: 'So cùng kỳ', tons: '{value} tấn', language: 'Ngôn ngữ',
  },
  nav: { home: 'Trang chủ', history: 'Dữ liệu lịch sử', process: 'Hỗ trợ công nghệ', inspection: 'Kiểm tra' },
  dashboard: {
    power: 'Tiêu thụ điện', monthlyPower: 'Tổng điện tháng', dailyPower: 'Điện trung bình ngày', perTonPower: 'Điện trên mỗi tấn nước',
    realtimeWater: 'Dữ liệu chất lượng nước thời gian thực', todayTrend: 'Xu hướng chất lượng nước hôm nay', treatment: 'Tình hình xử lý nước thải',
    todayInflow: 'Tổng nước vào hôm nay', todayOutflow: 'Tổng nước ra hôm nay', designScale: 'Công suất thiết kế', equipmentRuntime: 'Thời gian vận hành thiết bị',
    sequence: 'STT', equipmentName: 'Tên thiết bị', continuousRun: 'Vận hành liên tục', cumulativeRun: 'Vận hành tích lũy', pumpName: 'Bơm nước vào khu vực số 1......',
    alarms: 'Thông tin cảnh báo', criticalAlarm: 'Cảnh báo nghiêm trọng', generalAlarm: 'Cảnh báo thông thường', reminderAlarm: 'Cảnh báo nhắc nhở',
    alarmTime: 'Thời gian cảnh báo', alarmLevel: 'Mức cảnh báo', alarmContent: 'Nội dung cảnh báo', realtimeThreshold: 'Giá trị / ngưỡng', effluentPh: 'pH nước ra',
    outletCOD: 'COD nước ra', inletCOD: 'COD nước vào', loadRate: 'Tỷ lệ tải',
  },
  craft: {
    aeration: 'Sục khí chính xác', dosing: 'Châm hóa chất chính xác', sludge: 'Hồi lưu bùn', equipmentName: 'Tên thiết bị',
    suggestion: 'Giá trị thuật toán đề xuất', realtime: 'Giá trị thời gian thực', simulated: 'Giá trị mô phỏng', actual: 'Giá trị thực tế',
  },
  history: { energy: 'Xu hướng tiêu thụ điện', chemical: 'Xu hướng tiêu thụ hóa chất', sludge: 'Xu hướng phát sinh bùn', flow: 'Xu hướng lưu lượng vào/ra', inflow: 'Lưu lượng vào', outflow: 'Lưu lượng ra' },
  inspection: { aerationTank: 'Bể sục khí' },
};

const en = {
  app: { title: 'Smart Wastewater Treatment Plant Digital Twin Platform' },
  common: {
    query: 'Search', item: 'Metric', inflow: 'Influent', outflow: 'Effluent', ammonia: 'Ammonia nitrogen',
    back: 'Back', pause: 'Pause', continue: 'Continue', intro: 'Introduction', dataRecord: 'Data records', inspector: 'Inspector: Xiao Wang',
    buildingLabel: 'Building label', inspectionProgress: 'Inspection progress', inspectionSpeed: 'Inspection speed', mom: 'MoM', yoy: 'YoY', tons: '{value} t', language: 'Language',
  },
  nav: { home: 'Home', history: 'Historical data', process: 'Process assist', inspection: 'Inspection' },
  dashboard: {
    power: 'Power consumption', monthlyPower: 'Monthly total power', dailyPower: 'Average daily power', perTonPower: 'Power per ton of water',
    realtimeWater: 'Real-time water quality', todayTrend: "Today's water-quality trend", treatment: 'Wastewater treatment status',
    todayInflow: "Today's cumulative influent", todayOutflow: "Today's cumulative effluent", designScale: 'Design capacity', equipmentRuntime: 'Equipment runtime',
    sequence: 'No.', equipmentName: 'Equipment', continuousRun: 'Continuous run', cumulativeRun: 'Cumulative run', pumpName: 'Influent pump station section No. 1......',
    alarms: 'Alarm information', criticalAlarm: 'Critical alarm', generalAlarm: 'General alarm', reminderAlarm: 'Reminder alarm',
    alarmTime: 'Alarm time', alarmLevel: 'Alarm level', alarmContent: 'Alarm content', realtimeThreshold: 'Value / threshold', effluentPh: 'Effluent pH',
    outletCOD: 'Effluent COD', inletCOD: 'Influent COD', loadRate: 'Load rate',
  },
  craft: {
    aeration: 'Precision aeration', dosing: 'Precision dosing', sludge: 'Sludge return', equipmentName: 'Equipment',
    suggestion: 'Algorithm recommendation', realtime: 'Real-time value', simulated: 'Simulated value', actual: 'Actual value',
  },
  history: { energy: 'Power-consumption trend', chemical: 'Chemical-consumption trend', sludge: 'Sludge-production trend', flow: 'Influent/effluent flow trend', inflow: 'Influent flow', outflow: 'Effluent flow' },
  inspection: { aerationTank: 'Aeration tank' },
};

const zh = {
  app: { title: '污水处理厂智能数字孪生平台' },
  common: {
    query: '查询', item: '项目', inflow: '进水', outflow: '出水', ammonia: '氨氮', back: '返回', pause: '暂停', continue: '继续',
    intro: '介绍', dataRecord: '数据记录', inspector: '巡检员: 小王', buildingLabel: '建筑标签', inspectionProgress: '巡检进度', inspectionSpeed: '巡检速度',
    mom: '环比', yoy: '同比', tons: '{value}吨', language: '语言',
  },
  nav: { home: '首页', history: '历史数据', process: '工艺辅助', inspection: '巡检' },
  dashboard: {
    power: '电耗情况', monthlyPower: '月度总电耗', dailyPower: '日均电耗', perTonPower: '吨水电耗', realtimeWater: '水质实时数据', todayTrend: '今日水质趋势',
    treatment: '污水处理情况', todayInflow: '今日累计进水量', todayOutflow: '今日累计出水量', designScale: '计划规模', equipmentRuntime: '设备运行时间',
    sequence: '序号', equipmentName: '设备名称', continuousRun: '持续运行', cumulativeRun: '累计运行', pumpName: '进水泵房区间1号......',
    alarms: '报警信息', criticalAlarm: '重要报警', generalAlarm: '一般报警', reminderAlarm: '提醒报警', alarmTime: '报警时间', alarmLevel: '报警等级',
    alarmContent: '报警内容', realtimeThreshold: '实时值阈值', effluentPh: '出水pH', outletCOD: '出水口COD', inletCOD: '进水口COD', loadRate: '负荷率',
  },
  craft: {
    aeration: '精确曝气', dosing: '精确加药', sludge: '污泥回流', equipmentName: '设备名称', suggestion: '算法建议值', realtime: '实时值', simulated: '模拟值', actual: '实际值',
  },
  history: { energy: '电耗趋势', chemical: '药耗趋势', sludge: '产泥趋势', flow: '进出水量趋势', inflow: '进水量', outflow: '出水量' },
  inspection: { aerationTank: '曝气池' },
};

export const messages = {
  vi: { ...vi, ...domainMessages.vi, inspection: { ...vi.inspection, ...domainMessages.vi.inspection } },
  en: { ...en, ...domainMessages.en, inspection: { ...en.inspection, ...domainMessages.en.inspection } },
  'zh-CN': { ...zh, ...domainMessages['zh-CN'], inspection: { ...zh.inspection, ...domainMessages['zh-CN'].inspection } },
};

export function resolveInitialLocale(storage, browserLocale = '') {
  const saved = storage?.getItem?.(localeStorageKey);
  if (saved) return normalizeLocale(saved);
  return normalizeLocale(browserLocale);
}

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'id' | 'en' | 'zh';

interface Translations {
  [key: string]: {
    id: string;
    en: string;
    zh: string;
  };
}

const translations: Translations = {
  // Navbar
  appName: { id: "Smart PaDe", en: "Smart PaDe", zh: "Smart PaDe" },
  appDesc: { id: "Asisten Pertanian Cerdas", en: "Smart Agricultural Assistant", zh: "智能农业助手" },

  // Hero
  heroTag: { id: "AGROTECH MASA DEPAN", en: "NEXT-GEN AGROTECH", zh: "下一代农业技术" },
  heroTitle1: { id: "Panen Melimpah", en: "Abundant Harvest", zh: "大丰收" },
  heroTitle2: { id: "dengan Teknologi AI Cerdas", en: "with Smart AI Technology", zh: "借助智能AI技术" },
  heroDesc: { 
    id: "Pantau sawah dari mana saja dan ketahui kondisi tanamanmu dengan cepat. Solusi pintar untuk petani hebat.", 
    en: "Monitor fields from anywhere and know your crop conditions quickly. A smart solution for great farmers.", 
    zh: "随时随地监控水稻田地，快速掌握作物生长状况。专为优秀农民打造的智能解决方案。" 
  },
  startAnalysis: { id: "Mulai Analisis", en: "Start Analysis", zh: "开始分析" },
  farmersCount: { id: "5,000+", en: "5,000+", zh: "5,000+" },
  farmersText: { id: "PETANI SUKSES", en: "SUCCESSFUL FARMERS", zh: "成功农民" },

  // Analysis History Modal
  historyDetailTitle: { id: "Detail Riwayat Analisis", en: "Analysis History Detail", zh: "分析历史详情" },
  closeBtn: { id: "Tutup", en: "Close", zh: "关闭" },

  // Tabs / Analysis
  deepLearningInput: { id: "Deteksi Kondisi & Perawatan (AI)", en: "Condition & Care Detection (AI)", zh: "条件及护理检测 (AI)" },
  imageTab: { id: "Foto Padi", en: "Rice Photo", zh: "水稻图像" },
  textTab: { id: "Catat Gejala Harian", en: "Daily Symptoms Note", zh: "每日症状记录" },
  clickDropDesc: { id: "Unggah Foto Padi Anda", en: "Upload Your Rice Photo", zh: "上传您的水稻照片" },
  clickDropSub: { id: "Format JPG atau PNG. Pastikan gambar jelas agar AI dapat mendeteksi dengan baik.", en: "JPG or PNG format. Ensure clear image for accurate AI detection.", zh: "JPG 或 PNG 格式。确保图像清晰以进行准确的AI检测。" },
  condDescTitle: { id: "Catatan Tambahan untuk AI", en: "Additional Notes for AI", zh: "AI附加说明" },
  condDescPlaceholder: { 
    id: "Ceritakan keluhan Anda. Contoh: 'Padi menguning setelah hujan deras, ada ulat di pangkal batang.'", 
    en: "Tell us the issue. E.g. 'Rice turned yellow after heavy rain, worms at the base.'", 
    zh: "告诉我们您的问题。例如：'大雨后水稻变黄，基部有虫子。'" 
  },
  btnAnalyzing: { id: "AI Sedang Memproses...", en: "AI is Processing...", zh: "人工智能正在处理..." },
  btnStartDL: { id: "Dapatkan Solusi dari JOSI AI", en: "Get JOSI AI Solution", zh: "获取 JOSI AI 解决方案" },

  // Results
  harvestRec: { id: "Insight Panen", en: "Harvest Insights", zh: "收获解析" },
  runningModel: { id: "Menjalankan Model...", en: "Running Model...", zh: "正在运行模型..." },
  provideInputDesc: { id: "Berikan input di panel kiri untuk menerima insight panen oleh JOSI AI.", en: "Provide input on the left panel to receive JOSI AI harvest insights.", zh: "在左侧面板中提供输入以接收 JOSI AI 收获解析。" },
  detectedStatus: { id: "Status Terdeteksi", en: "Detected Status", zh: "检测到的状态" },
  recActions: { id: "Tindakan Rekomendasi", en: "Recommended Actions", zh: "推荐的操作" },
  harvestImpact: { id: "Potensi Panen", en: "Harvest Impact", zh: "预期收获" },
  aiConfidence: { id: "Keyakinan AI", en: "AI Confidence", zh: "AI 置信度" },
  state: { id: "Kondisi", en: "Condition", zh: "状况" },
  stateSafe: { id: "Aman", en: "Safe", zh: "安全" },
  stateActionReq: { id: "Perlu Aksi", en: "Action Required", zh: "需要处理" },
  saveRecord: { id: "Simpan Rekaman", en: "Save Record", zh: "保存记录" },

  // Dashboard
  savedScans: { id: "Riwayat Analisis", en: "Analysis History", zh: "分析历史" },
  noHistory: { id: "Belum ada riwayat analisis.", en: "No analysis history yet.", zh: "暂无分析历史。" },
  conditionLab: { id: "Kondisi", en: "Condition", zh: "条件" },
  delBtn: { id: "Hapus", en: "Delete", zh: "删除" },
  cancelBtn: { id: "Batal", en: "Cancel", zh: "取消" },
  newAnalysisBtn: { id: "Analisis +", en: "Analysis +", zh: "新分析 +" },
  totScans: { id: "Total Pemindaian", en: "Total Scans", zh: "总扫描次数" },
  fieldsLabel: { id: "scan", en: "scans", zh: "次扫描" },
  ovrHealth: { id: "Status Dominan", en: "Dominant Status", zh: "主要状态" },
  safeLabel: { id: "mode aman", en: "safe mode", zh: "安全模式" },
  estYield: { id: "Rata-rata Akurasi", en: "Average Accuracy", zh: "平均准确率" },
  tHaLabel: { id: "keyakinan", en: "confidence", zh: "置信度" },
  projectedChartTitle: { id: "Akurasi Prediksi AI per Waktu (%)", en: "AI Prediction Accuracy over Time (%)", zh: "随时间变化的 AI 预测准确率 (%)" },
  langBtn: { id: "Bahasa", en: "Language", zh: "语言" },

  // IoT Dashboard
  iotTitle: { id: "IoT Monitoring & Kontrol Sawah", en: "Rice Field IoT Monitoring & Control", zh: "稻田物联网监控与控制" },
  waterLevel: { id: "Level Air", en: "Water Level", zh: "水位" },
  soilMoisture: { id: "Kelembaban Tanah", en: "Soil Moisture", zh: "土壤湿度" },
  irrigationPump: { id: "Pompa Irigasi", en: "Irrigation Pump", zh: "灌溉泵" },
  fertilizerPump: { id: "Pompa Nutrisi", en: "Nutrient Pump", zh: "营养泵" },
  tempLabel: { id: "Suhu Udara", en: "Air Temp", zh: "气温" },
  humidityLabel: { id: "Kelembaban", en: "Air Humidity", zh: "空气湿度" },
  turnOn: { id: "NYALAKAN", en: "TURN ON", zh: "开启" },
  turnOff: { id: "MATIKAN", en: "TURN OFF", zh: "关闭" },
  statusOptimal: { id: "OPTIMAL", en: "OPTIMAL", zh: "最佳" },
  statusWarning: { id: "PERINGATAN", en: "WARNING", zh: "警告" },
  pumpAOn: { id: "Pompa Irigasi DIAKTIFKAN", en: "Irrigation Pump ACTIVATED", zh: "灌溉泵已启动" },
  pumpAOff: { id: "Pompa Irigasi DIMATIKAN", en: "Irrigation Pump DEACTIVATED", zh: "灌溉泵已关闭" },
  pumpBOn: { id: "Pompa Nutrisi DIAKTIFKAN", en: "Nutrient Pump ACTIVATED", zh: "水稻养分分配已启动" },
  pumpBOff: { id: "Pompa Nutrisi DIMATIKAN", en: "Nutrient Pump DEACTIVATED", zh: "水稻养分分配已关闭" },
  pumpADescOn: { id: "Mengalirkan air irigasi ke persawahan...", en: "Flowing irrigation water to the field...", zh: "向稻田注入灌溉水..." },
  pumpADescOff: { id: "Kondisi optimal tercapai, air irigasi dihentikan otomatis.", en: "Optimal condition reached, irrigation stopped automatically.", zh: "达到最佳状态，自动停止供水。" },
  pumpBDescOn: { id: "Mendistribusikan nutrisi ke tanaman padi...", en: "Distributing nutrients to rice crops...", zh: "向农作物分配养分..." },
  pumpBDescOff: { id: "Kondisi optimal tercapai, nutrisi dihentikan otomatis.", en: "Optimal condition reached, nutrient distribution stopped automatically.", zh: "达到最佳状态，自动停止营养分配。" },

  // Help Modal
  helpTitle: { id: "Panduan Lengkap Smart PaDe", en: "Smart PaDe Complete Guide", zh: "Smart PaDe 完整指南" },
  help1Title: { id: "Deteksi AI Lanjutan", en: "Advanced AI Detection", zh: "高级 AI 检测" },
  help1Desc: { id: "Unggah foto resolusi tinggi daun atau akar. Anda juga dapat memberikan konteks tambahan lewat catatan. AI kami akan menganalisis penyakit dan memberikan rekomendasi penanganan secara akurat.", en: "Upload a high-res photo of leaves or roots with additional notes. Our AI will analyze diseases and accurately recommend treatment.", zh: "上传高分辨率的叶片或根部照片并添加额外备注。我们的 AI 将分析疾病并提供准确的治疗建议。" },
  help2Title: { id: "IoT Monitoring Real-time", en: "Real-time IoT Monitoring", zh: "实时物联网监控" },
  help2Desc: { id: "Sensor cerdas selalu merekam parameter vital meliputi: Level Air, Kelembaban Tanah, Suhu, & Kelembaban Lingkungan. Data divisualisasikan secara dinamis beserta auto-notifikasi.", en: "Smart sensors record vital parameters: Water Level, Soil Moisture, Temp, & Air Humidity. Live visualizations and auto-notifications included.", zh: "智能传感器持续记录重要参数：水位、土壤湿度、温度和环境湿度。包含动态可视化和自动通知功能。" },
  help3Title: { id: "Sistem Kontrol & Otomatisasi Pompa", en: "Pump Automation System", zh: "泵自动化和控制系统" },
  help3Desc: { id: "Smart PaDe terintegrasi dengan Pompa Irigasi dan Nutrisi. Anda bisa mengaturnya secara manual, atau biarkan sistem pintar kami mengotomatisasinya demi menjaga kondisi optimal 100%.", en: "Smart PaDe connects to Irrigation & Nutrient pumps. Control them manually, or let our smart system completely automate them for 100% optimal conditions.", zh: "Smart PaDe 连接灌溉和营养泵。手动控制它们，或让我们的智能系统完全自动运行以维持100%的最佳状态。" },
  help4Title: { id: "Analisis Trend Rekaman", en: "Scan Trend Analysis", zh: "扫描趋势分析" },
  help4Desc: { id: "Pantau grafik akurasi AI seiring waktu, ketahui rasio kondisi tanaman sehat vs sakit, serta buka detail panduan historis lengkap kapan saja.", en: "Monitor AI accuracy graphs over time, health ratios, and open detailed historical guidance entries anytime.", zh: "随时监控 AI 随时间变化的准确率图表、健康状况比例，并访问详细的历史指导条目。" },
  helpTip: { id: "Penting: Sistem otomatisasi membutuhkan koneksi yang stabil agar dapat tersinkronisasi.", en: "Important: The automation system needs a stable connection to sync.", zh: "重要：自动化系统需要稳定的连接以进行同步。" },
  helpBtn: { id: "Paham & Mengerti", en: "Understood", zh: "我明白了" },

  // Features Section
  featuresTitle1: { id: "Mengapa Memilih ", en: "Why Choose ", zh: "为什么要选择 " },
  featuresTitle2: { id: "Smart PaDe", en: "Smart PaDe", zh: "Smart PaDe" },
  featuresDesc: { id: "Solusi pintar yang menyatukan teknologi AI dan IoT dalam genggaman Anda untuk meraih panen padi yang melimpah dan bebas masalah.", en: "A smart solution combining AI and IoT technology in your hands to achieve an abundant and trouble-free rice harvest.", zh: "在您手中结合AI和IoT技术的智能解决方案，实现丰收且无故障的水稻收成。" },
  feat1Title: { id: "AI-Powered Analysis", en: "AI-Powered Analysis", zh: "人工智能支持的分析" },
  feat1Desc: { id: "Deteksi penyakit tanaman secara instan menggunakan kecerdasan buatan dari foto sawah Anda.", en: "Instantly detect crop diseases using artificial intelligence from your rice field photos.", zh: "使用人工智能从水稻田地照片中立即检测作物疾病。" },
  feat2Title: { id: "Real-time IoT Monitoring", en: "Real-time IoT Monitoring", zh: "实时物联网监控" },
  feat2Desc: { id: "Pantau suhu, kelembaban, dan level air secara langsung dengan sensor pintar di lahan pertanian Anda.", en: "Monitor temperature, humidity, and water level directly with smart sensors in your agricultural land.", zh: "在您的农业土地上直接通过智能传感器监控温度，湿度和水位。" },
  feat3Title: { id: "Automated Irrigation", en: "Automated Irrigation", zh: "自动灌溉" },
  feat3Desc: { id: "Sistem pengairan otomatis cerdas yang dapat dikontrol dari jarak jauh, menghemat air dan waktu.", en: "A smart automated irrigation system that can be remotely controlled, saving water and time.", zh: "可以远程控制的智能自动灌溉系统，节省水和时间。" },
  feat4Title: { id: "Harvest Insights", en: "Harvest Insights", zh: "收获解析" },
  feat4Desc: { id: "Analisis dampak panen dan rekomendasi perawatan harian untuk memastikan hasil panen yang optimal.", en: "Harvest impact analysis and daily care recommendations to ensure optimal crop yield.", zh: "收获影响分析和日常护理建议，以确保最佳的作物产量。" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

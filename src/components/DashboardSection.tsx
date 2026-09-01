import React, { useState, useEffect, useRef } from 'react';
import { HistoryItem } from './AnalysisSection';
import { Trash2, Tractor, Sprout, Wheat, Droplets, Thermometer, Wind, Power, AlertCircle, FileText, ImageIcon, MessageSquareText, CheckCircle2, AlertTriangle, Stethoscope, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { useIoT } from '../contexts/IoTContext';
import { AnimatePresence, motion } from 'motion/react';

const liquidStyles = `
@keyframes wave-liquid {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-wave-liquid {
  animation: wave-liquid 2s linear infinite;
}
.animate-wave-liquid-reverse {
  animation: wave-liquid 3s linear infinite reverse;
}
`;

interface DashboardProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
}

const NeumorphicCard = ({ children, className }: any) => (
  <div className={cn("bg-[#e8ecef] rounded-2xl shadow-[6px_6px_12px_#d1d5d8,-6px_-6px_12px_#ffffff] p-5 flex flex-col items-center justify-center text-center", className)}>
    {children}
  </div>
);

const NeumorphicButton = ({ active, onClick, children }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full rounded-xl py-3 font-extrabold text-sm transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2",
      active 
        ? "bg-[#e8ecef] shadow-[inset_4px_4px_8px_#d1d5d8,inset_-4px_-4px_8px_#ffffff] text-green-600" 
        : "bg-[#e8ecef] shadow-[4px_4px_8px_#d1d5d8,-4px_-4px_8px_#ffffff] text-slate-500 hover:text-slate-600 active:shadow-[inset_4px_4px_8px_#d1d5d8,inset_-4px_-4px_8px_#ffffff]"
    )}
  >
    {children}
  </button>
);

const VerticalBarIndicator = ({ icon: Icon, value, maxValue = 100, bgFillClass, iconColorClass, label, unit }: any) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <div className="flex flex-col items-center gap-2 h-full">
      <div className="w-full h-56 md:h-64 bg-[#d1d5d8]/30 rounded-2xl relative overflow-hidden shadow-[inset_4px_4px_8px_#c5c9cc,inset_-4px_-4px_8px_#ffffff]">
        {/* Fill */}
        <div 
          className={cn("absolute bottom-0 left-0 w-full transition-all duration-1000 ease-in-out rounded-b-2xl", bgFillClass)}
          style={{ height: `${percentage}%` }}
        >
          {/* Wave effect at the top of the fill (using exact colors to prevent dark overlaps) */}
           <div className={cn("absolute -top-[12px] left-0 w-[200%] h-[13px] opacity-60", iconColorClass)}>
             <svg className="w-full h-full fill-current animate-wave-liquid-reverse" viewBox="0 0 200 100" preserveAspectRatio="none">
               <path d="M 0 50 Q 25 30, 50 50 T 100 50 T 150 50 T 200 50 L 200 100 L 0 100 Z" />
             </svg>
          </div>
          <div className={cn("absolute -top-[12px] left-0 w-[200%] h-[13px] opacity-100", iconColorClass)}>
             <svg className="w-full h-full fill-current animate-wave-liquid" viewBox="0 0 200 100" preserveAspectRatio="none">
               <path d="M 0 50 Q 25 30, 50 50 T 100 50 T 150 50 T 200 50 L 200 100 L 0 100 Z" />
             </svg>
          </div>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 p-3 flex flex-col items-center justify-center z-10 w-full h-full gap-2">
            <div className={cn("p-2 rounded-xl backdrop-blur-sm", percentage > 30 ? "bg-black/20" : "bg-white/40")}>
               <Icon className={cn("w-7 h-7 drop-shadow-sm", percentage > 30 ? "text-white" : iconColorClass)} />
            </div>
            
            <div className={cn("text-2xl font-black mt-2 drop-shadow-md", percentage > 30 ? "text-white" : "text-slate-700")}>
               {(value % 1 !== 0) ? value.toFixed(1) : value}<span className="text-sm">{unit}</span>
            </div>
        </div>
      </div>
      <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider text-center flex-1 flex items-center justify-center leading-tight">
        {label}
      </div>
    </div>
  )
};

const PumpPopup = ({ popup }: { popup: { type: 'pumpA' | 'pumpB'; isOn: boolean } }) => {
  const { t } = useLanguage();
  const isPumpA = popup.type === 'pumpA';
  const title = isPumpA ? (popup.isOn ? t('pumpAOn') : t('pumpAOff')) : (popup.isOn ? t('pumpBOn') : t('pumpBOff'));
  const desc = isPumpA ? (popup.isOn ? t('pumpADescOn') : t('pumpADescOff')) : (popup.isOn ? t('pumpBDescOn') : t('pumpBDescOff'));
  const colorClass = isPumpA ? 'text-blue-500' : 'text-amber-500';
  const bgClass = isPumpA ? 'bg-blue-50' : 'bg-amber-50';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-4"
    >
       <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white flex flex-col items-center text-center max-w-sm w-full mx-auto">
         {/* Illustration */}
         <div className={cn("relative w-36 h-36 rounded-full flex items-center justify-center mb-6 shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden bg-white")}>
            {/* Liquid Level Animation (Waves moved inside to perfectly match the filling level) */}
            <motion.div 
               initial={{ y: '100%' }}
               animate={{ y: popup.isOn ? '0%' : '100%' }}
               transition={{ duration: 1.5, ease: 'easeInOut' }}
               className={cn("absolute inset-0 object-cover", isPumpA ? "bg-blue-200" : "bg-amber-200")}
            >
              <div className="absolute top-0 left-0 w-full h-[20px] -mt-[19px]">
                 <div className={cn("absolute top-0 left-0 w-[200%] h-[20px] opacity-60", isPumpA ? "text-blue-200" : "text-amber-200")}>
                   <svg className="w-full h-full fill-current animate-wave-liquid-reverse" viewBox="0 0 200 100" preserveAspectRatio="none">
                      <path d="M 0 50 Q 25 30, 50 50 T 100 50 T 150 50 T 200 50 L 200 100 L 0 100 Z" />
                   </svg>
                 </div>
                 <div className={cn("absolute top-0 left-0 w-[200%] h-[20px] opacity-100", isPumpA ? "text-blue-200" : "text-amber-200")}>
                   <svg className="w-full h-full fill-current animate-wave-liquid" viewBox="0 0 200 100" preserveAspectRatio="none">
                      <path d="M 0 50 Q 25 30, 50 50 T 100 50 T 150 50 T 200 50 L 200 100 L 0 100 Z" />
                   </svg>
                 </div>
              </div>
            </motion.div>
            
            {/* Floating Icon */}
            {isPumpA ? (
              <motion.div
                animate={{ 
                  y: popup.isOn ? [-8, 8, -8] : 0, 
                  scale: popup.isOn ? [1, 1.1, 1] : 1 
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Droplets className={cn("w-16 h-16 relative z-10", colorClass)} />
              </motion.div>
            ) : (
              <motion.div
                animate={{ 
                  y: popup.isOn ? [-8, 8, -8] : 0,
                  rotate: popup.isOn ? [-10, 10, -10] : 0
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sprout className={cn("w-16 h-16 relative z-10", colorClass)} />
              </motion.div>
            )}

            {/* Rising Particles */}
            {popup.isOn && (
              <div className="absolute inset-0 z-0">
                 {[...Array(6)].map((_, i) => (
                   <motion.div
                     key={i}
                     initial={{ y: 50, opacity: 1, scale: 0 }}
                     animate={{ y: -60, opacity: 0, scale: 1.5 }}
                     transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
                     className={cn("absolute w-3 h-3 rounded-full left-1/2", isPumpA ? "bg-blue-400" : "bg-amber-400")}
                     style={{ marginLeft: `${(Math.random() - 0.5) * 60}px`, bottom: '10%' }}
                   />
                 ))}
              </div>
            )}
         </div>

         <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
         <p className="text-sm font-medium text-slate-500">
           {desc}
         </p>
       </div>
    </motion.div>
  );
};

export default function DashboardSection({ history, onDelete }: DashboardProps) {
  const { t } = useLanguage();
  const { data: iotData, setPumpA, setPumpB, nutrientSchedule, setNutrientSchedule } = useIoT();
  const { waterLevel, soilMoisture, temp, humidity, pumpA, pumpB } = iotData;

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [popup, setPopup] = useState<{ type: 'pumpA' | 'pumpB'; isOn: boolean } | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);
  const [isIotVisible, setIsIotVisible] = useState(false);
  
  const prevPumpA = useRef(pumpA);
  const prevPumpB = useRef(pumpB);
  const iotSectionRef = useRef<HTMLDivElement>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsIotVisible(entry.isIntersecting);
    }, { threshold: 0.1 });

    if (iotSectionRef.current) {
      observer.observe(iotSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (pumpA !== prevPumpA.current) {
      if (isIotVisible) {
        setPopup({ type: 'pumpA', isOn: pumpA });
        if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
        popupTimeoutRef.current = setTimeout(() => setPopup(null), 3500);
      }
      prevPumpA.current = pumpA;
    }
  }, [pumpA, isIotVisible]);

  useEffect(() => {
    if (pumpB !== prevPumpB.current) {
      if (isIotVisible) {
        setPopup({ type: 'pumpB', isOn: pumpB });
        if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
        popupTimeoutRef.current = setTimeout(() => setPopup(null), 3500);
      }
      prevPumpB.current = pumpB;
    }
  }, [pumpB, isIotVisible]);

  const healthyCount = history.filter(h => h.result.isHealthy).length;
  const healthRate = history.length > 0 ? Math.round((healthyCount / history.length) * 100) : 0;
  
  const avgConfidence = history.length > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.result.confidence, 0) / history.length) : 0;

  return (
    <>
      <style>{liquidStyles}</style>
      <AnimatePresence>
        {popup && <PumpPopup popup={popup} />}
        {selectedHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setSelectedHistory(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] shadow-2xl p-4 md:p-5 w-full max-w-5xl flex flex-col gap-3 border border-slate-100 max-h-[95vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 shrink-0">
                <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  {t('historyDetailTitle')}
                </h3>
                <button onClick={() => setSelectedHistory(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-2 hover:bg-slate-200 transition">✕</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0 shrink-0 md:shrink">
                <div className="md:col-span-5 flex flex-col gap-3 min-h-0">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col gap-2.5 h-full min-h-0">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2 shrink-0">
                       <ImageIcon className="w-3.5 h-3.5"/> {t('conditionLab')} / Input
                    </div>
                    {selectedHistory.imageUrl && (
                      <div className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative shrink-0 bg-black/5 flex items-center justify-center max-h-[160px]">
                         <img src={selectedHistory.imageUrl} alt="Uploaded rice" className="max-h-[160px] max-w-full w-full object-contain shrink-0" />
                      </div>
                    )}
                    <div className="font-medium text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-start flex-1 gap-2 overflow-y-auto">
                      <MessageSquareText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{selectedHistory.fullText || selectedHistory.inputSummary}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col gap-3 min-h-0">
                   <div className={cn("p-3 rounded-2xl border flex items-center gap-4 shrink-0", selectedHistory.result.isHealthy ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100")}>
                     <div className={cn("p-2.5 rounded-2xl", selectedHistory.result.isHealthy ? "bg-green-100" : "bg-amber-100")}>
                       {selectedHistory.result.isHealthy ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <AlertTriangle className="w-6 h-6 text-amber-500" />}
                     </div>
                     <div>
                       <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">{t('detectedStatus')}</div>
                       <div className={cn("text-lg font-black", selectedHistory.result.isHealthy ? "text-green-700" : "text-amber-600")}>
                         {selectedHistory.result.disease}
                       </div>
                     </div>
                   </div>

                   <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-0">
                     <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 flex items-center gap-2 shrink-0">
                        <Stethoscope className="w-3.5 h-3.5 text-blue-500"/> {t('recActions')}
                     </div>
                     <div className="text-xs font-medium text-slate-700 leading-relaxed overflow-y-auto">
                       {selectedHistory.result.recommendation}
                     </div>
                   </div>

                   <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-0">
                     <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 flex items-center gap-2 shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 text-purple-500"/> {t('harvestImpact')}
                     </div>
                     <div className="text-xs font-medium text-slate-700 leading-relaxed overflow-y-auto">
                       {selectedHistory.result.harvestImpact}
                     </div>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedHistory(null)}
                className="mt-1 w-full bg-slate-800 text-white font-bold py-2.5 rounded-2xl shadow-lg hover:bg-slate-700 transition shrink-0 active:scale-[0.99]"
              >
                {t('closeBtn')}
              </button>
            </motion.div>
          </motion.div>
        )}
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-sm flex flex-col gap-4 text-center items-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2 shadow-inner">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Hapus Riwayat?</h3>
              <p className="text-sm text-slate-500 mb-4 font-medium">Riwayat analisis ini akan dihapus secara permanen dan tidak dapat dikembalikan.</p>
              
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button 
                  onClick={() => { onDelete(deleteConfirmId); setDeleteConfirmId(null); }}
                  className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-600 transition shadow-red-500/30"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <section id="dashboard" className="w-full flex-1 md:grid md:grid-cols-12 gap-6 pb-12">
        <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-green-100 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-slate-700 flex items-center gap-2 text-lg">
                {t('savedScans')}
              </h2>
              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                {history.length}
              </span>
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-2 max-h-[400px]">
              {history.length === 0 ? (
                 <div className="h-[200px] flex flex-col items-center justify-center text-slate-400">
                   <p className="text-sm">{t('noHistory')}</p>
                 </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} onClick={() => setSelectedHistory(item)} className="p-4 bg-green-50 rounded-2xl border border-green-100 relative group transition-all hover:bg-green-100/70 cursor-pointer">
                    <div className="text-xs text-green-600 font-bold mb-1">
                      {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-sm font-bold text-slate-800 line-clamp-1 mb-1">{item.result.disease}</div>
                    <div className="text-[10px] text-slate-500 leading-tight line-clamp-2">{t('conditionLab')}: {item.inputSummary}</div>
                    
                    {deleteConfirmId === item.id ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                        className="absolute top-4 right-4 text-red-500 bg-red-100 p-1.5 rounded-full transition-all border border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(item.id); }}
                        className="absolute top-4 right-4 text-red-500 bg-red-50 hover:bg-red-100 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-red-200"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
            <button className="mt-6 w-full py-3.5 border-2 border-dashed border-green-200 rounded-2xl text-green-600 font-bold text-sm flex items-center justify-center gap-2 bg-white hover:bg-green-50 transition-colors" onClick={() => document.getElementById('deteksi')?.scrollIntoView({ behavior: 'smooth' })}>
              <span>+</span> {t('newAnalysisBtn')}
            </button>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t('totScans')}</p>
                <h3 className="text-2xl font-black text-slate-800">{history.length} <span className="text-sm font-medium text-slate-500">{t('fieldsLabel')}</span></h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
                <Wheat className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t('ovrHealth')}</p>
                <h3 className="text-2xl font-black text-slate-800">{healthRate}% <span className="text-sm font-medium text-slate-500">{t('safeLabel')}</span></h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Tractor className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t('estYield')}</p>
                <h3 className="text-2xl font-black text-slate-800">{avgConfidence}% <span className="text-sm font-medium text-slate-500">{t('tHaLabel')}</span></h3>
              </div>
            </div>
          </div>

          <div ref={iotSectionRef} className="bg-[#e8ecef] rounded-3xl p-6 md:p-8 shadow-inner border border-white/50 flex-1 flex flex-col relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-3xl"></div>
             
             <div className="relative flex justify-between items-center mb-4">
               <h2 className="font-extrabold text-slate-700 text-xl tracking-tight">{t('iotTitle')}</h2>
               <div className="flex items-center gap-2 bg-[#e8ecef] px-3 py-1.5 rounded-full shadow-[inset_2px_2px_4px_#d1d5d8,inset_-2px_-2px_4px_#ffffff]">
                 <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"></span>
                 <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600">Terhubung</span>
               </div>
             </div>

             <AnimatePresence>
               {(waterLevel < 4 || soilMoisture < 45) && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0, scale: 0.95 }}
                   animate={{ opacity: 1, height: 'auto', scale: 1 }}
                   exit={{ opacity: 0, height: 0 }}
                   className="bg-[#e8ecef] border border-amber-200 p-4 rounded-2xl flex items-start gap-4 mb-4 shadow-[4px_4px_8px_#d1d5d8,-4px_-4px_8px_#ffffff] overflow-hidden"
                 >
                   <div className="bg-amber-100 p-2 rounded-xl mt-0.5 shadow-inner">
                     <AlertCircle className="w-6 h-6 text-amber-600 animate-pulse" />
                   </div>
                   <div>
                     <h4 className="font-bold text-amber-800 text-sm mb-1 uppercase tracking-wider">Tindakan Diperlukan</h4>
                     <p className="text-xs text-amber-700 font-medium">
                       {waterLevel < 4 && !pumpA && "💧 Level air sangat rendah! Aktifkan Pompa Irigasi segera."}
                       {waterLevel < 4 && !pumpA && soilMoisture < 45 && !pumpB && " "}
                       {soilMoisture < 45 && !pumpB && "🌱 Kelembaban tanah rendah. Aktifkan Pompa Nutrisi segera."}
                       {((waterLevel < 4 && pumpA) || (soilMoisture < 45 && pumpB)) && "⚡ Pompa sedang bekerja menstabilkan kondisi..."}
                     </p>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
             
             <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 items-start">
               
               {/* Indicators */}
               <div className="col-span-1">
                 <VerticalBarIndicator icon={Droplets} value={waterLevel} maxValue={15} unit="cm" bgFillClass="bg-blue-500" iconColorClass="text-blue-500" label={t('waterLevel')} />
               </div>
               <div className="col-span-1">
                 <VerticalBarIndicator icon={Sprout} value={soilMoisture} maxValue={100} unit="%" bgFillClass="bg-amber-500" iconColorClass="text-amber-500" label={t('soilMoisture')} />
               </div>
               <div className="col-span-1">
                 <VerticalBarIndicator icon={Thermometer} value={temp} maxValue={50} unit="°C" bgFillClass="bg-red-400" iconColorClass="text-red-400" label={t('tempLabel')} />
               </div>
               <div className="col-span-1">
                 <VerticalBarIndicator icon={Wind} value={humidity} maxValue={100} unit="%" bgFillClass="bg-teal-500" iconColorClass="text-teal-500" label={t('humidityLabel')} />
               </div>

               {/* Controls */}
               <div className="col-span-2 md:col-span-2 flex flex-col gap-4 mt-2">
                 <div className="bg-[#e8ecef] rounded-2xl shadow-[6px_6px_12px_#d1d5d8,-6px_-6px_12px_#ffffff] p-5">
                   <div className="flex justify-between items-center mb-4">
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('irrigationPump')}</div>
                     <div className={cn("text-[10px] font-black uppercase px-2 py-1 rounded", pumpA ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-500")}>
                       {pumpA ? 'ON' : 'OFF'}
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <NeumorphicButton active={pumpA} onClick={() => setPumpA(true)}>
                       <Power className="w-4 h-4" /> {t('turnOn')}
                     </NeumorphicButton>
                     <NeumorphicButton active={!pumpA} onClick={() => setPumpA(false)}>
                       {t('turnOff')}
                     </NeumorphicButton>
                   </div>
                 </div>
               </div>

               <div className="col-span-2 md:col-span-2 flex flex-col gap-4 mt-2">
                 <div className="bg-[#e8ecef] rounded-2xl shadow-[6px_6px_12px_#d1d5d8,-6px_-6px_12px_#ffffff] p-5 h-full flex flex-col justify-between">
                   <div className="flex justify-between items-center mb-4">
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('fertilizerPump')}</div>
                     <div className={cn("text-[10px] font-black uppercase px-2 py-1 rounded border", pumpB ? "bg-amber-100 text-amber-600 border-amber-200" : "bg-slate-200 text-slate-500 border-transparent")}>
                       {pumpB ? 'ON' : 'OFF'}
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <NeumorphicButton active={pumpB} onClick={() => setPumpB(true)}>
                       <Power className="w-4 h-4" /> {t('turnOn')}
                     </NeumorphicButton>
                     <NeumorphicButton active={!pumpB} onClick={() => setPumpB(false)}>
                       {t('turnOff')}
                     </NeumorphicButton>
                   </div>
                 </div>
               </div>

               {/* Status Badge */}
               <div className="col-span-2 md:col-span-4 mt-2">
                  <div className="bg-[#e8ecef] rounded-2xl shadow-[inset_4px_4px_8px_#d1d5d8,inset_-4px_-4px_8px_#ffffff] p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase tracking-widest">
                      <span>Status Sistem IoT</span>
                    </div>
                    <div className="bg-[#e8ecef] rounded-xl shadow-[4px_4px_8px_#d1d5d8,-4px_-4px_8px_#ffffff] px-6 py-2 text-green-600 font-black tracking-widest text-sm">
                      {t('statusOptimal')}
                    </div>
                  </div>
               </div>

             </div>
          </div>
        </div>
      </section>
    </>
  );
}

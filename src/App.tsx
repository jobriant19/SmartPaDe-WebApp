import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnalysisSection, { HistoryItem } from './components/AnalysisSection';
import DashboardSection from './components/DashboardSection';
import FeaturesSection from './components/FeaturesSection';
import { Instagram, Linkedin, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './contexts/LanguageContext';

export default function App() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('oenkayee_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse history", e);
    }
  }, []);

  const handleStartAnalysis = () => {
    document.getElementById('deteksi')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveProgress = (item: HistoryItem) => {
    const updated = [item, ...history];
    setHistory(updated);
    try {
      localStorage.setItem('oenkayee_history', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage quota exceeded, preserving in memory only:", e);
      try {
        // Try truncating to save at least the latest ones
        const pruned = updated.slice(0, 15);
        localStorage.setItem('oenkayee_history', JSON.stringify(pruned));
      } catch (err) {
        console.warn("Failed to save even truncated history to local storage");
      }
    }
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('oenkayee_history', JSON.stringify(updated));
  };

  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-green-50 font-sans text-slate-800 flex flex-col overflow-x-hidden selection:bg-green-500 selection:text-white scroll-smooth w-full">
      <Navbar />
      
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] shadow-2xl p-4 md:p-6 w-full max-w-4xl flex flex-col gap-3 border border-slate-100 max-h-[95vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-green-100 pb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-lg shadow-md">
                    <Info className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">{t('helpTitle')}</h3>
                </div>
                <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto shrink-0 md:shrink">
                <div className="bg-green-50/50 p-3.5 rounded-2xl border border-green-100">
                  <h4 className="font-bold text-green-800 text-sm mb-1 flex items-center gap-2">
                    <span className="bg-green-200 text-green-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                    {t('help1Title')}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{t('help1Desc')}</p>
                </div>
                <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100">
                  <h4 className="font-bold text-blue-800 text-sm mb-1 flex items-center gap-2">
                    <span className="bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                    {t('help2Title')}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{t('help2Desc')}</p>
                </div>
                <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100">
                  <h4 className="font-bold text-amber-800 text-sm mb-1 flex items-center gap-2">
                    <span className="bg-amber-200 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
                    {t('help3Title')}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{t('help3Desc')}</p>
                </div>
                <div className="bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-purple-800 text-sm mb-1 flex items-center gap-2">
                    <span className="bg-purple-200 text-purple-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">4</span>
                    {t('help4Title')}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{t('help4Desc')}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-3 shrink-0">
                <div className="text-lg">💡</div>
                <p className="text-xs font-medium text-slate-600">{t('helpTip')}</p>
              </div>

              <button 
                onClick={() => setShowHelp(false)}
                className="w-full bg-slate-800 text-white font-bold py-2.5 md:py-3 rounded-2xl shadow-lg hover:bg-slate-700 transition active:scale-[0.98] shrink-0"
              >
                {t('helpBtn')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-6 p-6">
        <Hero onStart={handleStartAnalysis} />
        
        <AnalysisSection onSaveProgress={handleSaveProgress} />

        <DashboardSection history={history} onDelete={handleDeleteHistory} />
      </main>

      <FeaturesSection />

      <footer className="bg-white px-8 py-5 mt-12 flex flex-col md:flex-row justify-between items-center border-t border-slate-100 shadow-sm text-slate-400 gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="text-[10px] text-slate-400">
            Sistem ini ditenagai oleh <strong className="text-slate-500">JOSI v1.9</strong>. Data Anda terenkripsi dan aman.
          </div>
          <div className="flex items-center gap-3 mt-2 md:mt-0">
             <a href="https://www.instagram.com/jo_briant19" target="_blank" rel="noreferrer" className="bg-pink-50 p-1.5 rounded-full hover:bg-pink-100 text-pink-600 transition-colors shadow-sm"><Instagram className="w-4 h-4" /></a>
             <a href="https://www.linkedin.com/in/jobriant19" target="_blank" rel="noreferrer" className="bg-blue-50 p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition-colors shadow-sm"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
           <button onClick={() => setShowHelp(true)} className="text-[11px] font-bold text-slate-500 hover:text-green-600 transition-colors uppercase tracking-widest">Bantuan Petani</button>
           <button className="text-[11px] font-bold text-slate-500 hover:text-green-600 transition-colors uppercase tracking-widest">Kebijakan Privasi</button>
        </div>
      </footer>
    </div>
  );
}


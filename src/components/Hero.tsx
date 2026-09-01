import React from "react";
import ThreeDViewer from "./ThreeDViewer";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  const { t } = useLanguage();
  const [displayCount, setDisplayCount] = React.useState("");

  React.useEffect(() => {
    const text = "5,000+";
    let currentIndex = 0;
    let isWaiting = false;
    let isActive = true;

    setDisplayCount("");

    const intervalId = setInterval(() => {
      if (!isActive || isWaiting) return;

      currentIndex++;
      setDisplayCount(text.slice(0, currentIndex));

      if (currentIndex >= text.length) {
        isWaiting = true;
        setTimeout(() => {
          if (!isActive) return;
          currentIndex = 0;
          setDisplayCount("");
          isWaiting = false;
        }, 3000);
      }
    }, 150);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-green-200"
    >
      {/* Background Image Setup */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center object-cover"
        style={{
          backgroundImage: "url('public/herobg.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
        {/* White overlay replaces the dark green one */}
      </div>

      <div className="relative z-10 py-16 px-8 md:px-12 flex flex-col-reverse md:grid md:grid-cols-12 gap-8 items-center">
        {/* Left Text Content */}
        <div className="col-span-12 md:col-span-6 flex flex-col items-start gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-green-100/60 backdrop-blur border border-green-200 rounded-full px-4 py-2 shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-green-800 uppercase tracking-wider">
              {t("heroTag")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-slate-800 tracking-tight"
          >
            {t("heroTitle1")} <br className="hidden md:block" />
            <span className="text-green-600">{t("heroTitle2")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed font-medium"
          >
            {t("heroDesc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mt-2 w-full sm:w-auto"
          >
            <button
              onClick={onStart}
              className="group bg-green-500 hover:bg-green-600 text-white font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto"
            >
              {t("startAnalysis")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex justify-center flex-col bg-white/70 backdrop-blur-md px-8 py-2 md:py-2.5 rounded-full shadow-sm border border-slate-200 text-slate-800 h-[56px] min-w-[180px] sm:w-auto w-full">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="font-black text-xl md:text-2xl leading-none font-mono flex items-center justify-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 inline-block">
                    {displayCount}
                  </span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "linear",
                    }}
                    className="w-[2px] h-5 bg-green-500 ml-1 inline-block"
                  />
                </div>
                <span className="text-green-700 text-[10px] font-extrabold uppercase tracking-widest mt-0.5">
                  {t("farmersText")}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right 3D Model Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="col-span-12 md:col-span-6 w-full flex items-center justify-center relative min-h-[400px]"
        >
          <div className="w-full relative flex flex-col min-h-[450px] bg-transparent -translate-x-4 md:-translate-x-8 scale-90">
            <div className="flex-1 relative flex items-center justify-center p-0">
              <ThreeDViewer />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

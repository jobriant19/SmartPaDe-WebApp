import React from 'react';
import { motion } from 'motion/react';
import { Brain, Radio, Droplets, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: t('feat1Title'),
      desc: t('feat1Desc'),
      hoverShadow: "hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]",
      iconColor: "text-[#4285F4] bg-[#4285F4]/10 group-hover:bg-[#4285F4] group-hover:text-white"
    },
    {
      icon: <Radio className="w-6 h-6" />,
      title: t('feat2Title'),
      desc: t('feat2Desc'),
      hoverShadow: "hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]",
      iconColor: "text-[#EA4335] bg-[#EA4335]/10 group-hover:bg-[#EA4335] group-hover:text-white"
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      title: t('feat3Title'),
      desc: t('feat3Desc'),
      hoverShadow: "hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]",
      iconColor: "text-[#34A853] bg-[#34A853]/10 group-hover:bg-[#34A853] group-hover:text-white"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t('feat4Title'),
      desc: t('feat4Desc'),
      hoverShadow: "hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]",
      iconColor: "text-[#FBBC05] bg-[#FBBC05]/10 group-hover:bg-[#FBBC05] group-hover:text-white"
    }
  ];

  return (
    <section className="py-20 relative w-full overflow-hidden bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
            {t('featuresTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">{t('featuresTitle2')}</span>?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            {t('featuresDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Features Left */}
          <div className="lg:col-span-4 flex flex-col gap-5 order-2 lg:order-1">
            {features.slice(0, 2).map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`group relative p-[2px] rounded-[20px] shadow-sm transition-all duration-300 cursor-default hover:-translate-y-1 ${feature.hoverShadow}`}
              >
                {/* Animated Border Layer */}
                <div className="absolute inset-0 rounded-[20px] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0_180deg,#059669_270deg,#34d399_360deg)] animate-[spin_2s_linear_infinite]" />
                </div>
                {/* Inner Card */}
                <div className="relative bg-white h-full w-full rounded-[18px] p-6 flex flex-col gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${feature.iconColor}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4 flex justify-center order-1 lg:order-2"
          >
            <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
              <motion.img 
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                src="/farmer.png" 
                alt="Happy Farmer" 
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </motion.div>

          {/* Features Right */}
          <div className="lg:col-span-4 flex flex-col gap-5 order-3">
            {features.slice(2, 4).map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`group relative p-[2px] rounded-[20px] shadow-sm transition-all duration-300 cursor-default hover:-translate-y-1 ${feature.hoverShadow}`}
              >
                {/* Animated Border Layer */}
                <div className="absolute inset-0 rounded-[20px] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0_180deg,#059669_270deg,#34d399_360deg)] animate-[spin_2s_linear_infinite]" />
                </div>
                {/* Inner Card */}
                <div className="relative bg-white h-full w-full rounded-[18px] p-6 flex flex-col gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${feature.iconColor}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

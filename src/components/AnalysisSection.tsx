import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Send, Loader2, ArrowRight, X, Image as ImageIcon, Save, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { generateGeminiRecommendation } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useIoT } from '../contexts/IoTContext';
import { Droplets, Sprout, Thermometer } from 'lucide-react';

export type HistoryItem = {
  id: string;
  date: string;
  type: 'image' | 'text';
  inputSummary: string;
  fullText?: string;
  imageUrl?: string;
  result: AnalysisResult;
};

export type AnalysisResult = {
  disease: string;
  confidence: number;
  recommendation: string;
  harvestImpact: string;
  isHealthy: boolean;
  generatedImageUrl?: string;
};

interface AnalysisProps {
  onSaveProgress: (item: HistoryItem) => void;
}

export default function AnalysisSection({ onSaveProgress }: AnalysisProps) {
  const { language, t } = useLanguage();
  const { data: iotData } = useIoT();
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  
  // State for Input
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageThumbnail, setImageThumbnail] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  
  // State for Processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);

      // Create compressed thumbnail for localStorage history
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        setImageThumbnail(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    setResult(null); // Reset previous result
    setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const clearSelection = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageThumbnail(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (activeTab === 'image' && !imageFile) return;
    if (activeTab === 'text' && !textInput.trim()) return;

    setIsProcessing(true);
    setResult(null);
    setError(null);

    try {
      const response = await generateGeminiRecommendation(
        activeTab === 'text' ? textInput : undefined,
        activeTab === 'image' ? imagePreview || undefined : undefined,
        language
      );
      
      setResult(response);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal memproses data. Pastikan API Key valid atau coba lagi nanti.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    
    const newItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      type: activeTab,
      inputSummary: activeTab === 'image' ? (imageFile?.name || 'Uploaded Image') : (textInput.slice(0, 30) + '...'),
      fullText: activeTab === 'text' ? textInput : undefined,
      imageUrl: activeTab === 'image' && imageThumbnail ? imageThumbnail : (result.generatedImageUrl ? result.generatedImageUrl : undefined),
      result: result
    };
    
    onSaveProgress(newItem);
    alert('Progress successfully saved to History!');
  };

  return (
    <section id="deteksi" className="w-full">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-green-100 flex flex-col md:flex-row">
        
        {/* Left Side: Input Area */}
        <div className="w-full md:w-5/12 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col bg-white">
          <h2 className="font-bold text-slate-700 mb-6 text-xl">{t('deepLearningInput')}</h2>
          
          {/* Tabs */}
          <div className="flex bg-slate-50 p-1 rounded-2xl mb-6 border border-slate-200">
            <button 
              onClick={() => { setActiveTab('image'); setResult(null); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-medium text-sm transition-all",
                activeTab === 'image' ? "bg-white text-green-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <UploadCloud className="w-4 h-4" /> {t('imageTab')} 
            </button>
            <button 
              onClick={() => { setActiveTab('text'); setResult(null); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-medium text-sm transition-all",
                activeTab === 'text' ? "bg-white text-green-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <FileText className="w-4 h-4" /> {t('textTab')}
            </button>
          </div>

          {/* Input Interface */}
          <div className="flex-1 flex flex-col justify-center min-h-[250px] mb-6">
            {activeTab === 'image' ? (
              imagePreview ? (
                <div className="relative w-full h-[250px] rounded-2xl overflow-hidden border-2 border-green-500 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={clearSelection} className="bg-white text-red-500 p-3 rounded-full shadow-lg transition-transform hover:scale-110">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="w-full h-[250px] border-2 border-dashed border-green-200 hover:border-green-400 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors bg-green-50/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-10 h-10 text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span className="text-sm font-bold text-green-600">{t('clickDropDesc')}</span>
                  <span className="text-[10px] text-slate-400 mt-1">{t('clickDropSub')}</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleImageUpload}
                  />
                </div>
              )
            ) : (
              <div className="w-full h-full flex flex-col relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">{t('condDescTitle')}</label>
                <textarea 
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t('condDescPlaceholder')}
                  className="w-full h-full min-h-[200px] bg-slate-50 border border-slate-200 focus:border-green-500 rounded-2xl p-4 text-slate-700 placeholder:text-slate-400 resize-none outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-sm"
                />
              </div>
            )}
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={isProcessing || (activeTab === 'image' ? !imageFile : !textInput.trim())}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> {t('btnAnalyzing')}</>
            ) : (
              <>{t('btnStartDL')} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {/* Right Side: Results Area */}
        <div className="w-full md:w-7/12 p-6 md:p-8 bg-gradient-to-br from-green-50 to-teal-50/50 flex flex-col relative text-slate-800 shadow-inner rounded-r-3xl border-l border-green-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <h2 className="font-bold text-green-700 text-sm uppercase tracking-widest bg-green-100/50 px-3 py-1.5 rounded-lg inline-block w-fit">{t('harvestRec')}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-white px-2.5 py-1 rounded-full shadow-sm border border-slate-200 text-[10px] font-bold text-blue-500 flex items-center gap-1">
                <Droplets className="w-3 h-3" /> {iotData.waterLevel}cm
              </div>
              <div className="bg-white px-2.5 py-1 rounded-full shadow-sm border border-slate-200 text-[10px] font-bold text-amber-500 flex items-center gap-1">
                <Sprout className="w-3 h-3" /> {iotData.soilMoisture}%
              </div>
              <div className="bg-white px-2.5 py-1 rounded-full shadow-sm border border-slate-200 text-[10px] font-bold text-red-500 flex items-center gap-1">
                <Thermometer className="w-3 h-3" /> {iotData.temp}°C
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <AnimatePresence mode="wait">
              {isProcessing && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-green-600 space-y-4 min-h-[250px]"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-green-200 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="font-bold animate-pulse tracking-wide text-sm">{t('runningModel')}</p>
                </motion.div>
              )}

              {!isProcessing && !result && !error && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="h-full flex flex-col items-center justify-center text-slate-400 text-center min-h-[250px]"
                >
                  <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-5">
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <p className="max-w-xs text-sm font-medium">{t('provideInputDesc')}</p>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="h-full flex flex-col items-center justify-center text-red-600 text-center min-h-[250px] p-6 bg-red-50 rounded-3xl border border-red-100 shadow-sm"
                >
                  <div className="bg-red-100 p-4 rounded-full mb-4">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  </div>
                  <p className="font-bold">{error}</p>
                </motion.div>
              )}

              {result && !isProcessing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  {(imageThumbnail || result.generatedImageUrl) && (
                    <div className="w-full h-48 md:h-56 bg-black/5 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative flex items-center justify-center">
                      <img 
                        src={imageThumbnail || result.generatedImageUrl} 
                        alt="Kondisi Tanaman" 
                        className="w-full h-full object-cover"
                      />
                      {result.generatedImageUrl && (
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                          AI Generated
                        </div>
                      )}
                    </div>
                  )}

                  <div className={cn("flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white p-5 rounded-3xl border shadow-sm", result.isHealthy ? "border-green-200" : "border-amber-200")}>
                    <div className={cn("p-4 rounded-2xl", result.isHealthy ? "bg-green-100" : "bg-amber-100")}>
                      {result.isHealthy ? <CheckCircle2 className="w-8 h-8 text-green-600" /> : <AlertTriangle className="w-8 h-8 text-amber-500" />}
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">{t('detectedStatus')}</div>
                      <div className={cn("text-2xl font-black", result.isHealthy ? "text-green-700" : "text-amber-600")}>{result.disease}</div>
                    </div>
                  </div>

                  <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-blue-500"></span> {t('recActions')}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-700 font-medium">
                      {result.recommendation}
                    </p>
                  </div>

                  <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-purple-500"></span> {t('harvestImpact')}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-700 font-medium">
                      {result.harvestImpact}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-3xl p-5 text-center border border-slate-100 shadow-sm">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">{t('aiConfidence')}</div>
                      <div className="text-2xl font-black text-slate-800">{result.confidence}%</div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 text-center border border-slate-100 shadow-sm">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">{t('state')}</div>
                      <div className={cn("text-lg font-black uppercase tracking-wider", result.isHealthy ? "text-green-600" : "text-amber-500")}>
                        {result.isHealthy ? t('stateSafe') : t('stateActionReq')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Footer for Results */}
          <div className="mt-6 pt-6 border-t border-green-200/50 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={!result || isProcessing}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed text-sm"
            >
              <Save className="w-4 h-4" /> {t('saveRecord')}
            </button>
          </div>
        </div>
        
      </div>
    </section>
  );
}

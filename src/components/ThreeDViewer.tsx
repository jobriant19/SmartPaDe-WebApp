import React, { useEffect, useState } from 'react';
import '@google/model-viewer';

const ModelViewer = 'model-viewer' as any;

export default function ThreeDViewer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-transparent animate-pulse">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200/50 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-500 font-bold tracking-wider uppercase text-sm">Loading 3D Environment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[105%] h-[120%] absolute inset-0 -ml-[2.5%] -mt-[10%]">
      {/* 
        ======================================================================================
        🌾 PANDUAN MENGGANTI MODEL 3D / HOW TO CHANGE 3D MODEL 🌾
        ======================================================================================
        1. Unggah file .glb 3D milik Anda (misal: "padi-milik-saya.glb") ke dalam folder 'public' 
           di file explorer AI Studio di sebelah kiri.
        2. Pada komponen <model-viewer> di bawah ini, ubah nilai "src" yang semula menggunakan link https... 
           menjadi "/nama-file-anda.glb" (Contoh: src="/padi-milik-saya.glb").
        ======================================================================================
      */}
      <ModelViewer
        src="/base_basic_shaded.glb"
        alt="Rice Plant 3D Model"
        auto-rotate
        auto-rotate-delay="500"
        rotation-per-second="30deg"
        camera-controls
        disable-zoom
        disable-pan
        shadow-intensity="1"
        exposure="1"
        class="w-full h-full outline-none focus:outline-none border-none"
        style={{ 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'transparent',
          '--progress-bar-height': '0px',
          '--progress-bar-color': 'transparent'
        } as React.CSSProperties}
      >
        <div slot="progress-bar" style={{ display: 'none', height: 0 }}></div>
      </ModelViewer>
    </div>
  );
}

import React, { useState } from 'react';
import { Sparkles, Download, Image as ImageIcon } from 'lucide-react';
import { NeonButton } from './ui/NeonButton';
import { generateImageWithAi } from '../services/geminiService';
import { AppStatus } from '../types';

interface ImageGeneratorProps {
  onError: (msg: string) => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onError }) => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setStatus(AppStatus.PROCESSING);
    setGeneratedImage(null);
    
    try {
      const result = await generateImageWithAi(prompt);
      setGeneratedImage(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setStatus(AppStatus.ERROR);
      onError(err.message);
    } finally {
      if (!generatedImage) setStatus(prev => prev === AppStatus.PROCESSING ? AppStatus.IDLE : prev);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-12 p-4">
      
      <div className="flex flex-col gap-8 bg-white p-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        
        <div className="relative z-10 text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-black tracking-tighter">
            TEXT TO <span className="bg-black text-acid-yellow px-2">IMAGE</span>
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto text-lg">
            Describe your imagination. We generate the pixels.
          </p>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-0 mt-4 border-2 border-black p-1 bg-gray-50">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="A futuristic car in a neon city..."
            className="flex-1 bg-transparent border-none px-6 py-4 text-black placeholder-gray-400 focus:ring-0 outline-none text-lg font-medium"
          />
          <NeonButton 
            onClick={handleGenerate} 
            isLoading={status === AppStatus.PROCESSING}
            disabled={!prompt.trim()}
            className="md:w-auto w-full whitespace-nowrap !shadow-none !border-none h-full"
          >
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Generate
          </NeonButton>
        </div>
      </div>

      {/* Result Area */}
      {(generatedImage || status === AppStatus.PROCESSING) && (
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 min-h-[400px] flex items-center justify-center relative group">
          
          {status === AppStatus.PROCESSING && (
             <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-black border-t-acid-yellow rounded-full animate-spin mx-auto"></div>
                <p className="text-black font-bold font-mono uppercase tracking-widest">Rendering...</p>
             </div>
          )}

          {status === AppStatus.SUCCESS && generatedImage && (
            <div className="relative w-full max-w-2xl animate-in fade-in zoom-in duration-500">
              <img 
                src={generatedImage} 
                alt={prompt} 
                className="w-full h-auto border-2 border-black"
              />
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <a href={generatedImage} download={`neon-gen-${Date.now()}.png`}>
                   <button className="bg-black text-acid-yellow hover:bg-acid-yellow hover:text-black p-4 border-2 border-black transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                     <Download className="w-6 h-6" />
                   </button>
                 </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
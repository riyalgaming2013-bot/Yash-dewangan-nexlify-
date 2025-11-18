import React, { useState, useRef, useEffect } from 'react';
import { Upload, Brush, RotateCcw, Download, Wand2 } from 'lucide-react';
import { NeonButton } from './ui/NeonButton';
import { editImageWithAi } from '../services/geminiService';
import { AppStatus } from '../types';

interface ImageEditorProps {
  onError: (msg: string) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ onError }) => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Handle File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setOriginalImage(result);
        setEditedImage(null);
        setStatus(AppStatus.IDLE);
        
        const img = new Image();
        img.src = result;
        img.onload = () => {
          imageRef.current = img;
          resetCanvas(img);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const maxWidth = 800;
      const scale = Math.min(1, maxWidth / img.width);
      
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    }
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (status === AppStatus.PROCESSING) return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    
    if (ctx) {
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(223, 255, 0, 0.6)'; // Acid Yellow Mask
      
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handleClearCanvas = () => {
    if (imageRef.current) {
      resetCanvas(imageRef.current);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt) return;

    setStatus(AppStatus.PROCESSING);
    try {
      const result = await editImageWithAi(originalImage, 'image/png', prompt);
      setEditedImage(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setStatus(AppStatus.ERROR);
      onError(err.message);
    } finally {
      if (status !== AppStatus.SUCCESS) {
        // Error handled above
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto gap-8 p-4">
      
      {/* Upload Box */}
      {!originalImage && (
        <div className="w-full max-w-2xl border-4 border-dashed border-gray-300 rounded-none p-20 flex flex-col items-center justify-center bg-gray-50 hover:border-deep-black hover:bg-acid-yellow/10 transition-colors group cursor-pointer relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <div className="w-20 h-20 bg-white border-2 border-black rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">Upload Image</h3>
          <p className="text-gray-500">JPG, PNG supported</p>
        </div>
      )}

      {/* Editor Interface */}
      {originalImage && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Canvas */}
          <div className="lg:col-span-2 flex flex-col gap-4">
             <div className="relative border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
               {editedImage ? (
                  <img src={editedImage} alt="Edited Result" className="w-full h-auto block" />
               ) : (
                 <canvas
                   ref={canvasRef}
                   onMouseDown={startDrawing}
                   onMouseUp={stopDrawing}
                   onMouseLeave={stopDrawing}
                   onMouseMove={draw}
                   onTouchStart={startDrawing}
                   onTouchEnd={stopDrawing}
                   onTouchMove={draw}
                   className="w-full h-auto cursor-crosshair touch-none block"
                 />
               )}
               
               {!editedImage && (
                 <div className="absolute top-4 left-4 bg-black text-acid-yellow text-xs font-bold px-3 py-1 uppercase tracking-wider pointer-events-none">
                   Highlight Area
                 </div>
               )}
             </div>

             {/* Canvas Controls */}
             {!editedImage && (
               <div className="flex items-center gap-4 bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                 <Brush className="text-black w-5 h-5" />
                 <input 
                   type="range" 
                   min="5" 
                   max="50" 
                   value={brushSize} 
                   onChange={(e) => setBrushSize(Number(e.target.value))}
                   className="flex-1 h-2 bg-gray-200 rounded-none appearance-none cursor-pointer accent-black"
                 />
                 <button 
                   onClick={handleClearCanvas}
                   className="p-2 hover:bg-gray-100 border border-transparent hover:border-black transition-all rounded"
                   title="Reset Selection"
                 >
                   <RotateCcw className="w-5 h-5 text-black" />
                 </button>
               </div>
             )}
          </div>

          {/* Sidebar Controls */}
          <div className="flex flex-col gap-6 bg-white p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-fit">
            
            {editedImage ? (
               <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
                 <h3 className="text-2xl font-bold text-black bg-acid-yellow inline-block px-2 w-fit">DONE!</h3>
                 <p className="text-gray-600 text-sm">Your image has been processed.</p>
                 
                 <div className="flex flex-col gap-3 mt-4">
                   <a href={editedImage} download="neon-gen-edit.png" className="w-full">
                    <NeonButton className="w-full">
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download Result
                    </NeonButton>
                   </a>
                   <NeonButton onClick={() => setEditedImage(null)} variant="secondary" className="w-full">
                     <RotateCcw className="w-4 h-4 mr-2 inline" />
                     Edit Again
                   </NeonButton>
                 </div>
               </div>
            ) : (
              <>
                <div>
                  <h3 className="text-2xl font-bold text-black mb-1">Magic Editor</h3>
                  <p className="text-gray-600 text-sm">Brush area & describe changes.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-black tracking-wider">Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Make the shirt red..."
                    className="w-full bg-gray-50 border-2 border-black p-3 text-black placeholder-gray-400 focus:bg-white focus:ring-0 outline-none resize-none h-32 font-medium"
                  />
                </div>

                <NeonButton 
                  onClick={handleEdit} 
                  disabled={!prompt.trim() || status === AppStatus.PROCESSING}
                  isLoading={status === AppStatus.PROCESSING}
                  className="w-full"
                >
                  <Wand2 className="w-4 h-4 mr-2 inline" />
                  {status === AppStatus.PROCESSING ? 'Processing...' : 'Generate Edit'}
                </NeonButton>

                <button 
                  onClick={() => {
                     setOriginalImage(null);
                     setEditedImage(null);
                     setPrompt('');
                  }}
                  className="text-xs text-gray-500 hover:text-black underline text-center mt-2 uppercase tracking-wide font-bold"
                >
                  Change Image
                </button>
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
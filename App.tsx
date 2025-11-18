import React, { useState } from 'react';
import { ImageEditor } from './components/ImageEditor';
import { ImageGenerator } from './components/ImageGenerator';
import { Layers, PenTool, AlertTriangle, Sparkles, ArrowRight, Wand2, Image as ImageIcon, ChevronRight } from 'lucide-react';

enum View {
  LANDING = 'LANDING',
  EDITOR = 'EDITOR',
  GENERATOR = 'GENERATOR'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [error, setError] = useState<string | null>(null);

  const handleError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  const navigateTo = (view: View) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-acid-yellow selection:text-black overflow-x-hidden font-sans">
      
      {/* Geometric Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-30">
         <div className="absolute top-[10%] left-[5%] w-64 h-64 border border-gray-200 rounded-full"></div>
         <div className="absolute bottom-[20%] right-[10%] w-96 h-96 border border-gray-200 rounded-full"></div>
         <div className="absolute top-[40%] left-[40%] w-32 h-32 bg-acid-yellow/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigateTo(View.LANDING)}
            className="flex items-center gap-3 group focus:outline-none"
          >
             <div className="w-10 h-10 bg-black text-acid-yellow flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(223,255,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(223,255,0,1)] transition-all duration-200 border-2 border-black">
               <Layers className="w-6 h-6" />
             </div>
             <div className="flex flex-col items-start leading-none">
               <h1 className="text-2xl font-bold tracking-wide text-black">
                 NEON<span className="text-gray-400">GEN</span>
               </h1>
               <span className="text-[10px] font-bold text-acid-yellow bg-black px-1 tracking-[0.2em] uppercase">Studio</span>
             </div>
          </button>
          
          {/* Navigation Buttons */}
          {currentView !== View.LANDING && (
            <nav className="flex gap-2">
               <button 
                 onClick={() => navigateTo(View.EDITOR)}
                 className={`flex items-center px-5 py-2 border-2 font-bold transition-all duration-200 ${currentView === View.EDITOR ? 'bg-black text-acid-yellow border-black' : 'bg-white text-gray-500 border-transparent hover:border-gray-200'}`}
               >
                 <PenTool className="w-4 h-4 mr-2" />
                 Editor
               </button>
               <button 
                  onClick={() => navigateTo(View.GENERATOR)}
                  className={`flex items-center px-5 py-2 border-2 font-bold transition-all duration-200 ${currentView === View.GENERATOR ? 'bg-black text-acid-yellow border-black' : 'bg-white text-gray-500 border-transparent hover:border-gray-200'}`}
               >
                 <Sparkles className="w-4 h-4 mr-2" />
                 Generate
               </button>
            </nav>
          )}
        </div>
      </header>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-24 right-4 z-50 max-w-sm w-full bg-white border-2 border-red-500 text-red-600 px-4 py-3 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] flex items-start gap-3 animate-in slide-in-from-right duration-300">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
             <h4 className="font-bold text-sm uppercase">Error</h4>
             <p className="text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-auto font-bold hover:bg-red-50 p-1">
            &times;
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        
        {/* VIEW: LANDING PAGE */}
        {currentView === View.LANDING && (
          <div className="max-w-6xl mx-auto w-full">
            
            {/* Hero Section */}
            <div className="text-center mb-20 relative animate-in fade-in zoom-in-95 duration-700">
              <div className="inline-block bg-acid-yellow text-black border-2 border-black px-4 py-1 text-sm font-bold uppercase tracking-widest mb-6 transform -rotate-2">
                Powered by Gemini Nano
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-none tracking-tight text-black">
                CREATIVE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-700 text-outline">REALITY</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                The next-gen AI studio. Edit seamlessly or generate from scratch.
              </p>
            </div>

            {/* Feature Cards with Float Animation */}
            <div className="grid md:grid-cols-2 gap-8 px-4">
              
              {/* Editor Card */}
              <div 
                onClick={() => navigateTo(View.EDITOR)}
                className="group relative h-[450px] bg-deep-black border-2 border-black p-10 cursor-pointer overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(223,255,0,1)] animate-float"
              >
                <div className="relative h-full flex flex-col justify-between z-10">
                  <div>
                    <div className="w-20 h-20 bg-white border-2 border-black flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                      <Wand2 className="w-10 h-10 text-black" />
                    </div>
                    <h3 className="text-5xl font-bold text-white mb-4">Magic <span className="text-acid-yellow">Editor</span></h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Upload photos. Brush areas. Transform reality with words.
                    </p>
                  </div>
                  
                  <div className="flex items-center text-acid-yellow font-bold uppercase tracking-wider text-lg group-hover:gap-4 transition-all">
                    Start Editing <ArrowRight className="w-6 h-6 ml-2" />
                  </div>
                </div>
              </div>

              {/* Generator Card */}
              <div 
                onClick={() => navigateTo(View.GENERATOR)}
                className="group relative h-[450px] bg-deep-black border-2 border-black p-10 cursor-pointer overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(223,255,0,1)] animate-float-delayed"
              >
                <div className="relative h-full flex flex-col justify-between z-10">
                  <div>
                    <div className="w-20 h-20 bg-white border-2 border-black flex items-center justify-center mb-6 group-hover:-rotate-12 transition-transform duration-300">
                      <ImageIcon className="w-10 h-10 text-black" />
                    </div>
                    <h3 className="text-5xl font-bold text-white mb-4">Text to <span className="text-acid-yellow">Image</span></h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Turn your imagination into high-fidelity visuals instantly.
                    </p>
                  </div>
                  
                  <div className="flex items-center text-acid-yellow font-bold uppercase tracking-wider text-lg group-hover:gap-4 transition-all">
                    Start Generating <ArrowRight className="w-6 h-6 ml-2" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: EDITOR */}
        {currentView === View.EDITOR && (
          <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-8 uppercase tracking-widest">
              <span onClick={() => navigateTo(View.LANDING)} className="hover:text-black cursor-pointer transition-colors">Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-black bg-acid-yellow px-1">Magic Editor</span>
            </div>
            <ImageEditor onError={handleError} />
          </div>
        )}

        {/* VIEW: GENERATOR */}
        {currentView === View.GENERATOR && (
          <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
             <div className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-8 uppercase tracking-widest">
              <span onClick={() => navigateTo(View.LANDING)} className="hover:text-black cursor-pointer transition-colors">Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-black bg-acid-yellow px-1">Generator</span>
            </div>
            <ImageGenerator onError={handleError} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center border-t border-gray-200 bg-gray-50">
        <p className="text-gray-500 text-sm font-medium">
          Built with Gemini Nano • <span className="text-black font-bold">NeonGen Studio</span>
        </p>
      </footer>

    </div>
  );
};

export default App;
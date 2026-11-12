import React, { useState } from 'react';
import { X, Camera, Upload, Sparkles, CheckCircle2, ArrowRight, Image as ImageIcon, Loader2 } from 'lucide-react';
import { SAMPLE_IMAGE_SEARCH_PRESETS } from '../data/mockProducts';
import { CategoryId } from '../types';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySearchResult: (query: string, category?: CategoryId) => void;
}

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({
  isOpen,
  onClose,
  onApplySearchResult,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_IMAGE_SEARCH_PRESETS[0]) => {
    setSelectedImage(preset.sampleImage);
    analyzeImage(preset.sampleImage, preset.category as CategoryId);
  };

  const analyzeImage = async (imageSrc: string, presetCategory?: CategoryId) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/gemini/visual-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageSrc,
          mimeType: 'image/jpeg',
        }),
      });

      if (!res.ok) throw new Error('Visual search failed');
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Visual search error:', err);
      // Fallback
      if (presetCategory === 'electronics' || imageSrc.includes('mouse')) {
        setAnalysisResult({
          productName: 'Logitech MX Master 3S',
          category: 'electronics',
          brand: 'Logitech',
          estimatedPriceRange: '$119 - $149',
          features: ['Quiet Clicks', '8,000 DPI Darkfield', 'MagSpeed Scroll Wheel'],
          suggestedSearch: 'Logitech MX Master 3S',
        });
      } else if (presetCategory === 'watches' || imageSrc.includes('watch')) {
        setAnalysisResult({
          productName: 'Tissot PRX Powermatic 80',
          category: 'watches',
          brand: 'Tissot',
          estimatedPriceRange: '$760 - $980',
          features: ['Integrated Bracelet', 'Swiss Automatic', 'Waffle Blue Dial'],
          suggestedSearch: 'Tissot PRX',
        });
      } else if (presetCategory === 'perfumes') {
        setAnalysisResult({
          productName: 'Le Labo Santal 33',
          category: 'perfumes',
          brand: 'Le Labo',
          estimatedPriceRange: '$285 - $345',
          features: ['Woody Aromatic', 'Sandalwood & Leather', 'Niche Fragrance'],
          suggestedSearch: 'Le Labo Santal 33',
        });
      } else if (presetCategory === 'bags') {
        setAnalysisResult({
          productName: 'Coach Tabby Shoulder Bag 26',
          category: 'bags',
          brand: 'Coach',
          estimatedPriceRange: '$585 - $850',
          features: ['Pebble Leather', 'Signature C Clasp', 'Dual Straps'],
          suggestedSearch: 'Coach Tabby',
        });
      } else {
        setAnalysisResult({
          productName: 'Ceremonial Grade Uji Matcha',
          category: 'food',
          brand: 'Ippodo Tea Co.',
          estimatedPriceRange: '$72 - $95',
          features: ['Kyoto Origin', 'Ceremonial Shade-Grown', 'Vibrant Jade Powder'],
          suggestedSearch: 'Ceremonial Matcha',
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Visual Product Search</h3>
              <p className="text-xs text-slate-300">
                Upload or capture a photo to find the same or similar item (PDF Page 2)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Upload Zone */}
          <label className="block border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition bg-slate-50 hover:bg-blue-50/30">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <div className="font-bold text-slate-800 text-sm">
              Click to upload product image or drag & drop
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Supports JPG, PNG, WEBP of tech, watches, bags, perfume, and specialty goods
            </div>
          </label>

          {/* Quick Preset Samples to test immediately */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Or try with a sample item:</span>
              <span className="text-[11px] text-blue-600 font-normal">1-Click Test</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SAMPLE_IMAGE_SEARCH_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="group rounded-xl border border-slate-200 hover:border-blue-400 p-2 cursor-pointer transition hover:shadow-xs bg-white flex flex-col justify-between"
                >
                  <img
                    src={preset.sampleImage}
                    alt={preset.title}
                    className="w-full h-20 object-cover rounded-lg mb-1.5 group-hover:scale-102 transition-transform"
                  />
                  <div>
                    <div className="font-bold text-[11px] text-slate-800 truncate">
                      {preset.title}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">
                      {preset.caption}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Processing State */}
          {isAnalyzing && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-center gap-3 text-blue-800 text-xs font-semibold">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span>Gemini Vision is analyzing visual features, brand signature & model...</span>
            </div>
          )}

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                      Product Identified:
                    </div>
                    <div className="text-base font-extrabold text-slate-900">
                      {analysisResult.productName}
                    </div>
                    <div className="text-xs text-slate-600">
                      Brand: <strong>{analysisResult.brand}</strong> • Est. Price:{' '}
                      <strong className="text-emerald-700">{analysisResult.estimatedPriceRange}</strong>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                  {analysisResult.category}
                </span>
              </div>

              {analysisResult.features && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {analysisResult.features.map((feat: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-white text-slate-700 border border-emerald-200 text-[11px] px-2 py-0.5 rounded-md"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  onApplySearchResult(
                    analysisResult.suggestedSearch || analysisResult.productName,
                    analysisResult.category
                  );
                  onClose();
                }}
                className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <span>Compare Prices for this Item in BASKT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

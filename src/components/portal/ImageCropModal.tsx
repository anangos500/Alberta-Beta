import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { X, Check } from 'lucide-react';
import { getCroppedImg } from '../../utils/cropImage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageBlob: File) => void;
  aspectRatio?: number;
}

export const ImageCropModal: React.FC<Props> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio = 1,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error('Error cropping image:', e);
      alert('Gagal memotong gambar.');
    } finally {
      setIsProcessing(false);
    }
  };

  const [isMouseDownOnBackdrop, setIsMouseDownOnBackdrop] = useState(false);

  if (!isOpen || !imageSrc) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          setIsMouseDownOnBackdrop(true);
        }
      }}
      onMouseUp={(e) => {
        if (isMouseDownOnBackdrop && e.target === e.currentTarget) {
          e.stopPropagation();
          onClose();
        }
        setIsMouseDownOnBackdrop(false);
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-stone-200 shrink-0">
          <h3 className="font-bold text-stone-800">Sesuaikan Foto</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full h-[60vh] sm:h-[400px] shrink-0 bg-stone-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
            cropShape="round"
            showGrid={false}
          />
        </div>

        <div className="p-5 space-y-4 shrink-0 bg-white">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-stone-600">Perbesar (Zoom)</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 text-xs transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? 'Memproses...' : 'Terapkan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

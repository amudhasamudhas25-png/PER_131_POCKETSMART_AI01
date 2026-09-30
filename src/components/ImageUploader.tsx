import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import sampleSareeImg from '../assets/images/sample_saree_outfit_1790688039909.jpg';

interface ImageUploaderProps {
  imageBase64?: string;
  onImageChange: (base64?: string, mimeType?: string) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageBase64,
  onImageChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);

  const handleFile = (file: File) => {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setError('Invalid image format. Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Image is too large. Maximum allowed size is 8 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onImageChange(result, file.type);
    };
    reader.onerror = () => {
      setError('Could not read the selected image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSampleSaree = async () => {
    setError(null);
    setLoadingSample(true);
    try {
      const response = await fetch(sampleSareeImg);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string, blob.type || 'image/jpeg');
        setLoadingSample(false);
      };
      reader.readAsDataURL(blob);
    } catch {
      setError('Unable to load sample image.');
      setLoadingSample(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-800">
          Upload Outfit Image (Optional — Multimodal AI Analysis)
        </label>
        <button
          type="button"
          onClick={handleLoadSampleSaree}
          disabled={loadingSample}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer whitespace-nowrap"
        >
          {loadingSample ? 'Loading sample...' : 'Use Sample Red Silk Saree Image'}
        </button>
      </div>

      {!imageBase64 ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
          className="border-2 border-dashed border-slate-300 hover:border-slate-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/60"
        >
          <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-800">
            Click to upload your outfit photo or drag and drop
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supports JPG, JPEG, PNG, WEBP up to 8 MB · Gemini analyzes visible colors, neckline & embroidery
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={imageBase64}
              alt="Uploaded outfit preview"
              referrerPolicy="no-referrer"
              className="w-20 h-24 object-cover rounded-lg border border-slate-200 bg-white"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Outfit image attached for Gemini vision analysis</span>
              </div>
              <p className="text-xs text-slate-600">
                Gemini will inspect dominant colors, fabric texture, border work, and neckline compatibility.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onImageChange(undefined, undefined)}
            aria-label="Remove uploaded outfit image"
            className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {error && (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

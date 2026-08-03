import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  confirmText?: string;
  cancelText?: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Peringatan",
  message = "Ada data yang belum disimpan. Apakah Anda yakin ingin membuang data ini?",
  confirmText = "Buang Data",
  cancelText = "Kembali"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4 text-amber-600">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-bold text-stone-800">{title}</h3>
        </div>
        <p className="text-stone-600 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";

export default function ImageModal({ imageUrl, onClose }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full max-w-4xl mx-4">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          Close
        </button>

        {!imageError ? (
          <img
            src={imageUrl}
            alt="Full size wound image"
            className="w-full h-auto max-h-[80vh] object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-80 bg-gray-100 rounded-lg">
            <p className="text-gray-400">Gagal memuat gambar</p>
          </div>
        )}
      </div>
    </div>
  );
}
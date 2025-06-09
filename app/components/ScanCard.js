import Image from 'next/image';
import { useState } from 'react';

export default function ScanCard({
  scan,
  selectedScan,
  setSelectedScan,
  setSelectedImage,
  diagnosis,
  setDiagnosis,
  recommendation,
  setRecommendation,
  handleScanReview,
  imageUrl // Add imageUrl prop
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`bg-white rounded-lg shadow p-6 ${
        selectedScan?._id === scan._id ? 'ring-2 ring-purple-500' : ''
      }`}
    >
      <div className="flex gap-4">
        <div className="w-32 h-32 relative rounded overflow-hidden cursor-pointer">
          {!imageError ? (
            <img
              src={imageUrl}
              alt={`Wound scan from ${scan.username}`}
              className="w-full h-full object-contain"
              onClick={() => setSelectedImage(imageUrl)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Gagal memuat gambar</p>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium text-purple-800">{scan.username}</h3>
            <button
              onClick={() => setSelectedScan(selectedScan?._id === scan._id ? null : scan)}
              className="text-purple-600 text-sm hover:text-purple-800 transition-colors"
            >
              {selectedScan?._id === scan._id ? 'Tutup' : 'Review'}
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Lokasi:</span>{' '}
              {scan.description?.location || 'Tidak ditentukan'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Durasi:</span>{' '}
              {scan.description?.duration ? `${scan.description.duration} hari` : 'Tidak ditentukan'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Level Nyeri:</span>{' '}
              {scan.description?.pain || 'Tidak ditentukan'}
            </p>
            {scan.symptoms?.length > 0 && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Gejala:</span>{' '}
                {scan.symptoms.join(', ')}
              </p>
            )}
          </div>

          {selectedScan?._id === scan._id && (
            <div className="space-y-3 border-t pt-3">
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Tulis diagnosis..."
                className="w-full p-2 text-sm border rounded resize-none h-20"
              />
              <textarea
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder="Tulis rekomendasi..."
                className="w-full p-2 text-sm border rounded resize-none h-20"
              />
              <button
                onClick={() => handleScanReview(scan)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors"
                disabled={!diagnosis.trim() || !recommendation.trim()}
              >
                Kirim Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
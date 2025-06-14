import { useState, useEffect } from 'react';

// Helper function to get proper image URL
const getProperImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/api/images/')) {
    const id = url.split('/').pop();
    return `/api/images?id=${id}`;
  }
  return url;
};

export default function ScanCard({
  scan,
  selectedScan,
  setSelectedScan,
  setSelectedImage,
  diagnosis,
  setDiagnosis,
  recommendation,
  setRecommendation,
  handleScanReview
}) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (scan.imageUrl) {
      const properUrl = getProperImageUrl(scan.imageUrl);
      console.log('Processing image URL:', scan.imageUrl, 'to:', properUrl);
      setImageSrc(properUrl);
      setImageError(false);
    }
  }, [scan.imageUrl]);

  const handleImageError = () => {
    console.error('Image load error for:', scan.imageUrl);
    setImageError(true);
  };

  const handleImageClick = () => {
    if (imageSrc) {
      setSelectedImage(imageSrc);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${selectedScan?._id === scan._id ? 'ring-2 ring-purple-500' : ''
      }`}>
      <div className="flex gap-4">
        {/* Image Section */}
        <div className="w-32 h-32 relative rounded-lg overflow-hidden bg-gray-100">
          {!imageError && imageSrc ? (
            <img
              src={imageSrc}
              alt={`Wound scan from ${scan.username}`}
              className="w-full h-full object-cover hover:opacity-75 transition-opacity cursor-pointer"
              onClick={handleImageClick}
              onError={handleImageError}
              loading="lazy"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm text-center px-2">
                Gagal memuat gambar
              </p>
            </div>
          )}
        </div>

        {/* Content Section */}
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
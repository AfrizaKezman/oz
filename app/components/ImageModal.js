export default function ImageModal({ imageUrl, onClose }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full mx-4" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          Tutup
        </button>
        
        <img
          src={imageUrl}
          alt="Full size wound image"
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          loading="eager"
        />
      </div>
    </div>
  );
}
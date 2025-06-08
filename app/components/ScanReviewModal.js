export default function ScanReviewModal({ scan, onClose, onSubmit }) {
  const [review, setReview] = useState({
    diagnosis: '',
    severity: 'low',
    recommendation: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(scan._id, review);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Review Scan Luka</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="mb-6">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={scan.imageUrl}
                alt="Wound Scan"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Diagnosis</label>
              <input
                type="text"
                value={review.diagnosis}
                onChange={(e) => setReview({ ...review, diagnosis: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tingkat Keparahan</label>
              <select
                value={review.severity}
                onChange={(e) => setReview({ ...review, severity: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rekomendasi</label>
              <textarea
                value={review.recommendation}
                onChange={(e) => setReview({ ...review, recommendation: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Catatan Tambahan</label>
              <textarea
                value={review.notes}
                onChange={(e) => setReview({ ...review, notes: e.target.value })}
                className="w-full p-2 border rounded"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700"
              >
                Kirim Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
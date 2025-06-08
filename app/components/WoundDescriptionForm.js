"use client";
import { useState } from 'react';

export default function WoundDescriptionForm({ onSubmit }) {
  const [description, setDescription] = useState({
    location: '',
    duration: '',
    pain: '5',
    symptoms: [],
    notes: ''
  });

  const symptomOptions = [
    'Bengkak',
    'Kemerahan',
    'Panas',
    'Gatal',
    'Bernanah',
    'Bau tidak sedap'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(description);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lokasi Luka
        </label>
        <input
          type="text"
          value={description.location}
          onChange={(e) => setDescription({ ...description, location: e.target.value })}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Contoh: Kaki kanan bagian telapak"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sudah Berapa Lama?
        </label>
        <input
          type="text"
          value={description.duration}
          onChange={(e) => setDescription({ ...description, duration: e.target.value })}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Contoh: 2 minggu"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tingkat Nyeri (1-10)
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={description.pain}
          onChange={(e) => setDescription({ ...description, pain: e.target.value })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Tidak Sakit</span>
          <span>Sangat Sakit</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gejala yang Dirasakan
        </label>
        <div className="grid grid-cols-2 gap-2">
          {symptomOptions.map((symptom) => (
            <label key={symptom} className="flex items-center">
              <input
                type="checkbox"
                checked={description.symptoms.includes(symptom)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setDescription({
                      ...description,
                      symptoms: [...description.symptoms, symptom]
                    });
                  } else {
                    setDescription({
                      ...description,
                      symptoms: description.symptoms.filter(s => s !== symptom)
                    });
                  }
                }}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catatan Tambahan
        </label>
        <textarea
          value={description.notes}
          onChange={(e) => setDescription({ ...description, notes: e.target.value })}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          rows="3"
          placeholder="Tambahan informasi yang perlu diketahui dokter"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Kirim
        </button>
      </div>
    </form>
  );
}
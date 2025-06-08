"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from "@/app/utils/auth";
import Image from 'next/image';

export default function HistoryPage() {
  const router = useRouter();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.replace('/login');
      return;
    }
    setUser(currentUser);
    fetchUserScans(currentUser.username);
  }, [router]);

  const fetchUserScans = async (username) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/scan?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      if (data.success) {
        // Sort scans by date, newest first
        const sortedScans = data.scans.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setScans(sortedScans);
      } else {
        throw new Error(data.error || 'Failed to fetch scans');
      }
    } catch (error) {
      console.error('Error:', error);
      // You might want to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-800">
          Riwayat Pemeriksaan
        </h1>
        {user && (
          <div className="text-sm text-gray-600">
            Username: <span className="font-medium">{user.username}</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {scans.length > 0 ? (
          scans.map((scan) => (
            <div 
              key={scan._id} 
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              onClick={() => setSelectedScan(selectedScan?._id === scan._id ? null : scan)}
            >
              <div className="flex gap-6">
                {/* Image Section */}
                <div className="w-32 h-32 relative rounded-lg overflow-hidden">
                  <Image
                    src={scan.imageUrl}
                    alt="Wound scan"
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Content Section */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-lg">
                        {new Date(scan.createdAt).toLocaleDateString('id-ID')}
                      </h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      scan.status === 'reviewed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {scan.status === 'reviewed' ? 'Sudah Direview' : 'Menunggu Review'}
                    </span>
                  </div>

                  {/* Basic Info (Always Shown) */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Lokasi:</span>{' '}
                      {scan.description?.location || 'Tidak ditentukan'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Level Nyeri:</span>{' '}
                      {scan.description?.pain || 'Tidak ditentukan'}
                    </p>
                  </div>

                  {/* Review Information - if present */}
                  {scan.status === 'reviewed' && scan.reviewInfo && (
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm mb-2">
                        <span className="font-medium">Diagnosis:</span>{' '}
                        {scan.reviewInfo.diagnosis}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Rekomendasi:</span>{' '}
                        {scan.reviewInfo.recommendation}
                      </p>
                      <p className="text-xs text-gray-500">
                        Direview pada: {new Date(scan.reviewInfo.reviewedAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}

                  {/* Expanded Details */}
                  {selectedScan?._id === scan._id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Durasi:</span>{' '}
                            {scan.description?.duration ? `${scan.description.duration} hari` : 'Tidak ditentukan'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Gejala:</span>{' '}
                            {scan.symptoms?.join(', ') || 'Tidak ada'}
                          </p>
                        </div>
                        <div>
                          {scan.notes && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Catatan:</span>{' '}
                              {scan.notes}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Terakhir Update:</span>{' '}
                            {new Date(scan.updatedAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-500 mb-2">Belum ada riwayat pemeriksaan</div>
            <button
              onClick={() => router.push('/scan')}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Mulai Pemeriksaan Baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
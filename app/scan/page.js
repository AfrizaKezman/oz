"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from "@/app/utils/auth";
import WoundDescriptionForm from '../components/WoundDescriptionForm';

// Add helper function for image URL handling
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  const id = imageUrl.split('/').pop();
  return `/api/images?id=${id}`;
};

export default function ScanPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [step, setStep] = useState(1);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const currentUser = getUser();
        if (!currentUser) {
            router.replace('/login');
            return;
        }
        setUser(currentUser);
    }, [router]);

    const handleImageError = () => {
        console.error('Image failed to load');
        setImageError(true);
    };

    // Update handleImageChange to clean up URLs
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setImage(file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            setImageError(false);
            setStep(2);
        }
    };

   const handleDescriptionSubmit = async (description) => {
        if (!user) {
            alert('Silakan login terlebih dahulu');
            router.push('/login');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', image);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Gagal mengupload gambar');
            const { imageUrl } = await uploadRes.json();

            const scanRes = await fetch('/api/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username,
                    imageUrl,
                    description,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                })
            });

            const data = await scanRes.json();
            if (!data.success) throw new Error(data.error);

            setResult({
                status: 'pending',
                uploadedAt: new Date().toISOString(),
                imageUrl,
                description,
                scanId: data.scanId,
                username: user.username
            });

            setStep(3);

        } catch (error) {
            console.error('Error:', error);
            alert('Gagal mengirim data. Silakan coba lagi.');
        } finally {
            setIsUploading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Pemindaian Luka Diabetes</h1>
                    <p className="text-gray-600">
                        Upload foto luka dan berikan informasi detail untuk mendapatkan analisis dari dokter
                    </p>
                </div>

                {step === 1 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Foto Luka
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                            />
                        </div>
                        {preview && (
                            <div className="mt-4">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="rounded-lg object-contain"
                                />
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <WoundDescriptionForm onSubmit={handleDescriptionSubmit} />
                )}

                {step === 3 && result && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div>
                                <h3 className="font-medium">Menunggu Review Dokter</h3>
                                <p className="text-sm text-gray-500">
                                    Dokter akan memeriksa kondisi luka Anda segera
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                                {!imageError ? (
                                    <img
                                        src={getImageUrl(result.imageUrl)}
                                        alt="Wound Image"
                                        className="w-full h-full object-contain"
                                        onError={handleImageError}
                                        loading="eager"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-400">Gagal memuat gambar</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2">Informasi yang Diberikan</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Lokasi:</span> {result.description.location}</p>
                                    <p><span className="font-medium">Durasi:</span> {result.description.duration}</p>
                                    <p><span className="font-medium">Tingkat Nyeri:</span> {result.description.pain}/10</p>
                                    {result.description.symptoms.length > 0 && (
                                        <p><span className="font-medium">Gejala:</span> {result.description.symptoms.join(', ')}</p>
                                    )}
                                    {result.description.notes && (
                                        <p><span className="font-medium">Catatan:</span> {result.description.notes}</p>
                                    )}
                                </div>
                            </div>

                            <div className="text-center text-sm text-gray-500">
                                <p>ID Pemindaian: {result.scanId}</p>
                                <p>Dikirim pada: {new Date(result.uploadedAt).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
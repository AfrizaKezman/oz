"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUser } from "@/app/utils/auth";
import WoundDescriptionForm from '../components/WoundDescriptionForm';

export default function ScanPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [step, setStep] = useState(1);

    useEffect(() => {
        const currentUser = getUser();
        if (!currentUser) {
            router.replace('/login');
            return;
        }
        setUser(currentUser);
    }, [router]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            setStep(2);
            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    const handleDescriptionSubmit = async (description) => {
        setIsUploading(true);

        try {
            // Upload image
            const formData = new FormData();
            formData.append('file', image);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const uploadData = await uploadRes.json();
            if (!uploadData.success) throw new Error('Gagal upload gambar');

            // Create scan
            const scanData = {
                username: user.username,
                imageUrl: uploadData.imageUrl,
                description,
                status: 'pending'
            };

            const scanRes = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scanData)
            });

            const data = await scanRes.json();
            if (!data.success) throw new Error(data.error);

            // Show result
            setResult({
                ...scanData,
                scanId: data.scanId,
                uploadedAt: new Date()
            });
            setStep(3);

        } catch (error) {
            console.error('Error:', error);
            alert('Gagal mengirim data. Silakan coba lagi.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Pemindaian Luka</h1>

            {step === 1 && (
                <div className="bg-white rounded-lg shadow p-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                    />
                    {preview && (
                        <div className="mt-4">
                            <img 
                                src={preview} 
                                alt="Preview" 
                                className="max-w-full h-auto rounded"
                            />
                        </div>
                    )}
                </div>
            )}

            {step === 2 && (
                <WoundDescriptionForm 
                    onSubmit={handleDescriptionSubmit}
                    isLoading={isUploading}
                />
            )}

            {step === 3 && result && (
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="mb-4">
                        <img 
                            src={result.imageUrl} 
                            alt="Wound" 
                            className="max-w-full h-auto rounded"
                        />
                    </div>
                    <div className="space-y-2">
                        <p>Status: Menunggu review dokter</p>
                        <p>ID: {result.scanId}</p>
                        <p>Waktu: {result.uploadedAt.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
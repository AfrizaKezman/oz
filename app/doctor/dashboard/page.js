"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, requireAuth } from "@/app/utils/auth";
import Image from "next/image";
import ImageModal from "@/app/components/ImageModal";
import ChatWindow from "@/app/components/ChatWindow";
import ScanCard from "@/app/components/ScanCard";

export default function DoctorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('consultations');
  const [consultations, setConsultations] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedScan, setSelectedScan] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser?.role === 'doctor' && requireAuth(router.pathname)) {
      router.replace('/login');
      return;
    }
    fetchData();
  }, [router.pathname, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (activeTab === 'consultations') {
        const res = await fetch('/api/consultations');
        const data = await res.json();
        if (data.success) {
          setConsultations(data.consultations || []);
        } else {
          throw new Error(data.error || 'Failed to fetch consultations');
        }
      } else {
        const res = await fetch('/api/scan/pending');
        const data = await res.json();
        if (data.success) {
          setScans(data.scans || []);
        } else {
          throw new Error(data.error || 'Failed to fetch scans');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedChat) return;

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyMessage.trim(),
          username: selectedChat.username,
          role: 'doctor',
          timestamp: new Date().toISOString()
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyMessage('');
        setConsultations(prev => 
          prev.map(c => c._id === selectedChat._id ? 
            { ...c, messages: data.messages, updatedAt: new Date().toISOString() } : c
          ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        );
        setSelectedChat(prev => ({
          ...prev,
          messages: data.messages,
          updatedAt: new Date().toISOString()
        }));
      } else {
        throw new Error(data.error || 'Failed to send reply');
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  const handleScanReview = async (scan) => {
    if (!diagnosis.trim() || !recommendation.trim()) return;

    try {
      const res = await fetch(`/api/scan/${scan._id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnosis: diagnosis.trim(),
          recommendation: recommendation.trim(),
          reviewedBy: getUser()?.username
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDiagnosis('');
        setRecommendation('');
        setSelectedScan(null);
        setScans(prev => prev.filter(s => s._id !== scan._id));
      } else {
        throw new Error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-purple-800">
          Dashboard Dokter
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'consultations'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Konsultasi
          </button>
          <button
            onClick={() => setActiveTab('scans')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'scans'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Review Scan
          </button>
        </div>
      </div>

      {activeTab === 'consultations' ? (
        <div className="flex gap-4 h-[calc(100vh-200px)]">
          <ChatWindow
            consultations={consultations}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
            handleSendReply={handleSendReply}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scans.map((scan) => (
            <ScanCard
              key={scan._id}
              scan={scan}
              selectedScan={selectedScan}
              setSelectedScan={setSelectedScan}
              setSelectedImage={setSelectedImage}
              diagnosis={diagnosis}
              setDiagnosis={setDiagnosis}
              recommendation={recommendation}
              setRecommendation={setRecommendation}
              handleScanReview={handleScanReview}
            />
          ))}
        </div>
      )}

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
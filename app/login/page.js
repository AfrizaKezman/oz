"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { FaHeartbeat, FaGoogle, FaApple } from 'react-icons/fa'; // Add these imports

// ...existing login and register functions...

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: form.username, 
            password: form.password 
          }),
        });

        const data = await res.json();

        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));

          Swal.fire({
            icon: "success",
            title: `Selamat Datang${data.user.name ? `, ${data.user.name}` : ''}!`,
            text: data.user.role === "doctor" ? "Mengarahkan ke Dashboard Dokter" : "Login berhasil",
            timer: 2000,
            showConfirmButton: false,
            background: '#fff',
            customClass: {
              popup: 'rounded-xl'
            }
          });

          if (data.user.role === "doctor") {
            router.replace("/doctor/dashboard");
          } else {
            router.replace("/");
          }
        } else {
          setMsg(data.error || "Login gagal");
        }
      } else {
        if (form.password !== form.confirmPassword) {
          setMsg("Password dan konfirmasi password tidak cocok");
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: form.username,
            email: form.email, 
            password: form.password 
          }),
        });

        const data = await res.json();

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Registrasi Berhasil!",
            text: "Silakan login dengan akun baru Anda",
            timer: 2000,
            showConfirmButton: false,
            background: '#fff',
            customClass: {
              popup: 'rounded-xl'
            }
          });
          setForm({
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
          });
          setIsLogin(true);
        } else {
          setMsg(data.error || "Registrasi gagal");
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setMsg("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };


  const features = [
    {
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Analisis Cepat & Akurat",
      description: "Hasil analisis luka dalam hitungan menit dengan tingkat akurasi tinggi"
    },
    {
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      title: "Tim Dokter Spesialis",
      description: "Terhubung langsung dengan dokter spesialis berpengalaman"
    },
    {
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      title: "Riwayat Lengkap",
      description: "Pantau perkembangan kesembuhan luka dengan mudah"
    }
  ];


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-800 p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <FaHeartbeat className="w-12 h-12 mr-3 text-white" />
            <h1 className="text-4xl font-bold">DiabScan</h1>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Solusi Pemantauan Luka Diabetes</h2>
            <p className="text-xl text-purple-100">Platform pemindaian dan monitoring luka diabetes yang terintegrasi dengan dokter spesialis.</p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-purple-100 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 border-2 border-white" />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold">1000+ Pengguna Aktif</p>
                <p className="text-purple-200">Bergabung dengan komunitas kami</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full opacity-5 animate-ping"></div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              {isLogin ? "Selamat Datang Kembali!" : "Buat Akun Baru"}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLogin ? "Masuk ke akun Anda" : "Daftar untuk memulai"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Username"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  required
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Konfirmasi Password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    required
                  />
                </div>
              )}
            </div>

            {msg && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:bg-purple-300"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                isLogin ? "Masuk" : "Daftar"
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                {isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
              </button>
            </div>
          </form>
          {/* Trust Indicators */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <FiCheck className="text-green-500" />
              <span>Terverifikasi BPOM</span>
              <span>•</span>
              <span>ISO 27001</span>
              <span>•</span>
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DocumentMagnifyingGlassIcon, ClockIcon, ChatBubbleLeftRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const features = [
  {
    title: "Scan Luka",
    description: "Upload foto luka diabetes untuk mendapatkan analisis secara instan dengan teknologi AI",
    icon: DocumentMagnifyingGlassIcon,
    link: "/scan",
    color: "from-purple-500 to-indigo-600"
  },
  {
    title: "Riwayat",
    description: "Pantau perkembangan kesembuhan luka dengan tracking sistem yang terorganisir",
    icon: ClockIcon,
    link: "/history",
    color: "from-blue-500 to-cyan-600"
  },
  {
    title: "Konsultasi",
    description: "Terhubung langsung dengan dokter spesialis untuk konsultasi profesional",
    icon: ChatBubbleLeftRightIcon,
    link: "/consult",
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "Edukasi",
    description: "Akses materi edukasi komprehensif tentang perawatan luka diabetes",
    icon: BookOpenIcon,
    link: "/education",
    color: "from-orange-500 to-pink-600"
  }
];

const stats = [
  { number: "98%", label: "Tingkat Akurasi" },
  { number: "24/7", label: "Dukungan Online" },
  { number: "1000+", label: "Pengguna Aktif" },
  { number: "50+", label: "Dokter Spesialis" }
];

function FeatureCard({ title, description, icon: Icon, color, onClick }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-2xl bg-white shadow-xl"
      onClick={onClick}
    >
      <div className={`absolute top-0 left-0 h-2 w-full bg-gradient-to-r ${color}`} />
      <div className="p-8">
        <div className="mb-6 h-12 w-12">
          <Icon className="h-12 w-12 text-purple-600" />
        </div>
        <h3 className="mb-4 text-xl font-bold">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function HeroSection({ router }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Teknologi AI untuk
              <span className="text-purple-600"> Monitoring Luka Diabetes</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Solusi inovatif yang menggabungkan kecerdasan buatan dan keahlian medis untuk
              pemantauan dan perawatan luka diabetes yang lebih efektif.
            </p>
              <div className="mt-10 flex items-center gap-x-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/login')}
                  className="rounded-full bg-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Mulai Sekarang
                </motion.button>
                <a href="#features" className="text-lg font-semibold text-purple-600 hover:text-purple-700">
                  Pelajari Lebih Lanjut <span aria-hidden="true">→</span>
                </a>
              </div>
          </motion.div>
          <div className="relative">
            <Image
              src="/iiy.png"
              alt="Dashboard preview"
              width={800}
              height={600}
              className="rounded-2xl shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsSection() {
  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="mx-auto flex max-w-xs flex-col"
            >
              <dt className="text-base leading-7 text-gray-600">{stat.label}</dt>
              <dd className="order-first text-3xl font-bold tracking-tight text-purple-600">
                {stat.number}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="bg-white">
      <HeroSection router={router} />

      <StatsSection />

      <section id="features" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Fitur Unggulan
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Solusi komprehensif untuk monitoring dan perawatan luka diabetes
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                onClick={() => router.push(feature.link)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
"use client";
import { useState } from 'react';
import Image from 'next/image';

const educationContent = [
  {
    id: 1,
    title: "Pengenalan Luka Diabetes",
    description: "Pelajari tentang karakteristik dan tipe-tipe luka diabetes",
    image: "/education/diab1.jpeg",
    category: "Dasar",
    links: [
      {
        title: "Bumame - Kenali Luka Diabetes",
        url: "https://bumame.com/id/news/kenali-luka-diabetes-dan-jenis-perawatannya"
      },
      {
        title: "Persada Hospital - Ciri Luka Diabetes",
        url: "https://persadahospital.co.id/artikel/diabetes/mengenali-ciri-ciri-luka-diabetes-sejak-dini"
      }
    ]
  },
  {
    id: 2,
    title: "Cara Merawat Luka",
    description: "Panduan lengkap perawatan luka diabetes sehari-hari",
    image: "/education/diab2.jpg",
    category: "Perawatan",
    links: [
      {
        title: "Autoimuncare - Tips Merawat Luka",
        url: "https://health.autoimuncare.co.id/diabetes/tips-merawat-luka-diabetes-di-rumah"
      },
      {
        title: "Halodoc - Cara Merawat Luka",
        url: "https://www.halodoc.com/artikel/ini-5-cara-merawat-luka-diabetes-agar-tidak-mengalami-infeksi"
      }
    ]
  },
  {
    id: 3,
    title: "Pencegahan Infeksi",
    description: "Tips dan teknik mencegah infeksi pada luka diabetes",
    image: "/education/diab3.jpg",
    category: "Pencegahan",
    links: [
      {
        title: "Halodoc - Mencegah Infeksi",
        url: "https://www.halodoc.com/artikel/ini-5-cara-merawat-luka-diabetes-agar-tidak-mengalami-infeksi"
      },
      {
        title: "Bugarmedis - Tips Pencegahan",
        url: "https://bugarmedis.net/2024/08/14/tips-mencegah-luka-diabetes-menjadi-infeksi-serius"
      }
    ]
  },
  {
    id: 4,
    title: "Nutrisi untuk Penyembuhan",
    description: "Panduan makanan dan nutrisi untuk mempercepat penyembuhan luka",
    image: "/education/diab4.jpg",
    category: "Perawatan",
    links: [
      {
        title: "Hello Sehat - Nutrisi Penyembuhan",
        url: "https://hellosehat.com/nutrisi/fakta-gizi/makanan-untuk-menyembuhkan-luka"
      },
      {
        title: "IDN Medis - Makanan Penyembuh",
        url: "https://idnmedis.com/makanan-untuk-mempercepat-penyembuhan-luka"
      }
    ]
  },
  {
    id: 5,
    title: "Pemeriksaan Kaki Rutin",
    description: "Cara melakukan pemeriksaan kaki diabetes secara mandiri",
    image: "/education/diab5.jpg",
    category: "Pencegahan",
    links: [
      {
        title: "KlikDokter - Perawatan Kaki",
        url: "https://www.klikdokter.com/info-sehat/diabetes/6-langkah-perawatan-kaki-yang-wajib-dilakukan-penderita-diabetes"
      },
      {
        title: "Hello Sehat - Pemeriksaan Kaki",
        url: "https://hellosehat.com/diabetes/komplikasi-diabetes/pemeriksaan-kaki-diabetes"
      }
    ]
  },
  {
    id: 6,
    title: "Perawatan Kulit Diabetes",
    description: "Tips menjaga kesehatan kulit bagi penderita diabetes",
    image: "/education/diab6.png",
    category: "Perawatan",
    links: [
      {
        title: "Hello Sehat - Perawatan Kulit",
        url: "https://hellosehat.com/diabetes/komplikasi-diabetes/perawatan-kulit-diabetes"
      },
      {
        title: "KlikDokter - Tips Perawatan Kulit",
        url: "https://www.klikdokter.com/info-sehat/diabetes/tips-perawatan-kulit-bagi-penderita-diabetes-tipe-2"
      }
    ]
  },
  {
    id: 7,
    title: "Tanda-tanda Infeksi",
    description: "Mengenali gejala infeksi pada luka diabetes",
    image: "/education/diab7.jpg",
    category: "Dasar",
    links: [
      {
        title: "Alodokter - Luka Diabetes",
        url: "https://www.alodokter.com/luka-diabetes-kenali-penyebab-dan-gejala-yang-mungkin-muncul"
      },
      {
        title: "Kemkes - Tanda Infeksi",
        url: "https://keslan.kemkes.go.id/view_artikel/1970/tanda-tanda-infeksi-pada-luka"
      }
    ]
  },
  {
    id: 8,
    title: "Pemilihan Alas Kaki",
    description: "Panduan memilih sepatu yang tepat untuk diabetes",
    image: "/education/diab8.jpg",
    category: "Pencegahan",
    links: [
      {
        title: "Hello Sehat - Sepatu Diabetes",
        url: "https://hellosehat.com/diabetes/komplikasi-diabetes/manfaat-sepatu-diabetes"
      },
      {
        title: "Darwyn Health - Pemilihan Alas Kaki",
        url: "https://www.darwynhealth.com/hormonal-and-metabolic-health/hormonal-and-metabolic-disorders/diabetes-mellitus/foot-problems-in-diabetes/choosing-the-right-diabetic-footwear-tips-for-comfort-and-protection/?lang=id"
      }
    ]
  },
  {
    id: 9,
    title: "Peralatan Perawatan",
    description: "Mengenal alat-alat untuk perawatan luka diabetes",
    image: "/education/diab9.jpg",
    category: "Dasar",
    links: [
      {
        title: "Perumperindo - Alat Perawatan",
        url: "https://www.perumperindo.co.id/alat-dan-bahan-perawatan-luka"
      },
      {
        title: "Kavacare - Tata Cara Perawatan",
        url: "https://www.kavacare.id/tata-cara-perawatan-luka-diabetes-dan-luka-gangren"
      }
    ]
  }
];

const additionalResources = [
  {
    id: 1,
    icon: "🏥",
    title: "PERKENI",
    description: "Pedoman resmi penanganan diabetes di Indonesia",
    link: "https://www.perkeni.org"
  },
  {
    id: 2,
    icon: "🌐",
    title: "WHO Diabetes",
    description: "Informasi diabetes dari WHO",
    link: "https://www.who.int/health-topics/diabetes"
  },
  {
    id: 3,
    icon: "📱",
    title: "Kementerian Kesehatan",
    description: "Portal resmi Kemenkes untuk diabetes",
    link: "https://www.kemkes.go.id"
  },
  {
    id: 4,
    icon: "📚",
    title: "IDF Atlas",
    description: "Atlas Diabetes International",
    link: "https://diabetesatlas.org"
  }
];

const categories = ["Semua", "Dasar", "Perawatan", "Pencegahan"];

function EducationCard({ content }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative w-full h-48">
        <Image
          src={content.image}
          alt={content.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <span className="text-sm text-purple-600 mb-2 inline-block">
          {content.category}
        </span>
        <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
        <p className="text-gray-600 mb-4">{content.description}</p>
        <div className="space-y-2">
          {content.links.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-purple-600 font-medium hover:text-purple-800 inline-flex items-center"
            >
              {link.title}
              <span className="ml-1">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdditionalResource({ resource }) {
  return (
    <a 
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="text-3xl">{resource.icon}</div>
      <div>
        <h3 className="font-semibold">{resource.title}</h3>
        <p className="text-gray-600">{resource.description}</p>
      </div>
    </a>
  );
}

export default function EducationPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredContent = educationContent.filter(content =>
    activeCategory === "Semua" ? true : content.category === activeCategory
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4 text-purple-800">
          Edukasi Perawatan Luka Diabetes
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Pelajari cara merawat dan mencegah komplikasi luka diabetes dengan panduan dari sumber terpercaya
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map(content => (
          <EducationCard key={content.id} content={content} />
        ))}
      </div>

      <div className="mt-12 bg-purple-50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-purple-800">
          Sumber Referensi Terpercaya
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalResources.map(resource => (
            <AdditionalResource key={resource.id} resource={resource} />
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          * Semua informasi bersumber dari situs kesehatan dan organisasi medis terpercaya.
          Selalu konsultasikan dengan dokter untuk penanganan spesifik kondisi Anda.
        </p>
      </div>
    </div>
  );
}
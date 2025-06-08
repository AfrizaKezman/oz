import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const navigation = {
  solutions: [
    { name: 'Scan Luka', href: '/scan' },
    { name: 'Konsultasi', href: '/consult' },
    { name: 'Edukasi', href: '/education' },
  ],
  company: [
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Tim Kami', href: '/team' },
    { name: 'Karir', href: '/careers' },
    { name: 'Blog', href: '/blog' },
  ],
  legal: [
    { name: 'Kebijakan Privasi', href: '/privacy' },
    { name: 'Syarat & Ketentuan', href: '/terms' },
    { name: 'Kebijakan Cookie', href: '/cookies' },
    { name: 'Lisensi', href: '/license' },
  ],
  social: [
    { name: 'Facebook', icon: FaFacebook, href: '#' },
    { name: 'Twitter', icon: FaTwitter, href: '#' },
    { name: 'Instagram', icon: FaInstagram, href: '#' },
    { name: 'LinkedIn', icon: FaLinkedin, href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-purple-800">DiabScan</h3>
            <p className="text-gray-600 max-w-xs">
              Solusi inovatif pemindaian dan monitoring luka diabetes menggunakan teknologi AI untuk hasil yang lebih akurat.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-purple-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Solusi</h4>
                <ul className="mt-4 space-y-3">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-gray-600 hover:text-purple-800 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h4 className="text-lg font-semibold text-gray-900">Perusahaan</h4>
                <ul className="mt-4 space-y-3">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-gray-600 hover:text-purple-800 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Legal</h4>
                <ul className="mt-4 space-y-3">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-gray-600 hover:text-purple-800 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h4 className="text-lg font-semibold text-gray-900">Kontak</h4>
                <ul className="mt-4 space-y-3">
                  <li className="text-gray-600">
                    <a href="mailto:contact@diabscan.id" className="hover:text-purple-800 transition-colors">
                      contact@diabscan.id
                    </a>
                  </li>
                  <li className="text-gray-600">
                    <a href="tel:+622112345678" className="hover:text-purple-800 transition-colors">
                      (021) 1234-5678
                    </a>
                  </li>
                  <li className="text-gray-600">
                    Jl. Teknologi No. 123<br />
                    Jakarta Selatan, 12180
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} DiabScan. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </div>
    </footer>
  );
}
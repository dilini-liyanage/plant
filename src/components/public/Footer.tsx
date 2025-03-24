import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Linkedin, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2B5540] text-white p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="space-y-4 col-span-2">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-removebg.png"
              alt="Planty"
              width={40}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <p className="text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam
          </p>
          {/* Social Media Links */}
          <div className="flex gap-4">
            <Link href="https://facebook.com" className="hover:opacity-80">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="https://linkedin.com" className="hover:opacity-80">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="https://instagram.com" className="hover:opacity-80">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="https://twitter.com" className="hover:opacity-80">
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-gray-200">
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-200 text-sm font-light">
            <li>
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/plants" className="hover:text-gray-300">
                Plants
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="hover:text-gray-300">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="hover:text-gray-300">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="text-gray-200">
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-200 text-sm font-light">
            <li className="flex items-start gap-2">
              <span>📍</span>
              <span>121 King St, Melbourne den 3000, Australia</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📧</span>
              <a href="mailto:info@example.com" className="hover:text-gray-300">
                info@example.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              <a href="tel:+91999999999" className="hover:text-gray-300">
                +91 999999999
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
        <p>© {new Date().getFullYear()} Plant Nursery. All rights reserved.</p>
      </div>
    </footer>
  );
}

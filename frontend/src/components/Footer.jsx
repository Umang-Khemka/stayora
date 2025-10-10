import React from "react";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo or Brand */}
        <div className="text-xl font-bold">Stayora</div>

        {/* Social Icons */}
        <div className="flex gap-4 text-2xl">
          <a
            href="https://www.instagram.com/khemka_umang/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
          >
            <FaInstagram />
          </a>
          <a
            href="https://github.com/Umang-Khemka"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/umang-khemka-9ab713295/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            <FaLinkedin />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Stayora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

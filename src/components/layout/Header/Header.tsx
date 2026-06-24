"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const Header: React.FC = () => {
  const pathname = usePathname();
  
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSubpage = pathname !== "/";
  const showBackground = scrolled || isSubpage;

  const navLinks = [
    { name: "Works", href: "/projects" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-6 left-6 right-6 z-[100] transition-all duration-300 mx-auto rounded-[20px] max-w-[1500px] ${
        showBackground
          ? "bg-white/30 backdrop-blur-xl border border-black/[0.05] py-3 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
          : "bg-transparent py-4 px-8 border border-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo (Nested PD Vector Logo) */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/assets/Logoblue.png"
            alt="Logo"
            width={36}
            height={36}
            className="h-8 w-auto transform transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[14px] font-sans font-medium tracking-wide transition-all duration-300 px-[16px] py-[8px] rounded-full ${
                  isActive 
                    ? "bg-[#0B1117] text-white shadow-sm" 
                    : "text-[#0B1117]/70 hover:text-[#0B1117] hover:bg-[#0B1117]/5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};


"use client";

import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Apple, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-white pt-20 pb-10 font-sans">
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(#a1a1aa 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-12 text-center  sm:px-12 sm:py-16">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Ready to capture every moment?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-600">
            Join thousands of users who trust Gopo to sort, share, and secure memories in original quality.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="flex items-center justify-center gap-3 rounded-full bg-zinc-900 px-6 py-3.5 font-bold text-white transition hover:bg-black">
              <Apple size={20} className="fill-current" />
              <span>App Store</span>
            </button>
            <button className="flex items-center justify-center gap-3 rounded-full border border-zinc-300 bg-white px-6 py-3.5 font-bold text-zinc-900 transition hover:bg-zinc-100">
              <Play size={20} className="fill-current" />
              <span>Google Play</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 border-b border-zinc-200 pb-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="mb-6 flex items-center gap-2">
              <Image
                src="/G.png"
                alt="Gopo logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="text-2xl font-bold tracking-tight text-zinc-900">Gopo</span>
            </div>
            <p className="mb-6 max-w-sm leading-relaxed text-zinc-600">
              The smartest AI-powered photo sharing platform. Memories stay sorted, secure, and high-quality.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Linkedin} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-zinc-900">Product</h3>
            <ul className="space-y-4">
              <FooterLink href="/services">Services</FooterLink>
              <FooterLink href="/showcase-gallery">Gallery</FooterLink>
              <FooterLink href="/for-photographers">For Photographers</FooterLink>
              <FooterLink href="/how-it-works">How It Works</FooterLink>
              <FooterLink href="/register">Guest Registration</FooterLink>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-zinc-900">Company</h3>
            <ul className="space-y-4">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/login">Admin Login</FooterLink>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-zinc-900">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-zinc-600">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
                <span>
                  123 Innovation Drive, Tech City,
                  <br />
                  Bangalore, India 560001
                </span>
              </li>
              <li className="flex items-center gap-3 text-zinc-600">
                <Mail className="h-5 w-5 shrink-0 text-zinc-500" />
                <span className="cursor-pointer transition-colors hover:text-zinc-900">support@Gopo.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-center text-sm text-zinc-500 md:text-left">
            &copy; {new Date().getFullYear()} Gopo. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-zinc-500">
            <Link href="/privacy" className="transition-colors hover:text-zinc-900">Privacy Policy</Link>
            <Link href="/about" className="transition-colors hover:text-zinc-900">About</Link>
            <Link href="/contact" className="transition-colors hover:text-zinc-900">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="inline-block text-zinc-600 transition-all duration-200 hover:translate-x-1 hover:text-zinc-900">
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon: Icon }) {
  return (
    <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 transition-all duration-300 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white">
      <Icon size={18} />
    </a>
  );
}

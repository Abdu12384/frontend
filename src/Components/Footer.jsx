import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#3d2516] text-[#d8cbc4]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">KBS BAKES</h3>
            <p className="text-sm mb-4">Bringing sweetness to your special moments since 2005. Our passion is creating unforgettable cakes that not only look amazing but taste divine.</p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Facebook size={20} />} />
              <SocialLink href="#" icon={<Instagram size={20} />} />
              <SocialLink href="#" icon={<Twitter size={20} />} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/user/about">About Us</FooterLink>
              <FooterLink href="/user/cakes">Our Cakes</FooterLink>
              <FooterLink href="/user/contact">Contact</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2">123 Bakery Street</p>
              <p className="mb-2">Caketown, CT 12345</p>
              <p className="mb-2">Phone: (555) 123-4567</p>
              <p>Email: kbsbakes@gmail.com</p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t border-[#8b6c5c] pt-8 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} KBSBakes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }) => (
  <li>
    <a href={href} className="hover:text-[#bca89f] transition duration-300">
      {children}
    </a>
  </li>
);

const SocialLink = ({ href, icon }) => (
  <a href={href} className="text-[#d8cbc4] hover:text-[#bca89f] transition duration-300">
    {icon}
  </a>
);

export default Footer;


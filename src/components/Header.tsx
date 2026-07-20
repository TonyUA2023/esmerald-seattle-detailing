"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageSquare } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  onOpenBooking?: () => void;
}

export default function Header({ onOpenBooking }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = (sectionId?: string) => {
    setMenuOpen(false);
    if (sectionId && pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo on the left */}
        <Link href="/" className={styles.logo} title="Esmerald Apex Mobile Detailing">
          <Image 
            src="/logo/logo.png" 
            alt="Esmerald Apex Mobile Detailing Logo" 
            width={40} 
            height={40} 
            className={styles.headerLogoImage}
            priority
          />
          <span className={styles.headerLogoText}>
            Esmerald<span>Apex</span>
          </span>
        </Link>

        {/* Navigation & CTA on the right */}
        <div className={styles.headerRight}>
          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
            <Link 
              href="/" 
              className={`${styles.navItem} ${pathname === '/' ? styles.navItemActive : ''}`}
              onClick={() => handleNavClick('hero')}
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className={`${styles.navItem} ${pathname === '/services' ? styles.navItemActive : ''}`}
              onClick={() => handleNavClick()}
            >
              Services
            </Link>
            <Link 
              href="/gallery" 
              className={`${styles.navItem} ${pathname === '/gallery' ? styles.navItemActive : ''}`}
              onClick={() => handleNavClick()}
            >
              Gallery
            </Link>
            <Link 
              href="/#map" 
              className={styles.navItem}
              onClick={() => handleNavClick('map')}
            >
              Locations
            </Link>
            <a 
              href="sms:+17747477215" 
              onClick={() => setMenuOpen(false)} 
              className={styles.mobileNavSmsLink}
            >
              <MessageSquare size={16} />
              <span>Text: (774) 747-7215</span>
            </a>
            {onOpenBooking && (
              <button 
                onClick={() => { onOpenBooking(); setMenuOpen(false); }} 
                className={styles.mobileNavButton}
              >
                Book Now
              </button>
            )}
          </nav>

          <a href="sms:+17747477215" className={styles.headerSmsButton} title="Send us an SMS text message">
            <MessageSquare size={14} />
            <span>SMS: (774) 747-7215</span>
          </a>

          {onOpenBooking && (
            <button onClick={onOpenBooking} className={styles.headerDesktopButton}>
              Book Now
            </button>
          )}

          <button 
            className={styles.hamburger} 
            onClick={() => setMenuOpen(!menuOpen)} 
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

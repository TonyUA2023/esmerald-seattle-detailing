"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

interface FooterProps {
  onOpenBooking?: () => void;
}

export default function Footer({ onOpenBooking }: FooterProps) {
  return (
    <footer className={styles.footer}>
      {/* Top CTA Band */}
      <div className={styles.footerCtaBand}>
        <div className={styles.footerCtaInner}>
          <h3 className={styles.footerCtaHeadline}>
            Ready for a <span>Showroom Clean</span> Vehicle?
          </h3>
          {onOpenBooking ? (
            <button onClick={onOpenBooking} className={styles.footerCtaBtn}>
              Book Service Now
            </button>
          ) : (
            <Link href="/" className={styles.footerCtaBtn}>
              Book Service Now
            </Link>
          )}
        </div>
      </div>

      {/* Main footer grid */}
      <div className={styles.footerMain}>
        {/* Brand col */}
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.footerLogoContainer}>
            <Image 
              src="/logo/logo.png" 
              alt="Esmerald Apex Mobile Detailing Logo" 
              width={48} 
              height={48} 
              className={styles.footerLogoImage}
            />
            <span className={styles.footerLogoText}>
              Esmerald<span>Apex</span>
            </span>
          </Link>
          <p className={styles.footerDesc}>
            Seattle&apos;s premier mobile car detailing service. Hand car wash, ceramic coating &amp; interior detailing — brought to your home or office.
          </p>
          {/* Contact info */}
          <div className={styles.footerContact}>
            <a href="tel:+17747477215" className={styles.footerContactItem}>
              <Phone size={14} />
              <span>(774) 747-7215</span>
            </a>
            <a href="mailto:customer@esmeraldseattledetail.com" className={styles.footerContactItem}>
              <Mail size={14} />
              <span>customer@esmeraldseattledetail.com</span>
            </a>
            <div className={styles.footerContactItem}>
              <MapPin size={14} />
              <span>Seattle, WA &amp; Eastside</span>
            </div>
          </div>
        </div>

        {/* Services col */}
        <div className={styles.footerCol}>
          <h4 className={styles.footerColTitle}>Services</h4>
          <ul className={styles.footerList}>
            <li><Link href="/services">Full Mobile Detail</Link></li>
            <li><Link href="/services">Exterior Correction</Link></li>
            <li><Link href="/services">Interior Deep Clean</Link></li>
            <li><Link href="/services">Ceramic Coating</Link></li>
            <li><Link href="/services">Hand Car Wash</Link></li>
          </ul>
        </div>

        {/* Service Area col */}
        <div className={styles.footerCol}>
          <h4 className={styles.footerColTitle}>Service Area</h4>
          <ul className={styles.footerList}>
            <li><Link href="/#map">Seattle</Link></li>
            <li><Link href="/#map">Bellevue</Link></li>
            <li><Link href="/#map">Kirkland</Link></li>
            <li><Link href="/#map">Redmond</Link></li>
            <li><Link href="/#map">Renton &amp; Tacoma</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomInner}>
          <p>© {new Date().getFullYear()} Esmerald Apex Mobile Detailing. All rights reserved.</p>
          <div className={styles.footerBottomLinks}>
            <a href="#">Privacy Policy</a>
            <span>·</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

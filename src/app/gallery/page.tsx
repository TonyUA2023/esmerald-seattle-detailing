"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './gallery.module.css';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false });

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const galleryData = [
  {
    id: 1,
    image: '/imagenes/34.png',
    title: 'Exterior Perfection',
    subtitle: 'Two-Bucket Hand Wash & Sealant',
  },
  {
    id: 2,
    image: '/imagenes/18.png',
    title: 'Ceramic Shield',
    subtitle: 'Hydrophobic Glass & Paint Protection',
  },
  {
    id: 3,
    image: '/imagenes/12.png',
    title: 'Showroom Gloss Polish',
    subtitle: 'Paint Swirl & Scratch Reduction',
  },
  {
    id: 4,
    image: '/imagenes/31.png',
    title: 'Cockpit Renewal',
    subtitle: 'Deep Steam & Leather Conditioning',
  },
  {
    id: 5,
    image: '/imagenes/23.png',
    title: 'Precision Detailing',
    subtitle: 'Full Paint Purification & Clay Bar',
  },
  {
    id: 6,
    image: '/imagenes/24.png',
    title: 'Wheel & Tire Armor',
    subtitle: 'Brake Dust Extraction & Satin Dressing',
  },
  {
    id: 7,
    image: '/imagenes/17.png',
    title: 'Interior Steam Disinfection',
    subtitle: 'Full Carpet & Seat Hot Extraction',
  },
  {
    id: 8,
    image: '/detailing_van.png',
    title: '100% Mobile Setup',
    subtitle: 'On-Site Water & Power Supply',
  },
  {
    id: 9,
    image: '/gallery_1.png',
    title: 'Full Vehicle Restoration',
    subtitle: 'Interior & Exterior Premium Package',
  },
  {
    id: 10,
    image: '/work_1.png',
    title: 'Deep Carpet Extraction',
    subtitle: 'Stain Neutralization & Odor Removal',
  },
  {
    id: 11,
    image: '/gallery_2.png',
    title: 'Mirror Gloss Finish',
    subtitle: 'Paint Correction & Ceramic Shield',
  },
  {
    id: 12,
    image: '/work_4.png',
    title: 'Engine Bay Detailing',
    subtitle: 'Safe Degreasing & Protective Dressing',
  }
];

export default function GalleryPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const openBooking = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsBookingOpen(true);
  };

  return (
    <main className={styles.galleryPage}>
      <Header onOpenBooking={() => openBooking()} />

      <section className={styles.hero}>
        <div className={styles.heroBgImageWrapper}>
          <Image 
            src="/imagenes/34.png" 
            alt="Mobile detailing gallery Seattle — car detailing portfolio" 
            fill 
            sizes="100vw" 
            style={{ objectFit: 'cover', objectPosition: 'center' }} 
            priority 
          />
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContainer}>
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <p className={styles.heroEyebrow}>Seattle · Bellevue · Kirkland · Redmond</p>
            <h1 className={styles.heroTitle}>
              Our Detailing <span className={styles.heroAccent}>Gallery</span>
            </h1>
            <div className={styles.heroDivider}></div>
            <p className={styles.heroSubtitle}>
              Browse our portfolio of transformed vehicles. See the premium results of our mobile detailing services firsthand.
            </p>
            <div className={styles.heroCtaGroup}>
              <button onClick={() => openBooking()} className={styles.heroBtnPrimary}>
                Book My Service
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section 
        className={styles.galleryGrid}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {galleryData.map((item) => (
          <motion.div 
            key={item.id} 
            className={styles.galleryItem}
            variants={fadeUp}
            onClick={openBooking}
          >
            <Image 
              src={item.image} 
              alt={item.title}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className={styles.overlay}>
              <div className={styles.overlayContent}>
                <h3 className={styles.overlayTitle}>{item.title}</h3>
                <p className={styles.overlaySubtitle}>{item.subtitle}</p>
                <button 
                  className={styles.bookButton}
                  onClick={openBooking}
                >
                  Book Now
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      <Footer onOpenBooking={() => openBooking()} />

      {isBookingOpen && (
        <BookingModal 
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </main>
  );
}

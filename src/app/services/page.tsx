"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import styles from './services.module.css';
import servicesData from '@/data/services.json';
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
      staggerChildren: 0.15
    }
  }
};

export default function ServicesPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string>('');

  const openBooking = (serviceId: string = '') => {
    setPreselectedServiceId(serviceId);
    setIsBookingOpen(true);
  };

  return (
    <main className={styles.servicesPage}>
      <Header onOpenBooking={() => openBooking('')} />

      <section className={styles.hero}>
        <div className={styles.heroBgImageWrapper}>
          <Image 
            src="/hero_bg_new.png" 
            alt="Mobile detailing services Seattle — professional hand wash and ceramic coating service" 
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
              Our Detailing <span className={styles.heroAccent}>Packages</span>
            </h1>
            <div className={styles.heroDivider}></div>
            <p className={styles.heroSubtitle}>
              Choose from our premium mobile detailing packages designed to restore, protect, and maintain your vehicle&apos;s pristine condition.
            </p>
            <div className={styles.heroCtaGroup}>
              <button onClick={() => openBooking('')} className={styles.heroBtnPrimary}>
                Book My Service
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section 
        className={styles.grid}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {servicesData.map((service) => (
          <motion.div 
            key={service.id} 
            className={`${styles.card} ${service.featured ? styles.cardFeatured : ''}`}
            variants={fadeUp}
          >
            {service.featured && (
              <div className={styles.featuredBadge}>Most Popular</div>
            )}
            
            <div className={styles.imageWrapper}>
              <Image 
                src={service.image} 
                alt={service.name}
                fill
                className={styles.image}
              />
            </div>

            <div className={styles.content}>
              <span className={styles.tag}>{service.tag}</span>
              <h2 className={styles.title}>{service.name}</h2>
              <p className={styles.description}>{service.description}</p>

              <div className={styles.priceStrip}>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Sedan</span>
                  <span className={styles.priceValue}>${service.prices.sedan}</span>
                </div>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Mid-SUV</span>
                  <span className={styles.priceValue}>${service.prices.midSizeSuv}</span>
                </div>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Truck/Van</span>
                  <span className={styles.priceValue}>${service.prices.truckVan}</span>
                </div>
              </div>

              <div className={styles.features}>
                {Array.isArray(service.features) ? (
                  <ul className={styles.featuresList}>
                    {service.features.map((feature, idx) => (
                      <li key={idx} className={styles.featureItem}>
                        <CheckCircle2 size={14} className={styles.featureIcon} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <h4 className={styles.featureCategory}>Exterior</h4>
                    <ul className={styles.featuresList}>
                      {service.features.exterior.map((feature, idx) => (
                        <li key={idx} className={styles.featureItem}>
                          <CheckCircle2 size={14} className={styles.featureIcon} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <h4 className={styles.featureCategory}>Interior</h4>
                    <ul className={styles.featuresList}>
                      {service.features.interior.map((feature, idx) => (
                        <li key={idx} className={styles.featureItem}>
                          <CheckCircle2 size={14} className={styles.featureIcon} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className={styles.footer}>
                <div className={styles.duration}>
                  <Clock size={14} />
                  <span>Est. Time: {service.duration}</span>
                </div>
                <button 
                  onClick={() => openBooking(service.id)} 
                  className={styles.bookButton}
                >
                  Book This Package
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      <Footer onOpenBooking={() => openBooking('')} />

      {isBookingOpen && (
        <BookingModal 
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialServiceId={preselectedServiceId}
          initialVehicleSize="sedan"
        />
      )}
    </main>
  );
}

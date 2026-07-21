/* eslint-disable react/no-unescaped-entities, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Clock, Shield, CheckCircle2, Star, MapPin, Mail, Phone, MessageSquare, Droplets, Sparkles, Car, Menu, X, Check, Maximize, DoorOpen, Disc, Wind, Layers, Home as HomeIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import styles from './page.module.css';
import dynamic from 'next/dynamic';
import servicesData from '@/data/services.json';
import addonsData from '@/data/addons.json';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });
const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false });

const fadeUp: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};



export default function Home() {
  const { register, handleSubmit } = useForm();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullDetailSize, setFullDetailSize] = useState<'sedan' | 'midSizeSuv' | 'truckVan'>('sedan');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string>('');
  const [preselectedVehicleSize, setPreselectedVehicleSize] = useState<'sedan' | 'midSizeSuv' | 'truckVan'>('sedan');

  const openBooking = (serviceId: string = '', vehicleSize: 'sedan' | 'midSizeSuv' | 'truckVan' = 'sedan') => {
    setPreselectedServiceId(serviceId);
    setPreselectedVehicleSize(vehicleSize);
    setIsBookingOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmittingQuote(true);
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send quote request');
      }

      alert("Quote Request Sent! We will contact you shortly to provide your custom quote.");
    } catch (err) {
      console.error('Error submitting quote:', err);
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className={styles.main}>
      <Header onOpenBooking={() => openBooking()} />

      {/* 1. HERO SECTION */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroBgImageWrapper}>
          <Image 
            src="/hero_bg_new.png" 
            alt="Mobile car detailing Seattle — professional hand wash and ceramic coating service" 
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
            className={styles.heroContent}
          >
            <p className={styles.heroEyebrow}>Seattle · Bellevue · Kirkland · Redmond</p>

            <h1 className={styles.heroTitle}>
              Seattle's Premier<br />
              <span className={styles.heroAccent}>Mobile Detailing</span><br />
              Service
            </h1>

            <div className={styles.heroDivider}></div>

            <p className={styles.heroSubtitle}>
              Expert hand car wash, interior &amp; exterior detailing, and ceramic coating — brought directly to your home or office anywhere in the Seattle metro area.
            </p>
            
            <div className={styles.heroCtaGroup}>
              <button onClick={() => openBooking()} className={styles.heroBtnPrimary}>
                Book My Service
              </button>
              <button onClick={() => scrollTo('services')} className={styles.heroBtnSecondary}>
                View Services
              </button>
            </div>
            
            <div className={styles.heroGuaranteeBadge}>
              <Shield size={14} className={styles.heroGuaranteeShield} />
              <span>100% Free Booking &mdash; Pay After Service</span>
            </div>
          </motion.div>
        </div>
      </section>


      {/* TRUST STRIP */}
      <div className={styles.trustStrip}>
        <div className={styles.trustStripInner}>
          <div className={styles.trustItem}>
            <Star size={14} />
            <span>#1 Rated in Seattle</span>
          </div>
          <div className={styles.trustItem}>
            <Car size={14} />
            <span>Interior & Exterior</span>
          </div>
          <div className={styles.trustItem}>
            <HomeIcon size={14} />
            <span>At Your Location</span>
          </div>
          <div className={styles.trustItem}>
            <Shield size={14} />
            <span>Ceramic Coating</span>
          </div>
        </div>
      </div>

      {/* 2. INTRO VALUE PROPOSITIONS */}
      <section className={styles.introValueSection}>
        <div className={styles.introValueGrid}>
          <div className={styles.introValueItem}>
            <div className={styles.introValueIconWrapper}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3>#1 Rated Detailing</h3>
              <p>Transforming vehicles back to showroom condition with unmatched quality.</p>
            </div>
          </div>
          
          <div className={styles.introValueItem}>
            <div className={styles.introValueIconWrapper}>
              <Car size={22} />
            </div>
            <div>
              <h3>Interior / Exterior</h3>
              <p>Meticulous hand cleaning for that like-new shine, highly rated and recommended.</p>
            </div>
          </div>
          
          <div className={styles.introValueItem}>
            <div className={styles.introValueIconWrapper}>
              <HomeIcon size={22} />
            </div>
            <div>
              <h3>At Your Location</h3>
              <p>Convenient automotive detailing completed right at your home or business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FLEET PHILOSOPHY SECTION */}
      <section className={styles.fleetSection}>
        <div className={styles.fleetContainer}>
          {/* Left Column: Visuals */}
          <div className={styles.fleetVisuals}>
            <div className={styles.fleetDecorativeCorner}></div>
            <div className={styles.fleetImageWrapper}>
              <Image 
                src="/work_3.png" 
                alt="Esmerald Mobile Detailing Fleet" 
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.fleetBadgeCard}>
              <span className={styles.fleetBadgeNumber}>100%</span>
              <span className={styles.fleetBadgeText}>MOBILE SERVICE</span>
            </div>
          </div>
          
          {/* Right Column: Content */}
          <div className={styles.fleetContent}>
            <div className={styles.fleetTag}>Fleet Philosophy</div>
            
            <h2 className={styles.fleetTitle}>
              WE BRING THE <br />
              <span className={styles.fleetHighlight}>EXPERIENCE</span>
            </h2>
            
            <p className={styles.fleetParagraph}>
              Esmerald Mobile Detailing was born from a simple realization: <strong>Luxury shouldn't be a logistical nightmare.</strong> We eliminated the shop overhead to invest in the world's most advanced mobile detailing equipment.
            </p>
            
            <blockquote className={styles.fleetQuote}>
              "Our mobile laboratory is equipped with its own power and water filtration system. We are completely self-sufficient, allowing us to perform showroom-grade work anywhere."
            </blockquote>
          </div>
        </div>
      </section>

      {/* 3. PREMIUM FULL DETAIL SECTION */}
      <section id="services" className={styles.signatureFullSection}>
        <div className={styles.signatureFullContainer}>
          <div className={styles.signatureFullHeader}>
            <span className={styles.sectionTag}>Flagship Service</span>
            <h2 className={styles.signatureFullTitle}>Premium Full Detail</h2>
            <p className={styles.signatureFullSubtitle}>
              Our most requested, all-inclusive restoration package. We bring our fully equipped mobile laboratory directly to your driveway to reset your vehicle to showroom-grade perfection.
            </p>
          </div>

          <div className={styles.sigDetailShowcase}>
            {/* Left side: Visual card & highlights */}
            <div className={styles.sigDetailVisuals}>
              <div className={styles.sigDetailImageWrapper}>
                <Image src="/imagenes/18.png" alt="Premium Mobile Detailing Result" fill style={{ objectFit: 'cover' }} />
                <div className={styles.sigDetailBadge}>
                  <Sparkles size={16} />
                  <span>Showroom Shine Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right side: Complete breakdown of the service */}
            <div className={styles.sigDetailContent}>
              <div className={styles.sigDetailPriceContainer}>
                <span className={styles.sigPriceLabel}>Select Vehicle Size</span>
                <div className={styles.sizeTabs}>
                  <button 
                    type="button"
                    className={`${styles.sizeTab} ${fullDetailSize === 'sedan' ? styles.activeSizeTab : ''}`}
                    onClick={() => setFullDetailSize('sedan')}
                  >
                    Sedan
                  </button>
                  <button 
                    type="button"
                    className={`${styles.sizeTab} ${fullDetailSize === 'midSizeSuv' ? styles.activeSizeTab : ''}`}
                    onClick={() => setFullDetailSize('midSizeSuv')}
                  >
                    Mid-Size SUV
                  </button>
                  <button 
                    type="button"
                    className={`${styles.sizeTab} ${fullDetailSize === 'truckVan' ? styles.activeSizeTab : ''}`}
                    onClick={() => setFullDetailSize('truckVan')}
                  >
                    Truck / Van
                  </button>
                </div>
                <div className={styles.sigPriceDisplay}>
                  <span className={styles.sigPriceLabel}>Investment:</span>
                  <span className={styles.sigPriceValue}>
                    ${fullDetailSize === 'sedan' ? '300' : fullDetailSize === 'midSizeSuv' ? '330' : '360'}
                  </span>
                </div>
              </div>
              
              <h3 className={styles.sigDetailContentTitle}>What's Included in This Package</h3>
              
              <div className={styles.sigFeaturesGrid}>
                {/* Exterior Block */}
                <div className={styles.sigFeatureBlock}>
                  <div className={styles.sigFeatureBlockHeader}>
                    <Car size={18} />
                    <h4>Exterior Decontamination & Seal</h4>
                  </div>
                  <ul className={styles.sigFeatureList}>
                    <li><Check size={14} /> Meticulous hand wash & dry</li>
                    <li><Check size={14} /> Clay bar paint decontamination</li>
                    <li><Check size={14} /> Iron particles chemical removal</li>
                    <li><Check size={14} /> Rims, tire deep clean & dressing</li>
                    <li><Check size={14} /> 6-month synthetic sealant shield</li>
                    <li><Check size={14} /> Door & trunk jamb steam wipe</li>
                  </ul>
                </div>

                {/* Interior Block */}
                <div className={styles.sigFeatureBlock}>
                  <div className={styles.sigFeatureBlockHeader}>
                    <Sparkles size={18} />
                    <h4>Interior Sanitation & Refresh</h4>
                  </div>
                  <ul className={styles.sigFeatureList}>
                    <li><Check size={14} /> Hot steam cabin disinfection</li>
                    <li><Check size={14} /> Carpet & seat deep extraction</li>
                    <li><Check size={14} /> Premium leather treatment</li>
                    <li><Check size={14} /> Dash, console & door deep clean</li>
                    <li><Check size={14} /> Glass cleaning inside & out</li>
                    <li><Check size={14} /> Odor neutralizer treatment</li>
                  </ul>
                </div>
              </div>

              <div className={styles.sigDetailCtaGroup}>
                <button onClick={() => openBooking('premium-full-detail', fullDetailSize)} className={styles.sigDetailBtnPrimary}>
                  Book Premium Full Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3B. ADDITIONAL SERVICES SECTION */}
      <section className={styles.additionalPackagesSection}>
        <div className={styles.additionalPackagesContainer}>
          <div className={styles.additionalHeader}>
            <span className={styles.sectionTag}>Other Packages</span>
            <h2 className={styles.additionalTitle}>Need a Specific Focus?</h2>
            <p className={styles.additionalSubtitle}>Choose a tailored package targeting either your exterior paint shine or interior cabin comfort.</p>
          </div>

          <div className={styles.additionalPackagesGrid}>
            {/* Package 1: Signature Interior Detail */}
            <div className={styles.additionalCard}>
              <div className={styles.additionalCardImageWrapper}>
                <Image 
                  src="/imagenes/31.png" 
                  alt="Signature Interior Detail" 
                  fill 
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 500px"
                />
              </div>
              <div className={styles.additionalCardBody}>
                <div className={styles.additionalCardHeader}>
                  <div>
                    <span className={styles.additionalCardTag}>Popular / Interior Focus</span>
                    <h3>Signature Interior Detail</h3>
                  </div>
                </div>
                <p className={styles.additionalCardDesc}>
                  Complete cabin renewal. Focuses on deep extraction, heavy stain removal, steam sterilization of all contact points, and UV surface protection for a clean, odor-free cockpit.
                </p>

                {/* Size-based pricing list */}
                <div className={styles.cardPricingList}>
                  <div className={styles.cardPricingRow}>
                    <span>Sedan</span>
                    <strong>$220</strong>
                  </div>
                  <div className={styles.cardPricingRow}>
                    <span>Mid-Size SUV</span>
                    <strong>$240</strong>
                  </div>
                  <div className={styles.cardPricingRow}>
                    <span>Truck / Van</span>
                    <strong>$265</strong>
                  </div>
                </div>

                <div className={styles.additionalCardFooter}>
                  <ul className={styles.addCardList}>
                    <li><Check size={14} /> Steam carpet & seat disinfection</li>
                    <li><Check size={14} /> Rich leather seat nourishment & conditioning</li>
                    <li><Check size={14} /> Complete interior odor removal & UV shield</li>
                  </ul>
                  <button onClick={() => openBooking('signature-interior-detail')} className={styles.additionalCardBtn}>
                    Book Interior Detail
                  </button>
                </div>
              </div>
            </div>

            {/* Package 2: Signature Exterior Detail */}
            <div className={styles.additionalCard}>
              <div className={styles.additionalCardImageWrapper}>
                <Image 
                  src="/imagenes/23.png" 
                  alt="Signature Exterior Detail" 
                  fill 
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 500px"
                />
              </div>
              <div className={styles.additionalCardBody}>
                <div className={styles.additionalCardHeader}>
                  <div>
                    <span className={styles.additionalCardTag}>Paint Protection / Exterior Focus</span>
                    <h3>Signature Exterior Detail</h3>
                  </div>
                </div>
                <p className={styles.additionalCardDesc}>
                  Professional exterior restoration. Safe hand wash, complete physical and chemical paint decontamination, and premium wax coating to maximize depth, shine, and shield against environmental damage.
                </p>

                {/* Size-based pricing list */}
                <div className={styles.cardPricingList}>
                  <div className={styles.cardPricingRow}>
                    <span>Sedan</span>
                    <strong>$120</strong>
                  </div>
                  <div className={styles.cardPricingRow}>
                    <span>Mid-Size SUV</span>
                    <strong>$150</strong>
                  </div>
                  <div className={styles.cardPricingRow}>
                    <span>Truck / Van</span>
                    <strong>$180</strong>
                  </div>
                </div>

                <div className={styles.additionalCardFooter}>
                  <ul className={styles.addCardList}>
                    <li><Check size={14} /> Clay bar & chemical decontamination</li>
                    <li><Check size={14} /> High-gloss Carnauba wax protection</li>
                    <li><Check size={14} /> Precision rim deep cleaning & tire dressing</li>
                  </ul>
                  <button onClick={() => openBooking('signature-exterior-detail')} className={styles.additionalCardBtn}>
                    Book Exterior Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
          <span className={styles.swipeHint} style={{ marginTop: '1.5rem' }}>← Swipe to view other packages →</span>
        </div>

        {/* Ceramic Upgrade Banner */}
        <div className={styles.ceramicUpgradeBanner}>
          <div className={styles.ceramicBannerContent}>
            <div className={styles.ceramicBadgeIcon}>
              <Shield size={28} />
            </div>
            <div className={styles.ceramicBannerText}>
              <h3>Ceramic Coating Upgrades</h3>
              <p>Add multi-year ceramic protection to any package for unmatched gloss and hydrophobicity.</p>
            </div>
            <button onClick={() => openBooking()} className={styles.ceramicBannerBtn}>
              Book Now
            </button>
          </div>
        </div>
      </section>

      {/* 3C. ADD-ONS SECTION */}
      <section className={styles.addonsSection}>
        <div className={styles.addonsContainer}>
          <div className={styles.addonsHeader}>
            <span className={styles.sectionTag}>À La Carte Options</span>
            <h2 className={styles.addonsTitle}>Ad Ons Carte</h2>
            <p className={styles.addonsSubtitle}>Personalize your detailing package with specialized à la carte additions.</p>
          </div>

          <div className={styles.addonsGrid}>
            {addonsData.map((addon) => (
              <div key={addon.id} className={styles.addonCard}>
                <div className={styles.addonCardHeader}>
                  <div className={styles.addonIconWrapper}>
                    {addon.id === 'aquapel-glass' && <Droplets size={18} />}
                    {addon.id === 'leather-care' && <Sparkles size={18} />}
                    {addon.id === 'spray-wax' && <Sparkles size={18} />}
                    {addon.id === 'engine-dress' && <Car size={18} />}
                    {addon.id === 'pet-hair' && <Layers size={18} />}
                    {addon.id === 'clay-bar-sealant' && <Layers size={18} />}
                    {addon.id === 'mold-removal' && <Shield size={18} />}
                    {addon.id === 'seat-washing' && <Wind size={18} />}
                    {addon.id === 'trim-restore' && <Maximize size={18} />}
                  </div>
                  <div className={styles.addonNameWrapper}>
                    <h3 className={styles.addonName}>{addon.name}</h3>
                    <p className={styles.addonDescription}>{addon.description}</p>
                  </div>
                  <span className={styles.addonPrice}>+${addon.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SERVICES LIST GRID */}
      <section className={styles.servicesListSection}>
        <div>
          <span className={styles.sectionTag} style={{ display: 'block', textAlign: 'center' }}>What We Do</span>
          <h2 className={styles.servicesListTitle}>All Services Offered</h2>
          <p className={styles.servicesListSubtitle}>Every service performed by our expert detailers</p>
          
          <div className={styles.servicesListGrid}>
            <div className={styles.serviceListItem}>
              <Car size={20} className={styles.serviceListIcon} />
              <span>Paint Touch-Up & Scratch Repair</span>
            </div>
            <div className={styles.serviceListItem}>
              <Disc size={20} className={styles.serviceListIcon} />
              <span>Rims, Tires & Tire Treatment</span>
            </div>
            <div className={styles.serviceListItem}>
              <Maximize size={20} className={styles.serviceListIcon} />
              <span>Interior & Exterior Glass</span>
            </div>
            <div className={styles.serviceListItem}>
              <Wind size={20} className={styles.serviceListIcon} />
              <span>Full Interior & Trunk Vacuum</span>
            </div>
            <div className={styles.serviceListItem}>
              <DoorOpen size={20} className={styles.serviceListIcon} />
              <span>Door Jamb Deep Cleaning</span>
            </div>
            <div className={styles.serviceListItem}>
              <Sparkles size={20} className={styles.serviceListIcon} />
              <span>Leather Care & Conditioning</span>
            </div>
            <div className={styles.serviceListItem}>
              <Droplets size={20} className={styles.serviceListIcon} />
              <span>Premium Paint Sealant & Wax</span>
            </div>
            <div className={styles.serviceListItem}>
              <Layers size={20} className={styles.serviceListIcon} />
              <span>Upholstery & Fabric Steam</span>
            </div>
            <div className={styles.serviceListItem}>
              <Shield size={20} className={styles.serviceListIcon} />
              <span>Complete Detailing Services</span>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button onClick={() => openBooking()} className="btn-primary">
              Schedule Your Detailing
            </button>
          </div>
        </div>
      </section>

      {/* 5. STANDARD OF EXCELLENCE */}
      <section className={styles.excellenceSection}>
        <div className={styles.excellenceGrid}>
          <div className={styles.excellenceContent}>
            <span className={styles.sectionTag}>Why Choose Us</span>
            <h2 className={styles.excellenceTitle}>The Standard of Excellence</h2>
            <p className={styles.excellenceText}>We bring the expertise of a high-end detail studio directly to your driveway. Fully equipped with water, power, and premium products — we handle everything while you carry on with your day.</p>
            
            <div className={styles.excellenceChecklist}>
              <div className={styles.excellenceCheckItem}>
                <CheckCircle2 size={20} className={styles.excellenceCheckIcon} />
                <div>
                  <h4>Fully Mobile & Autonomous</h4>
                  <p>We arrive with spot-free water and independent power.</p>
                </div>
              </div>
              <div className={styles.excellenceCheckItem}>
                <CheckCircle2 size={20} className={styles.excellenceCheckIcon} />
                <div>
                  <h4>Premium Products Only</h4>
                  <p>Using industry-leading brands for safe, effective cleaning.</p>
                </div>
              </div>
              <div className={styles.excellenceCheckItem}>
                <CheckCircle2 size={20} className={styles.excellenceCheckIcon} />
                <div>
                  <h4>Punctual & Professional</h4>
                  <p>Clear communication and on-time arrivals, guaranteed.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.excellenceImageWrapper}>
            <Image src="/imagenes/34.png" alt="Excellence in Detailing" fill style={{ objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* 6. GALLERY */}
      <section id="gallery" className={styles.gallerySection}>
        <div className={styles.gallerySectionHeader}>
          <span className={styles.sectionTag}>Our Work</span>
          <h2 className={styles.galleryTitle}>Recent Work Gallery</h2>
          <p className={styles.gallerySubtitle}>A glimpse into the meticulous care we provide for every vehicle.</p>
        </div>
        
        <div className={styles.galleryGrid}>
          <div className={styles.galleryCard}>
            <Image src="/imagenes/34.png" alt="Exterior Perfection" fill style={{ objectFit: 'cover' }} />
            <div className={styles.galleryCardLabel}>Exterior Perfection</div>
          </div>
          <div className={styles.galleryCard}>
            <Image src="/imagenes/18.png" alt="Ceramic Coating Shield" fill style={{ objectFit: 'cover' }} />
            <div className={styles.galleryCardLabel}>Ceramic Shield</div>
          </div>
          <div className={styles.galleryCard}>
            <Image src="/imagenes/31.png" alt="Deep Interior Steam" fill style={{ objectFit: 'cover' }} />
            <div className={styles.galleryCardLabel}>Deep Interior Steam</div>
          </div>
          <div className={styles.galleryCard}>
            <Image src="/imagenes/12.png" alt="Paint Gloss Correction" fill style={{ objectFit: 'cover' }} />
            <div className={styles.galleryCardLabel}>Paint Correction</div>
          </div>
        </div>

        <span className={styles.swipeHint}>← swipe gallery →</span>

        <div style={{ textAlign: 'center', marginTop: '2rem', padding: '0 1.5rem' }}>
          <Link href="/gallery" className={styles.galleryBtnOutline}>
            View Full Gallery
          </Link>
        </div>
      </section>

      {/* 7. REVIEWS */}
      <section id="reviews" className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <span className={styles.sectionTag}>Testimonials</span>
          <h2 className={styles.reviewsTitle}>Highly Rated by Seattle Car Owners</h2>
          <div className={styles.reviewsRatingContainer}>
            <div className={styles.reviewsRatingLarge}>4.9</div>
            <div className={styles.reviewsStarsLarge}>★★★★★</div>
            <div className={styles.reviewsCount}>Based on 88 Google Reviews</div>
          </div>
        </div>
        
        <div className={styles.reviewsContainer}>
          <div className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewAvatar}>HR</div>
              <div>
                <h4>Hector Ray</h4>
                <div className={styles.miniStars}>★★★★★</div>
              </div>
            </div>
            <p>&quot;I highly recommend Fernando — good price and very precise with his work. Will definitely be doing more business 🤝&quot;</p>
          </div>

          <div className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewAvatar}>FM</div>
              <div>
                <h4>Fahad Muzaffar</h4>
                <div className={styles.miniStars}>★★★★★</div>
              </div>
            </div>
            <p>&quot;Excellent experience on my Tesla Y. He took his time to ensure everything was done cleanly and with great attention to detail.&quot;</p>
          </div>

          <div className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewAvatar}>NA</div>
              <div>
                <h4>Naomi Armstrong</h4>
                <div className={styles.miniStars}>★★★★★</div>
              </div>
            </div>
            <p>&quot;Last-minute interior detail — my car was in need of a major refresh. The results were incredible. Highly recommend!&quot;</p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={() => scrollTo('booking')} className={styles.reviewWriteButton}>
            Write a Review
          </button>
        </div>
      </section>

      {/* 8. QUOTE FORM */}
      <section id="booking" className={styles.quoteSection}>
        <div className={styles.quoteContainer}>
          <div className={styles.quoteInfo}>
            <span className={styles.sectionTag}>Fast Estimate</span>
            <h2 className={styles.quoteTitle}>Not sure what you need? Get a quick quote in 60 seconds</h2>
            <p className={styles.quoteSubtitle}>We will recommend the perfect package based on your vehicle size and condition. No upselling, just honest, transparent pricing.</p>
          </div>
          
          <div className={styles.quoteFormCard}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.formRow}>
                <div className={styles.formGroupQuote}>
                  <label>First Name <span className={styles.required}>*</span></label>
                  <input {...register("firstName", { required: true })} className={styles.formQuoteControl} placeholder="John" />
                </div>
                <div className={styles.formGroupQuote}>
                  <label>Last Name <span className={styles.required}>*</span></label>
                  <input {...register("lastName", { required: true })} className={styles.formQuoteControl} placeholder="Doe" />
                </div>
              </div>
              
              <div className={styles.formGroupQuote}>
                <label>Phone <span className={styles.required}>*</span></label>
                <input type="tel" {...register("phone", { required: true })} className={styles.formQuoteControl} placeholder="(774) 747-7215" />
              </div>
              
              <div className={styles.formGroupQuote}>
                <label>Email <span className={styles.required}>*</span></label>
                <input type="email" {...register("email", { required: true })} className={styles.formQuoteControl} placeholder="john@example.com" />
              </div>
              
              <div className={styles.formGroupQuote}>
                <label>How should we contact you? <span className={styles.required}>*</span></label>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabelNative}>
                    <input type="checkbox" {...register("contactCall")} value="CALL" />
                    <span>CALL</span>
                  </label>
                  <label className={styles.checkboxLabelNative}>
                    <input type="checkbox" {...register("contactEmail")} value="EMAIL" />
                    <span>EMAIL</span>
                  </label>
                  <label className={styles.checkboxLabelNative}>
                    <input type="checkbox" {...register("contactSms")} value="SMS" />
                    <span>SMS</span>
                  </label>
                </div>
              </div>
              
              <div className={styles.formGroupQuote}>
                <label>Tell us about your vehicle <span className={styles.required}>*</span></label>
                <textarea {...register("vehicleDetails", { required: true })} className={styles.formQuoteTextarea} placeholder="Year, Make, Model, Condition, and Service"></textarea>
              </div>
              
              <button type="submit" className={styles.quoteSubmitBtn} disabled={isSubmittingQuote} style={{ opacity: isSubmittingQuote ? 0.8 : 1, cursor: isSubmittingQuote ? 'not-allowed' : 'pointer' }}>
                {isSubmittingQuote ? 'SENDING...' : 'GET MY QUOTE'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 9. SERVING AREA MAP */}
      <section id="map" className={styles.areaSection}>
        {/* Header */}
        <div className={styles.areaHeader}>
          <span className={styles.sectionTag}>Service Area</span>
          <h2 className={styles.areaTitle}>
            We <span className={styles.areaTitleAccent}>come to you</span>
          </h2>
          <p className={styles.areaSubtitle}>
            Serving Seattle, Bellevue, Kirkland, Redmond, Renton, Tacoma and surrounding areas.
          </p>
        </div>
        {/* Full-width map */}
        <div className={styles.areaMapWrapper}>
          <MapComponent />
        </div>
      </section>

      {/* 9B. LOCAL SEO COVERAGE AREAS SECTION */}
      <section id="coverage" className={styles.coverageSection}>
        <div className={styles.coverageContainer}>
          <div className={styles.coverageHeader}>
            <span className={styles.sectionTag}>Coverage Area</span>
            <h2 className={styles.coverageTitle}>Seattle & Eastside Mobile Detailing Areas</h2>
            <p className={styles.coverageSubtitle}>
              We bring our premium, self-sufficient mobile car detailing laboratory directly to your home or office in these local service areas.
            </p>
          </div>

          <div className={styles.coverageGrid}>
            {/* Card 1: Seattle */}
            <div className={styles.coverageCard}>
              <h3>Seattle Detailing Services</h3>
              <p>
                Meticulous <strong>mobile car wash</strong>, paint decontamination, and premium <strong>ceramic coating services</strong> brought directly to your home or office in <strong>Capitol Hill</strong>, <strong>Queen Anne</strong>, <strong>Green Lake</strong>, and surrounding Seattle neighborhoods.
              </p>
            </div>

            {/* Card 2: Bellevue */}
            <div className={styles.coverageCard}>
              <h3>Bellevue Auto Detailing</h3>
              <p>
                Showroom-grade <strong>paint correction</strong>, leather seat conditioning, and deep <strong>interior steam sanitation</strong> for luxury sedans, electric vehicles, and family SUVs in <strong>Somerset</strong>, <strong>Meydenbauer</strong>, and <strong>Downtown Bellevue</strong>.
              </p>
            </div>

            {/* Card 3: Kirkland */}
            <div className={styles.coverageCard}>
              <h3>Kirkland Mobile Detailing</h3>
              <p>
                Shielding vehicles from harsh Pacific Northwest rain with high-performance <strong>hydrophobic paint sealants</strong> and water spot removal services along the <strong>Kirkland waterfront</strong>, <strong>Juanita</strong>, and <strong>Rose Hill</strong>.
              </p>
            </div>

            {/* Card 4: Redmond */}
            <div className={styles.coverageCard}>
              <h3>Redmond Car Care</h3>
              <p>
                Completely autonomous detailing vans equipped with <strong>spot-free filtered water</strong> and independent power generators, serving residential driveways and tech campuses in <strong>Redmond</strong>, <strong>Overlake</strong>, and <strong>Education Hill</strong>.
              </p>
            </div>

            {/* Card 5: Renton & Kent */}
            <div className={styles.coverageCard}>
              <h3>Renton & Kent Detailing</h3>
              <p>
                Eco-friendly exterior washing, leather nourishment, door jamb deep cleaning, and full upholstery steam extraction at your convenience in <strong>Renton Highlands</strong>, <strong>Tukwila</strong>, and <strong>Kent</strong>.
              </p>
            </div>

            {/* Card 6: Eastside Specialized Detail */}
            <div className={styles.coverageCard}>
              <h3>Eastside Specialized Detailing</h3>
              <p>
                Premium detailing packages, engine bay cleaning, fabric shampooing, and multi-year <strong>ceramic coating protection</strong> across <strong>Mercer Island</strong>, <strong>Issaquah</strong>, and <strong>Bothell</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenBooking={() => openBooking()} />

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        initialServiceId={preselectedServiceId}
        initialVehicleSize={preselectedVehicleSize}
      />
    </main>
  );
}

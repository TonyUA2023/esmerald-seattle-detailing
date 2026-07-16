"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Clock, Shield, CheckCircle2, Star, MapPin, Mail, Phone, Droplets, Sparkles, Car, Menu, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });


const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Home() {
  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSubmit = (data: any) => {
    if (step < 4) {
      setStep(step + 1);
      setFormData({ ...formData, ...data });
    } else {
      const finalPayload = { ...formData, ...data };
      console.log("Form Submitted:", finalPayload);
      alert("Booking Request Confirmed! We will contact you shortly to confirm your detail.");
      setStep(1);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className={styles.main}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => scrollTo('hero')}>Emerald <span>Detailing</span></div>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <a onClick={() => { scrollTo('hero'); setMenuOpen(false); }}>Home</a>
          <a onClick={() => { scrollTo('services'); setMenuOpen(false); }}>Interior</a>
          <a onClick={() => { scrollTo('services'); setMenuOpen(false); }}>Exterior</a>
          <a onClick={() => { scrollTo('services'); setMenuOpen(false); }}>Full Detailing</a>
          <a onClick={() => { scrollTo('services'); setMenuOpen(false); }}>Ceramic Coating</a>
          <a onClick={() => { scrollTo('map'); setMenuOpen(false); }}>Locations</a>
          <a onClick={() => { scrollTo('booking'); setMenuOpen(false); }}>Contact</a>
          <button onClick={() => { scrollTo('booking'); setMenuOpen(false); }} className={`btn-primary ${styles.mobileNavButton}`} style={{ padding: '0.75rem 2rem', borderRadius: '8px', width: '100%' }}>Get in Touch</button>
        </nav>
        <button onClick={() => scrollTo('booking')} className={`btn-primary ${styles.headerDesktopButton}`} style={{ padding: '0.75rem 2rem', borderRadius: '8px' }}>Get in Touch</button>
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* 1. HERO SECTION (Slanted Split Design) */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroLeft}>
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className={styles.heroContent}
          >
            <div className={styles.rating}>
              <span className={styles.stars}>★★★★★</span>
              <span className={styles.ratingText}>Over 100 Satisfied Customers Trust Us on Google!</span>
            </div>
            <h1 className={styles.heroTitle}>Seattle Auto Detailing – <span>Premium Car Care & Ceramic Coating</span></h1>
            <p className={styles.heroSubtitle}>Make Your Car Look Brand New – Expert Interior & Exterior Detailing with Premium Ceramic Coating. Trusted by 500+ Happy Customers in Seattle & surrounders!</p>
            <button onClick={() => scrollTo('booking')} className="btn-primary" style={{ fontSize: '1.1rem', padding: '1.25rem 2.5rem' }}>
              Book Now – Fast & Easy!
            </button>
          </motion.div>
        </div>
        
        <div className={styles.heroRight}>
          <Image src="/service_interior.png" alt="Premium detailing action" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} priority />
        </div>
      </section>

      {/* 2. HORIZONTAL VALUE PROPOSITION BAR */}
      <section className={styles.valueBarSection}>
        <div className={styles.valueBarGrid}>
          <div className={styles.valueBarItem}>
            <Car size={32} className={styles.valueBarIcon} />
            <h4>Mobile Car Detailing in Seattle</h4>
          </div>
          <div className={styles.valueBarItem}>
            <Sparkles size={32} className={styles.valueBarIcon} />
            <h4>Interior & Exterior Deep Cleaning</h4>
          </div>
          <div className={styles.valueBarItem}>
            <Shield size={32} className={styles.valueBarIcon} />
            <h4>Premium Ceramic Coating</h4>
          </div>
          <div className={styles.valueBarItem}>
            <CheckCircle2 size={32} className={styles.valueBarIcon} />
            <h4>Trusted by 500+ Happy Customers</h4>
          </div>
        </div>
      </section>

      {/* 3. SERVICES (SIDE BY SIDE) */}
      <section id="services" className={styles.servicesSection}>
        <div className={styles.section}>
          <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Premium <span>Packages</span></motion.h2>
          
          {/* Service 1 */}
          <div className={styles.serviceBlock}>
            <motion.div className={styles.serviceContent} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className={styles.serviceFocus}>Maintenance & Refresh</div>
              <h3 className={styles.serviceTitle}>Express Mobile Wash</h3>
              <p className={styles.serviceDesc}>A fast, thorough, and highly effective clean designed to maintain your vehicle's appearance between deeper details. Perfect for weekly or bi-weekly care.</p>
              <ul className={styles.serviceFeatures}>
                <li><Droplets className={styles.featureIcon} size={24} /> Ph-neutral thick foam cannon wash</li>
                <li><Sparkles className={styles.featureIcon} size={24} /> Streak-free window cleaning</li>
                <li><Car className={styles.featureIcon} size={24} /> Interior vacuum and quick wipe down</li>
              </ul>
              <button onClick={() => { setStep(3); scrollTo('booking'); }} className="btn-primary">Book Express Wash</button>
            </motion.div>
            <motion.div className={styles.serviceImageWrapper} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Image src="/service_wash.png" alt="Luxury car getting foam wash" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
            </motion.div>
          </div>

          {/* Service 2 */}
          <div className={styles.serviceBlock}>
            <motion.div className={styles.serviceContent} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className={styles.serviceFocus}>Total Restoration</div>
              <h3 className={styles.serviceTitle}>Complete Interior & Exterior</h3>
              <p className={styles.serviceDesc}>Our most sought-after package. We meticulously clean every inch of your vehicle, inside and out, bringing it back to a factory-fresh feel.</p>
              <ul className={styles.serviceFeatures}>
                <li><Droplets className={styles.featureIcon} size={24} /> Deep carpet shampoo & extraction</li>
                <li><Sparkles className={styles.featureIcon} size={24} /> Leather conditioning & UV protection</li>
                <li><Car className={styles.featureIcon} size={24} /> High-gloss exterior polymer wax</li>
              </ul>
              <button onClick={() => { setStep(3); scrollTo('booking'); }} className="btn-primary">Book Complete Detail</button>
            </motion.div>
            <motion.div className={styles.serviceImageWrapper} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Image src="/service_interior.png" alt="Immaculate luxury car interior" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
            </motion.div>
          </div>

          {/* Service 3 */}
          <div className={styles.serviceBlock}>
            <motion.div className={styles.serviceContent} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className={styles.serviceFocus}>Ultimate Protection</div>
              <h3 className={styles.serviceTitle}>Ceramic Coating & Paint Correction</h3>
              <p className={styles.serviceDesc}>For the discerning owner who demands perfection. We remove swirls and scratches, then seal the paint with a hard ceramic shell lasting years.</p>
              <ul className={styles.serviceFeatures}>
                <li><Sparkles className={styles.featureIcon} size={24} /> Multi-stage machine polishing</li>
                <li><Shield className={styles.featureIcon} size={24} /> 9H Ceramic Coating application</li>
                <li><Car className={styles.featureIcon} size={24} /> Extreme gloss and water repellency</li>
              </ul>
              <button onClick={() => { setStep(3); scrollTo('booking'); }} className="btn-primary">Book Ceramic Coating</button>
            </motion.div>
            <motion.div className={styles.serviceImageWrapper} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Image src="/service_ceramic.png" alt="Ceramic coating applied to car" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
            </motion.div>
          </div>

        </div>
      </section>

      {/* 4. GALLERY */}
      <section id="gallery" className={styles.gallerySection}>
        <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Our <span>Work</span></motion.h2>
        <div className={styles.galleryGrid}>
          <motion.div className={styles.galleryItem} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Image src="/gallery_1.png" alt="Before and after detailing" fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
          </motion.div>
          <motion.div className={styles.galleryItem} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Image src="/gallery_2.png" alt="Gleaming luxury car in Seattle" fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
          </motion.div>
          <motion.div className={styles.galleryItem} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Image src="/gallery_3.png" alt="Clean wheels and tires" fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
          </motion.div>
        </div>
      </section>

      {/* 5. SOCIAL PROOF */}
      <section id="reviews" className={styles.socialProof}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <h2 className={styles.sectionTitle}>Trusted by <span>Seattle Drivers</span></h2>
          <div className={styles.testimonial}>
            <div className={styles.stars}>
              <Star fill="#FFD700" size={32} color="#FFD700" />
              <Star fill="#FFD700" size={32} color="#FFD700" />
              <Star fill="#FFD700" size={32} color="#FFD700" />
              <Star fill="#FFD700" size={32} color="#FFD700" />
              <Star fill="#FFD700" size={32} color="#FFD700" />
            </div>
            <p className={styles.testimonialText}>"Absolutely incredible service. They came to my office in Bellevue and completely transformed my SUV while I was in meetings. The convenience and quality are unmatched."</p>
            <p className={styles.author}>— Sarah T., Bellevue, WA</p>
          </div>
        </motion.div>
      </section>

      {/* 6. BOOKING FUNNEL */}
      <section id="booking" className={styles.bookingSection}>
        <div className={styles.section}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className={styles.sectionTitle}>Book Your <span>Appointment</span></h2>
            <div className={styles.bookingContainer}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className={styles.formStep}>
                      <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Step 1: Contact Info</h3>
                      <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input {...register("name", { required: true })} className={styles.formControl} placeholder="John Doe" />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input type="email" {...register("email", { required: true })} className={styles.formControl} placeholder="john@example.com" />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <input type="tel" {...register("phone", { required: true })} className={styles.formControl} placeholder="(206) 555-0123" />
                      </div>
                      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Continue to Vehicle Details</button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className={styles.formStep}>
                      <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Step 2: Vehicle Information</h3>
                      <div className={styles.formGroup}>
                        <label>Make, Model & Year</label>
                        <input {...register("vehicle", { required: true })} className={styles.formControl} placeholder="e.g. 2022 Tesla Model 3" />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Vehicle Size</label>
                        <select {...register("size", { required: true })} className={styles.formControl}>
                          <option value="sedan">Sedan / Coupe</option>
                          <option value="mid-suv">Mid-Size SUV / Wagon</option>
                          <option value="large-truck">Large SUV / Truck / Minivan</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => setStep(1)} className="btn-primary" style={{ background: '#e0e0e0', color: '#333' }}>Back</button>
                        <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>Select Service</button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className={styles.formStep}>
                      <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Step 3: Choose Package</h3>
                      <div className={styles.formGroup}>
                        <label>Service Package</label>
                        <select {...register("package", { required: true })} className={styles.formControl}>
                          <option value="express">Express Mobile Wash</option>
                          <option value="complete">Complete Interior & Exterior</option>
                          <option value="ceramic">Ceramic Coating & Paint Correction</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => setStep(2)} className="btn-primary" style={{ background: '#e0e0e0', color: '#333' }}>Back</button>
                        <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>Set Location</button>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className={styles.formStep}>
                      <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Step 4: Logistics & Location</h3>
                      <div className={styles.formGroup}>
                        <label>Service Address (Seattle / King County)</label>
                        <input {...register("address", { required: true })} className={styles.formControl} placeholder="123 Main St, Seattle, WA" />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Preferred Date & Time</label>
                        <input type="datetime-local" {...register("datetime", { required: true })} className={styles.formControl} />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => setStep(3)} className="btn-primary" style={{ background: '#e0e0e0', color: '#333' }}>Back</button>
                        <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>Confirm Booking Request</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. SERVICE AREA MAP SECTION */}
      <section id="map" className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <div className={styles.mapInfo}>
            <div className={styles.mapBadge}>Active Service Zones</div>
            <h2 className={styles.mapHeading}>Areas We Serve in <span>King County</span></h2>
            <p className={styles.mapText}>Emerald Mobile Detailing brings premium auto care directly to your home or office. We cover all major neighborhoods near our primary hubs:</p>
            
            <ul className={styles.mapCityList}>
              <li>
                <strong>Seattle:</strong>
                <span>Downtown, Capitol Hill, Ballard, Magnolia, Queen Anne, Green Lake</span>
              </li>
              <li>
                <strong>Bellevue:</strong>
                <span>Downtown, Medina, Somerset, Mercer Island, Factoria</span>
              </li>
              <li>
                <strong>Redmond:</strong>
                <span>Downtown, Education Hill, Overlake, Union Hill</span>
              </li>
              <li>
                <strong>Kirkland:</strong>
                <span>Downtown, Juanita, Kingsgate, Totem Lake</span>
              </li>
            </ul>
            
            <div className={styles.mapNote}>
              <MapPin className={styles.mapNoteIcon} size={20} />
              <span>Outside these zones? Contact us to see if we can accommodate your location.</span>
            </div>
          </div>
          
          <div className={styles.mapVisualWrapper}>
            <MapComponent />
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <h3 className={styles.footerTitle}>Emerald <span>Detailing</span></h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Premium mobile car detailing serving the greater Seattle area. Showroom quality delivered to your driveway.
            </p>
          </div>
          <div>
            <h3 className={styles.footerTitle}>Contact Us</h3>
            <ul className={styles.footerList}>
              <li><Phone size={18} className={styles.featureIcon} /> (206) 555-0199</li>
              <li><Mail size={18} className={styles.featureIcon} /> booking@esmeraldseattledetail.com</li>
            </ul>
          </div>
          <div>
            <h3 className={styles.footerTitle}>Service Areas</h3>
            <ul className={styles.footerList}>
              <li><MapPin size={18} className={styles.featureIcon} /> Seattle</li>
              <li><MapPin size={18} className={styles.featureIcon} /> Bellevue</li>
              <li><MapPin size={18} className={styles.featureIcon} /> Redmond</li>
              <li><MapPin size={18} className={styles.featureIcon} /> Kirkland</li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Emerald Mobile Detailing. All rights reserved. | <a href="#">Privacy Policy</a></p>
        </div>
      </footer>
    </main>
  );
}

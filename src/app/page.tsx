"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Clock, Shield, CheckCircle2, Star, MapPin, Mail, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import styles from './page.module.css';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

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

  return (
    <main className={styles.main}>
      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <motion.div 
          className={styles.heroVideo}
          animate={{ scale: 1.05 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        >
          <Image 
            src="/hero_bg.png" 
            alt="Water beading on ceramic coated car" 
            fill 
            style={{ objectFit: 'cover' }}
            priority
          />
        </motion.div>
        <div className={styles.heroOverlay}></div>
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <h1 className={styles.heroTitle}>Premium Mobile Car Detailing in Seattle: Showroom Quality in Your Driveway</h1>
          <p className={styles.heroSubtitle}>Busy professionals and families: we restore your vehicle's shine and value without you leaving your home or office. Top-rated auto detailing near you.</p>
          <button onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary" style={{ fontSize: '1.25rem', padding: '1.25rem 3rem' }}>
            Book My Detail Now
          </button>
        </motion.div>
      </section>

      {/* 2. VALUE PROPOSITION */}
      <section className={styles.section}>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <h2 className={styles.sectionTitle}>Your Problems Solved</h2>
          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}><Clock size={48} strokeWidth={1.5} /></div>
              <h3 className={styles.valueTitle}>Save Time</h3>
              <p className={styles.valueDesc}>We bring the best mobile car wash directly to your Seattle or Bellevue location.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}><Shield size={48} strokeWidth={1.5} /></div>
              <h3 className={styles.valueTitle}>Protect Your Investment</h3>
              <p className={styles.valueDesc}>Specialized deep cleaning and long-lasting ceramic coatings.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}><CheckCircle2 size={48} strokeWidth={1.5} /></div>
              <h3 className={styles.valueTitle}>Corporate Guarantee</h3>
              <p className={styles.valueDesc}>Fully insured, highly trained auto detailers.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. SERVICES & PACKAGES */}
      <section className={styles.servicesSection}>
        <div className={styles.section}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className={styles.sectionTitle}>Services & Packages</h2>
            <div className={styles.servicesGrid}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceFocus}>Maintenance / Quick Clean</div>
                <h3 className={styles.serviceTitle}>Express Mobile Wash</h3>
                <p style={{ marginBottom: '2rem', flexGrow: 1, color: 'var(--color-text-muted)' }}>A thorough exterior hand wash and quick interior vacuum to keep your car looking fresh between deep cleans.</p>
                <button onClick={() => { setStep(3); document.getElementById('booking')?.scrollIntoView(); }} className="btn-primary">View Package Details</button>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceFocus}>Deep Interior & Wax</div>
                <h3 className={styles.serviceTitle}>Complete Interior & Exterior</h3>
                <p style={{ marginBottom: '2rem', flexGrow: 1, color: 'var(--color-text-muted)' }}>Our most popular package. Deep interior steam cleaning, leather conditioning, and a high-gloss exterior wax.</p>
                <button onClick={() => { setStep(3); document.getElementById('booking')?.scrollIntoView(); }} className="btn-primary">View Package Details</button>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceFocus}>Luxury & Protection</div>
                <h3 className={styles.serviceTitle}>Ceramic Coating & Paint Correction</h3>
                <p style={{ marginBottom: '2rem', flexGrow: 1, color: 'var(--color-text-muted)' }}>Flawless paint restoration and years of protection with our premium grade ceramic coating.</p>
                <button onClick={() => { setStep(3); document.getElementById('booking')?.scrollIntoView(); }} className="btn-primary">View Package Details</button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. SOCIAL PROOF */}
      <section className={styles.socialProof}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <h2 className={styles.sectionTitle}>Why Seattle Drivers Trust Emerald Mobile Detailing</h2>
          <div className={styles.testimonial}>
            <div className={styles.stars}>
              <Star fill="#FFD700" size={24} color="#FFD700" />
              <Star fill="#FFD700" size={24} color="#FFD700" />
              <Star fill="#FFD700" size={24} color="#FFD700" />
              <Star fill="#FFD700" size={24} color="#FFD700" />
              <Star fill="#FFD700" size={24} color="#FFD700" />
            </div>
            <p className={styles.testimonialText}>"Absolutely incredible service. They came to my office in Bellevue and completely transformed my SUV while I was in meetings. The convenience and quality are unmatched."</p>
            <p className={styles.author}>— Sarah T., Bellevue, WA</p>
          </div>
        </motion.div>
      </section>

      {/* 5. BOOKING FUNNEL */}
      <section id="booking" className={styles.bookingSection}>
        <div className={styles.section}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className={styles.sectionTitle}>Book Your Appointment</h2>
            <div className={styles.bookingContainer}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className={styles.formStep}>
                      <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Step 1: Contact Info</h3>
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
                      <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Step 2: Vehicle Information</h3>
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
                      <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Step 3: Choose Package</h3>
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
                      <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Step 4: Logistics & Location</h3>
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

      {/* 6. FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <h3 className={styles.footerTitle}>Emerald Mobile Detailing</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
              Premium mobile car detailing serving the greater Seattle area. Showroom quality delivered to your driveway.
            </p>
          </div>
          <div>
            <h3 className={styles.footerTitle}>Contact Us</h3>
            <ul className={styles.footerList}>
              <li><Phone size={18} /> (206) 555-0199</li>
              <li><Mail size={18} /> booking@esmeraldseattledetail.com</li>
            </ul>
          </div>
          <div>
            <h3 className={styles.footerTitle}>Service Areas</h3>
            <ul className={styles.footerList}>
              <li><MapPin size={18} /> Seattle</li>
              <li><MapPin size={18} /> Bellevue</li>
              <li><MapPin size={18} /> Redmond</li>
              <li><MapPin size={18} /> Kirkland</li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Emerald Mobile Detailing. All rights reserved. | <a href="#" style={{ textDecoration: 'underline', color: 'rgba(255,255,255,0.7)' }}>Privacy Policy</a></p>
        </div>
      </footer>
    </main>
  );
}

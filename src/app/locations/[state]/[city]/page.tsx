import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locations } from '@/data/locations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Shield, Star, Car, Home as HomeIcon, CheckCircle2, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface LocationPageProps {
  params: Promise<{
    state: string;
    city: string;
  }>;
}

// Generate static params for all known locations at build time for better performance
export async function generateStaticParams() {
  return locations.map((loc) => ({
    state: loc.state,
    city: loc.city,
  }));
}

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const location = locations.find(
    (loc) => loc.state === resolvedParams.state && loc.city === resolvedParams.city
  );

  if (!location) {
    return {
      title: 'Location Not Found - Esmerald Apex Mobile Detailing',
    };
  }

  const title = `Mobile Auto Detailing in ${location.cityName}, ${location.stateName} | Esmerald Apex`;
  const description = `Top-rated mobile car detailing, hand wash, and ceramic coating services in ${location.cityName}, ${location.stateName}. We bring our fully equipped van directly to your home or office. Book today!`;
  const url = `https://esmeraldseattledetail.com/locations/${location.state}/${location.city}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Esmerald Mobile Detailing',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const resolvedParams = await params;
  const location = locations.find(
    (loc) => loc.state === resolvedParams.state && loc.city === resolvedParams.city
  );

  if (!location) {
    notFound();
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '120px 5% 80px', 
        backgroundColor: '#0a0a0a', 
        color: '#fff',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.4 }}>
           <Image 
            src="/hero_bg_new.png" 
            alt={`Mobile detailing in ${location.cityName}`}
            fill 
            style={{ objectFit: 'cover', objectPosition: 'center' }} 
            priority 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.5))' }} />
        </div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#00e5ff', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', fontSize: '0.85rem' }}>
            Serving {location.cityName}, {location.stateName}
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', fontFamily: 'var(--font-title)' }}>
            Premium Mobile <br /> Auto Detailing in <span style={{ color: '#00e5ff' }}>{location.cityName}</span>
          </h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6, color: '#ccc', marginBottom: '2.5rem' }}>
            Expert hand car wash, interior & exterior detailing, and ceramic coating — brought directly to your home or office anywhere in {location.cityName}, {location.stateName}.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ padding: '1rem 2rem', backgroundColor: '#00e5ff', color: '#000', fontWeight: 700, borderRadius: '4px', textDecoration: 'none' }}>
              Book Your Service
            </Link>
            <Link href="/#services" style={{ padding: '1rem 2rem', backgroundColor: 'transparent', border: '1px solid #fff', color: '#fff', fontWeight: 600, borderRadius: '4px', textDecoration: 'none' }}>
              View Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Local Content Section */}
      <section style={{ padding: '80px 5%', backgroundColor: '#fff', color: '#111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'var(--font-title)' }}>
              Why Choose Our {location.cityName} Detailers?
            </h2>
            <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              We understand that your vehicle is an investment. Our mobile detailing units in <strong>{location.cityName}</strong> are fully equipped with spot-free water and independent power, meaning we can perform showroom-quality restoration anywhere—whether you're at work or parked in your driveway.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}><CheckCircle2 color="#00e5ff" size={20} /> #1 Rated Mobile Service in {location.cityName}</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}><CheckCircle2 color="#00e5ff" size={20} /> 100% Self-Sufficient Mobile Units</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}><CheckCircle2 color="#00e5ff" size={20} /> Premium Products & Ceramic Coatings</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}><CheckCircle2 color="#00e5ff" size={20} /> Satisfaction Guaranteed</li>
            </ul>
          </div>
          
          <div style={{ backgroundColor: '#f9f9f9', padding: '3rem', borderRadius: '12px', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>Our Core Services</h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: '#e0f7fa', padding: '0.75rem', borderRadius: '8px', color: '#00bcd4' }}>
                  <Sparkles size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Full Mobile Detail</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Comprehensive interior & exterior restoration.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: '#e0f7fa', padding: '0.75rem', borderRadius: '8px', color: '#00bcd4' }}>
                  <Car size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Exterior & Paint Correction</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Remove swirls and protect your clear coat.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: '#e0f7fa', padding: '0.75rem', borderRadius: '8px', color: '#00bcd4' }}>
                  <Shield size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Ceramic Coating</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Multi-year protection and incredible gloss.</p>
                </div>
              </div>
            </div>
            
            <Link href="/#services" style={{ display: 'block', textAlign: 'center', marginTop: '2rem', color: '#00bcd4', fontWeight: 600, textDecoration: 'none' }}>
              View All Services & Pricing &rarr;
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

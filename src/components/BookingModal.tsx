/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, Shield, Info, MapPin, Mail, Phone, User, FileText, Droplets, Sparkles, Car 
} from 'lucide-react';
import servicesData from '@/data/services.json';
import addonsData from '@/data/addons.json';
import styles from './BookingModal.module.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialVehicleSize?: 'sedan' | 'midSizeSuv' | 'truckVan';
}

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  prices: {
    sedan: number;
    midSizeSuv: number;
    truckVan: number;
  };
  duration: string;
  image?: string;
}

interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
}

export default function BookingModal({ 
  isOpen, 
  onClose, 
  initialServiceId = '',
  initialVehicleSize = 'sedan'
}: BookingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [confirmed, setConfirmed] = useState(false);
  
  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [selectedVehicleSize, setSelectedVehicleSize] = useState<'sedan' | 'midSizeSuv' | 'truckVan'>(initialVehicleSize);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  // Date & Time State
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  // Water & Electricity State
  const [hasWaterAccess, setHasWaterAccess] = useState<'yes' | 'no' | null>(null);
  const [hasPowerAccess, setHasPowerAccess] = useState<'yes' | 'no' | null>(null);

  // Customer Details State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Hydration prevention
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedServiceId(initialServiceId);
      setSelectedVehicleSize(initialVehicleSize);
      setStep(1);
      setConfirmed(false);
      
      // Auto-set default date (tomorrow)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow);
      setCurrentMonth(tomorrow);
      setSelectedTimeSlot(null);
      setHasWaterAccess(null);
      setHasPowerAccess(null);
      setErrors({});
    }
  }, [isOpen, initialServiceId, initialVehicleSize]);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  // Retrieve current configurations
  const services = servicesData as ServicePackage[];
  const addons = addonsData as Addon[];
  const currentService = services.find(s => s.id === selectedServiceId) || null;
  
  const basePrice = currentService ? currentService.prices[selectedVehicleSize] : 0;
  const selectedAddonsDetails = addons.filter(addon => selectedAddons.includes(addon.id));
  const addonsTotal = selectedAddonsDetails.reduce((sum, addon) => sum + addon.price, 0);
  const subtotal = basePrice + addonsTotal;
  const total = subtotal;

  // Step 1 Validation
  const handleNextFromStep1 = () => {
    if (!selectedServiceId) {
      setErrors({ step1: 'Please select a detailing package.' });
      return;
    }
    if (!selectedVehicleSize) {
      setErrors({ step1: 'Please select your vehicle size.' });
      return;
    }
    setErrors({});
    setStep(2);
  };

  // Step 2 Validation
  const handleNextFromStep2 = () => {
    const step2Errors: { [key: string]: string } = {};
    if (!selectedDate) step2Errors.date = 'Please select an appointment date.';
    if (!selectedTimeSlot) step2Errors.time = 'Please select a preferred arrival window.';
    if (hasWaterAccess === null) step2Errors.water = 'Please select if you have access to a water connection.';
    if (hasPowerAccess === null) step2Errors.power = 'Please select if you have access to electricity.';

    if (Object.keys(step2Errors).length > 0) {
      setErrors(step2Errors);
      return;
    }
    setErrors({});
    setStep(3);
  };

  // Step 3 Validation & Submit
  const handleConfirmBooking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const step3Errors: { [key: string]: string } = {};
    if (!firstName.trim()) step3Errors.firstName = 'First name is required.';
    if (!lastName.trim()) step3Errors.lastName = 'Last name is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) step3Errors.email = 'A valid email is required.';
    if (!phone.trim() || phone.length < 7) step3Errors.phone = 'A valid cell phone number is required.';
    if (!address.trim()) step3Errors.address = 'Service location address is required.';

    if (Object.keys(step3Errors).length > 0) {
      setErrors(step3Errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          address,
          notes,
          packageName: currentService?.name || selectedServiceId,
          vehicleSize: selectedVehicleSize,
          addons: selectedAddonsDetails.map(addon => ({ name: addon.name, price: addon.price })),
          date: selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
          timeSlot: selectedTimeSlot || '',
          hasWaterAccess: hasWaterAccess === 'yes' ? 'Spigot Connection' : 'Van Pure Water Tanks',
          hasPowerAccess: hasPowerAccess === 'yes' ? 'Property Outlet' : 'Van Quiet Generator',
          total: total.toFixed(2),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        let errorMessage = errData.error || 'Failed to submit booking request.';
        if (errData.details) {
          try {
            const parsedDetails = JSON.parse(errData.details);
            if (parsedDetails.message) {
              errorMessage = `${errorMessage} (${parsedDetails.message})`;
            } else {
              errorMessage = `${errorMessage} (${errData.details})`;
            }
          } catch {
            errorMessage = `${errorMessage} (${errData.details})`;
          }
        }
        throw new Error(errorMessage);
      }

      setConfirmed(true);
    } catch (err: any) {
      console.error('Error submitting booking:', err);
      setErrors({ submit: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar math helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    const today = new Date();
    // Don't go past current month
    if (newMonth.getMonth() >= today.getMonth() || newMonth.getFullYear() > today.getFullYear()) {
      setCurrentMonth(newMonth);
    }
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const onDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (date >= today) {
      setSelectedDate(date);
      setSelectedTimeSlot(null); // Reset time selection on date change
    }
  };

  // Hourly slot configurations (8:00 AM to 10:00 PM)
  const morningSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'];
  const afternoonSlots = ['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  const nightSlots = ['06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'];

  const isSlotDisabled = (slot: string) => {
    if (!selectedDate) return false;
    
    const today = new Date();
    const isToday = selectedDate.getDate() === today.getDate() &&
                    selectedDate.getMonth() === today.getMonth() &&
                    selectedDate.getFullYear() === today.getFullYear();
    
    if (!isToday) return false;
    
    const [time, modifier] = slot.split(' ');
    let [hours] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    
    // Disable if slot hour is past the current hour
    return hours <= today.getHours();
  };

  // Generate calendar days array
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentMonth);
  const calendarDays = [];
  
  // Pad the start with empty spaces
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Format date readable
  const formatDateString = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const monthYearString = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Addon selection handler
  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId) 
        : [...prev, addonId]
    );
  };

  return (
    <AnimatePresence>
      <div className={styles.modalOverlay}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.backdrop}
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={styles.modalWrapper}
          ref={modalRef}
        >
          {/* Modal Header */}
          <div className={styles.modalHeader}>
            <div className={styles.brandTitle}>
              <span className={styles.brandEmerald}>Esmerald</span>
              <span className={styles.brandApex}>Apex</span>
              <span className={styles.brandSubtitle}>Mobile Detailing</span>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close booking">
              <X size={20} />
            </button>
          </div>

          {!confirmed ? (
            <div className={styles.modalBodyGrid}>
              
              {/* Left Column: Flow & Forms */}
              <div className={styles.mainFlowContainer}>
                
                {/* Visual Step Indicator */}
                <div className={styles.stepProgressContainer}>
                  <div className={styles.progressTrack}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />
                  </div>
                  <div className={styles.progressSteps}>
                    <div className={`${styles.progressStep} ${step >= 1 ? styles.stepActive : ''}`}>
                      <div className={styles.stepCircle}>
                        {step > 1 ? <Check size={14} /> : 1}
                      </div>
                      <span className={styles.stepLabel}>Service &amp; Add-ons</span>
                    </div>
                    
                    <div className={`${styles.progressStep} ${step >= 2 ? styles.stepActive : ''}`}>
                      <div className={styles.stepCircle}>
                        {step > 2 ? <Check size={14} /> : 2}
                      </div>
                      <span className={styles.stepLabel}>Date &amp; Time</span>
                    </div>
                    
                    <div className={`${styles.progressStep} ${step >= 3 ? styles.stepActive : ''}`}>
                      <div className={styles.stepCircle}>
                        {step > 3 ? <Check size={14} /> : 3}
                      </div>
                      <span className={styles.stepLabel}>Your Details</span>
                    </div>
                  </div>
                </div>

                <div className={styles.stepContentScroll}>
                  
                  {/* STEP 1: SERVICES, VEHICLE SIZE & ADD-ONS */}
                  {step === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={styles.stepWrapper}
                    >
                      <h2 className={styles.stepHeading}>Select Service Package</h2>
                      <p className={styles.stepSubheading}>Choose the detailing service that fits your vehicle&apos;s needs.</p>
                      
                      {/* Package grid */}
                      <div className={`${styles.serviceCardsGrid} ${selectedServiceId ? styles.serviceCardsGridCollapsed : ''}`}>
                        {services.map((service) => {
                          const isSelected = selectedServiceId === service.id;
                          return (
                            <div 
                              key={service.id}
                              className={`${styles.serviceCard} ${isSelected ? styles.serviceCardSelected : ''} ${!isSelected && selectedServiceId ? styles.serviceCardHidden : ''}`}
                              onClick={() => {
                                setSelectedServiceId(service.id);
                                setErrors({});
                              }}
                            >
                              <div className={styles.serviceCardHeader}>
                                <div className={styles.serviceSelectRadio}>
                                  <div className={`${styles.radioButton} ${isSelected ? styles.radioChecked : ''}`}>
                                    {isSelected && <div className={styles.radioInner} />}
                                  </div>
                                </div>
                                <div className={styles.serviceInfoShort}>
                                  <h3 className={styles.serviceName}>{service.name}</h3>
                                  <p className={styles.serviceDuration}>
                                    <Clock size={12} /> {service.duration}
                                  </p>
                                </div>
                                {isSelected && selectedServiceId && (
                                  <button 
                                    type="button" 
                                    className={styles.changeServiceBtn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedServiceId('');
                                    }}
                                  >
                                    Change
                                  </button>
                                )}
                              </div>
                              <div className={styles.serviceCardDetailsCollapse}>
                                <p className={styles.serviceDesc}>{service.description}</p>
                                
                                <div className={styles.servicePriceMatrix}>
                                  <span>Prices:</span>
                                  <div className={styles.miniPriceGrid}>
                                    <div>Sedan: <strong>${service.prices.sedan}</strong></div>
                                    <div>SUV: <strong>${service.prices.midSizeSuv}</strong></div>
                                    <div>Truck: <strong>${service.prices.truckVan}</strong></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Dynamic Vehicle Size Selector */}
                      {selectedServiceId && (
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={styles.vehicleSizeSection}
                        >
                          <div className={styles.dividerLine} />
                          <h3 className={styles.sectionHeading}>Select Vehicle Size</h3>
                          <p className={styles.sectionSubheading}>Pricing adjusts dynamically based on the volume of the vehicle.</p>
                          
                          <div className={styles.sizeCardsGrid}>
                            <div 
                              className={`${styles.sizeCard} ${selectedVehicleSize === 'sedan' ? styles.sizeCardSelected : ''}`}
                              onClick={() => setSelectedVehicleSize('sedan')}
                            >
                              <Car size={24} className={styles.sizeIcon} />
                              <div className={styles.sizeName}>Sedan / Coupe</div>
                              <div className={styles.sizePriceTag}>${currentService?.prices.sedan}</div>
                            </div>
                            
                            <div 
                              className={`${styles.sizeCard} ${selectedVehicleSize === 'midSizeSuv' ? styles.sizeCardSelected : ''}`}
                              onClick={() => setSelectedVehicleSize('midSizeSuv')}
                            >
                              <Car size={26} className={styles.sizeIcon} />
                              <div className={styles.sizeName}>Mid-Size SUV</div>
                              <div className={styles.sizePriceTag}>${currentService?.prices.midSizeSuv}</div>
                            </div>
                            
                            <div 
                              className={`${styles.sizeCard} ${selectedVehicleSize === 'truckVan' ? styles.sizeCardSelected : ''}`}
                              onClick={() => setSelectedVehicleSize('truckVan')}
                            >
                              <Car size={28} className={styles.sizeIcon} />
                              <div className={styles.sizeName}>Truck / Van / 3-Row</div>
                              <div className={styles.sizePriceTag}>${currentService?.prices.truckVan}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Add-ons Section */}
                      {selectedServiceId && selectedVehicleSize && (
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={styles.addonsSection}
                        >
                          <div className={styles.dividerLine} />
                          <h3 className={styles.sectionHeading}>À La Carte Add-ons (Optional)</h3>
                          <p className={styles.sectionSubheading}>Upgrade your appointment with highly specialized detailing treatments.</p>
                          
                          <div className={styles.addonsListGrid}>
                            {addons.map((addon) => {
                              const isChecked = selectedAddons.includes(addon.id);
                              return (
                                <div 
                                  key={addon.id}
                                  className={`${styles.addonItemCard} ${isChecked ? styles.addonItemChecked : ''}`}
                                  onClick={() => toggleAddon(addon.id)}
                                >
                                  <div className={styles.addonLeft}>
                                    <div className={`${styles.addonCheckbox} ${isChecked ? styles.checkboxChecked : ''}`}>
                                      {isChecked && <Check size={12} />}
                                    </div>
                                    <div className={styles.addonTextInfo}>
                                      <h4 className={styles.addonItemName}>{addon.name}</h4>
                                      <p className={styles.addonItemDesc}>{addon.description}</p>
                                    </div>
                                  </div>
                                  <span className={styles.addonItemPrice}>+${addon.price}</span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {selectedServiceId && selectedVehicleSize && (
                        <div className={styles.freeBookingAlert}>
                          <Shield size={16} className={styles.freeBookingShield} />
                          <div>
                            <strong>100% Free Booking Guarantee</strong>
                            <p>No deposit or credit card required today. Pay only after Fernando completes the detailing service and you are fully satisfied.</p>
                          </div>
                        </div>
                      )}

                      {errors.step1 && <p className={styles.errorAlert}>{errors.step1}</p>}
                    </motion.div>
                  )}

                  {/* STEP 2: DATE, TIME & UTILITY ACCESS */}
                  {step === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={styles.stepWrapper}
                    >
                      <h2 className={styles.stepHeading}>Schedule Your Booking</h2>
                      <p className={styles.stepSubheading}>Choose an available appointment window and specify utility access.</p>
                      
                      <div className={styles.calendarAndTimeGrid}>
                        {/* Custom Calendar Card */}
                        <div className={styles.calendarCard}>
                          <div className={styles.calendarHeader}>
                            <h4 className={styles.calendarMonthName}>{monthYearString}</h4>
                            <div className={styles.monthNav}>
                              <button type="button" onClick={handlePrevMonth} className={styles.monthNavBtn}>
                                <ChevronLeft size={16} />
                              </button>
                              <button type="button" onClick={handleNextMonth} className={styles.monthNavBtn}>
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <div className={styles.calendarGridWeekdays}>
                            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                          </div>
                          
                          <div className={styles.calendarGridDays}>
                            {calendarDays.map((day, index) => {
                              if (day === null) {
                                return <div key={`empty-${index}`} className={styles.emptyDay} />;
                              }
                              
                              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                              const today = new Date();
                              today.setHours(0,0,0,0);
                              
                              const isPast = date < today;
                              const isSelected = selectedDate && 
                                selectedDate.getDate() === day && 
                                selectedDate.getMonth() === currentMonth.getMonth() && 
                                selectedDate.getFullYear() === currentMonth.getFullYear();

                              return (
                                <button
                                  key={`day-${day}`}
                                  type="button"
                                  disabled={isPast}
                                  onClick={() => onDateSelect(day)}
                                  className={`${styles.dayBtn} ${isSelected ? styles.dayBtnSelected : ''} ${isPast ? styles.dayBtnDisabled : ''}`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Available Windows Panel */}
                        <div className={styles.timeWindowsPanel}>
                          <h3 className={styles.windowsPanelTitle}>Available Arrival Windows</h3>
                          <p className={styles.windowsPanelDesc}>Selected: <strong>{formatDateString(selectedDate)}</strong></p>
                          
                          <div className={styles.timeSessionsGridContainer}>
                            
                            {/* Morning */}
                            <div className={styles.timeSessionCol}>
                              <span className={styles.timeSectionLabel}>Morning</span>
                              {morningSlots.map((slot) => {
                                const isDisabled = isSlotDisabled(slot);
                                const isActive = selectedTimeSlot === slot;
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    disabled={isDisabled}
                                    className={`${styles.timeSlotBtn} ${isActive ? styles.timeSlotActive : ''} ${isDisabled ? styles.timeSlotDisabled : ''}`}
                                    onClick={() => {
                                      setSelectedTimeSlot(slot);
                                      if (errors.time) setErrors(prev => ({ ...prev, time: '' }));
                                    }}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Afternoon */}
                            <div className={styles.timeSessionCol}>
                              <span className={styles.timeSectionLabel}>Afternoon</span>
                              {afternoonSlots.map((slot) => {
                                const isDisabled = isSlotDisabled(slot);
                                const isActive = selectedTimeSlot === slot;
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    disabled={isDisabled}
                                    className={`${styles.timeSlotBtn} ${isActive ? styles.timeSlotActive : ''} ${isDisabled ? styles.timeSlotDisabled : ''}`}
                                    onClick={() => {
                                      setSelectedTimeSlot(slot);
                                      if (errors.time) setErrors(prev => ({ ...prev, time: '' }));
                                    }}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Night */}
                            <div className={styles.timeSessionCol}>
                              <span className={styles.timeSectionLabel}>Night</span>
                              {nightSlots.map((slot) => {
                                const isDisabled = isSlotDisabled(slot);
                                const isActive = selectedTimeSlot === slot;
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    disabled={isDisabled}
                                    className={`${styles.timeSlotBtn} ${isActive ? styles.timeSlotActive : ''} ${isDisabled ? styles.timeSlotDisabled : ''}`}
                                    onClick={() => {
                                      setSelectedTimeSlot(slot);
                                      if (errors.time) setErrors(prev => ({ ...prev, time: '' }));
                                    }}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>

                          </div>
                          
                          {errors.time && <p className={styles.errorTextInline}>{errors.time}</p>}
                        </div>
                      </div>

                      {/* Utilities Access Questions (Water & Power) */}
                        <div className={styles.utilitiesSection}>
                          <div className={styles.dividerLine} />
                          <h3 className={styles.sectionHeading}>Power &amp; Water Access</h3>
                          <p className={styles.sectionSubheading}>We operate a 100% self-sufficient mobile lab with onboard water and electricity generators. However, we ask for water and electrical access preferences to plan noise levels in your neighborhood.</p>
                        
                        <div className={styles.utilitiesGrid}>
                          {/* Water Access Card */}
                          <div className={`${styles.utilityQuestionCard} ${hasWaterAccess ? styles.utilityCardAnswered : ''}`}>
                            <div className={styles.utilityHeader}>
                              <Droplets size={20} className={styles.utilityIconBlue} />
                              <h4>Do you have a water connection (spigot)?</h4>
                            </div>
                            
                            <div className={styles.utilityButtonOptions}>
                              <button
                                type="button"
                                className={`${styles.utilityOptionBtn} ${hasWaterAccess === 'yes' ? styles.utilityOptionActive : ''}`}
                                onClick={() => {
                                  setHasWaterAccess('yes');
                                  if (errors.water) setErrors(prev => ({ ...prev, water: '' }));
                                }}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                className={`${styles.utilityOptionBtn} ${hasWaterAccess === 'no' ? styles.utilityOptionActive : ''}`}
                                onClick={() => {
                                  setHasWaterAccess('no');
                                  if (errors.water) setErrors(prev => ({ ...prev, water: '' }));
                                }}
                              >
                                No
                              </button>
                            </div>
                            
                            <div className={styles.utilityDetailNotes}>
                              {hasWaterAccess === 'yes' && (
                                <p className={styles.utilityPointText}>• <strong>Spigot Access</strong>: We can hook up to your outdoor faucet, saving fuel and reducing noise from our onboard water pumps.</p>
                              )}
                              {hasWaterAccess === 'no' && (
                                <p className={styles.utilityPointText}>• <strong>Onboard Water</strong>: No problem! Our detailing van carries 90+ gallons of spot-free deionized water filtered in-house.</p>
                              )}
                              {hasWaterAccess === null && (
                                <p className={styles.utilityPointTextMuted}>Select an option to see details.</p>
                              )}
                            </div>
                            {errors.water && <p className={styles.errorTextInline}>{errors.water}</p>}
                          </div>

                          {/* Electricity Access Card */}
                          <div className={`${styles.utilityQuestionCard} ${hasPowerAccess ? styles.utilityCardAnswered : ''}`}>
                            <div className={styles.utilityHeader}>
                              <Sparkles size={20} className={styles.utilityIconOrange} />
                              <h4>Do you have an electrical power outlet?</h4>
                            </div>
                            
                            <div className={styles.utilityButtonOptions}>
                              <button
                                type="button"
                                className={`${styles.utilityOptionBtn} ${hasPowerAccess === 'yes' ? styles.utilityOptionActive : ''}`}
                                onClick={() => {
                                  setHasPowerAccess('yes');
                                  if (errors.power) setErrors(prev => ({ ...prev, power: '' }));
                                }}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                className={`${styles.utilityOptionBtn} ${hasPowerAccess === 'no' ? styles.utilityOptionActive : ''}`}
                                onClick={() => {
                                  setHasPowerAccess('no');
                                  if (errors.power) setErrors(prev => ({ ...prev, power: '' }));
                                }}
                              >
                                No
                              </button>
                            </div>
                            
                            <div className={styles.utilityDetailNotes}>
                              {hasPowerAccess === 'yes' && (
                                <p className={styles.utilityPointText}>• <strong>Outlet Access</strong>: We will plug into an exterior GFI outlet to power our steamers and polishers, ensuring a near-silent operation.</p>
                              )}
                              {hasPowerAccess === 'no' && (
                                <p className={styles.utilityPointText}>• <strong>Onboard Power</strong>: We&apos;ve got you. We will power all steam, vacuums, and polishing tools using our quiet generator.</p>
                              )}
                              {hasPowerAccess === null && (
                                <p className={styles.utilityPointTextMuted}>Select an option to see details.</p>
                              )}
                            </div>
                            {errors.power && <p className={styles.errorTextInline}>{errors.power}</p>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: CUSTOMER DETAILS & REVIEW SUMMARY */}
                  {step === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={styles.stepWrapper}
                    >
                      <h2 className={styles.stepHeading}>Enter Your Information</h2>
                      <p className={styles.stepSubheading}>Provide contact details and the exact address where we should detail your vehicle.</p>
                      
                      <form onSubmit={handleConfirmBooking} className={styles.detailsForm}>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                              <User size={14} /> First Name <span className={styles.required}>*</span>
                            </label>
                            <input 
                              type="text" 
                              className={styles.formControl} 
                              placeholder="e.g. John" 
                              value={firstName}
                              onChange={(e) => {
                                setFirstName(e.target.value);
                                if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
                              }}
                            />
                            {errors.firstName && <span className={styles.inputErrorText}>{errors.firstName}</span>}
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                              <User size={14} /> Last Name <span className={styles.required}>*</span>
                            </label>
                            <input 
                              type="text" 
                              className={styles.formControl} 
                              placeholder="e.g. Doe" 
                              value={lastName}
                              onChange={(e) => {
                                setLastName(e.target.value);
                                if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
                              }}
                            />
                            {errors.lastName && <span className={styles.inputErrorText}>{errors.lastName}</span>}
                          </div>
                        </div>
                        
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                              <Mail size={14} /> Email Address <span className={styles.required}>*</span>
                            </label>
                            <input 
                              type="email" 
                              className={styles.formControl} 
                              placeholder="e.g. john@example.com" 
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                              }}
                            />
                            {errors.email && <span className={styles.inputErrorText}>{errors.email}</span>}
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                              <Phone size={14} /> Mobile Phone Number <span className={styles.required}>*</span>
                            </label>
                            <input 
                              type="tel" 
                              className={styles.formControl} 
                              placeholder="e.g. (774) 747-7215" 
                              value={phone}
                              onChange={(e) => {
                                setPhone(e.target.value);
                                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                              }}
                            />
                            {errors.phone && <span className={styles.inputErrorText}>{errors.phone}</span>}
                          </div>
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            <MapPin size={14} /> Detailing Location Address <span className={styles.required}>*</span>
                          </label>
                          <input 
                            type="text" 
                            className={styles.formControl} 
                            placeholder="e.g. 1234 Emerald Way, Seattle, WA 98101" 
                            value={address}
                            onChange={(e) => {
                              setAddress(e.target.value);
                              if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                            }}
                          />
                          <p className={styles.inputHelp}>Our mobile lab brings all tools to your location. Home driveway, parking garage, or office lot.</p>
                          {errors.address && <span className={styles.inputErrorText}>{errors.address}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            <FileText size={14} /> Additional Notes or Special Instructions
                          </label>
                          <textarea 
                            className={styles.textareaControl} 
                            rows={3}
                            placeholder="e.g. Heavy pet hair on back seats, paint has tree sap, gate code #1234, or vehicle year/make/model details..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </form>
                      
                      {/* Mobile Pricing Summary Section (only visible when sidebar is hidden) */}
                      <div className={styles.mobileSummaryCard}>
                        <h4>Booking Total Summary</h4>
                        <div className={styles.mobileSummaryRow}>
                          <span>{currentService?.name} ({selectedVehicleSize})</span>
                          <span>${basePrice}</span>
                        </div>
                        {selectedAddonsDetails.map(addon => (
                          <div key={addon.id} className={styles.mobileSummaryRow}>
                            <span className={styles.mobileAddonName}>+ {addon.name}</span>
                            <span>${addon.price}</span>
                          </div>
                        ))}
                        <div className={styles.mobileSummaryDivider} />
                        <div className={styles.mobileSummaryTotal}>
                          <span>Estimated Total</span>
                          <strong>${total.toFixed(2)}</strong>
                        </div>
                      </div>

                      <div className={styles.freeBookingAlert} style={{ marginTop: '1.25rem' }}>
                        <Shield size={16} className={styles.freeBookingShield} />
                        <div>
                          <strong>100% Free Booking Guarantee</strong>
                          <p>No deposit or credit card required today. Pay only after Fernando completes the detailing service and you are fully satisfied.</p>
                        </div>
                      </div>
                      {errors.submit && (
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem', fontWeight: 500, textAlign: 'center' }}>
                          {errors.submit}
                        </div>
                      )}
                    </motion.div>
                  )}

                </div>

                {/* Footer Navigation Buttons inside Form */}
                <div className={styles.flowNavButtons}>
                  {step > 1 && (
                    <motion.button 
                      type="button" 
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      onClick={() => !isSubmitting && setStep(prev => (prev - 1) as 1 | 2 | 3)}
                      className={styles.backBtn}
                      disabled={isSubmitting}
                      style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                    >
                      Back
                    </motion.button>
                  )}
                  
                  {step < 3 ? (
                    <motion.button 
                      type="button" 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={step === 1 ? handleNextFromStep1 : handleNextFromStep2}
                      className={styles.primaryBtn}
                      style={{ marginLeft: step === 1 ? 'auto' : 'unset' }}
                    >
                      Continue
                    </motion.button>
                  ) : (
                    <motion.button 
                      type="button" 
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      onClick={handleConfirmBooking}
                      className={styles.primaryBtn}
                      disabled={isSubmitting}
                      style={{ opacity: isSubmitting ? 0.8 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                    >
                      {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                    </motion.button>
                  )}
                </div>

              </div>

              {/* Right Column: Sticky Summary Panel (PC ONLY) */}
              <div className={styles.sidebarSummary}>
                <div className={styles.sidebarHeader}>
                  <h3 className={styles.sidebarTitle}>Booking Summary</h3>
                  <p className={styles.sidebarSubtitle}>Real-time pricing estimate</p>
                </div>
                
                <div className={styles.sidebarBody}>
                  {/* Package selected info */}
                  {selectedServiceId ? (
                    <div className={styles.summarySectionItem}>
                      <div className={styles.summaryItemTitleRow}>
                        <Car size={16} className={styles.summaryEmeraldIcon} />
                        <div>
                          <strong>{currentService?.name}</strong>
                          <div className={styles.summaryMutedLabel}>
                            Vehicle Size: <span style={{ textTransform: 'capitalize' }}>{selectedVehicleSize}</span>
                          </div>
                        </div>
                        <span className={styles.summaryItemPrice}>${basePrice}</span>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.sidebarPlaceholderText}>No package selected</p>
                  )}
                  
                  {/* Add-ons list */}
                  {selectedAddonsDetails.length > 0 && (
                    <div className={styles.summarySectionItem}>
                      <span className={styles.summarySectionLabel}>Selected Addons</span>
                      <div className={styles.summaryAddonsList}>
                        {selectedAddonsDetails.map(addon => (
                          <div key={addon.id} className={styles.summaryAddonRow}>
                            <span>{addon.name}</span>
                            <span>+${addon.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Schedule details */}
                  {step >= 2 && selectedDate && selectedTimeSlot && (
                    <div className={styles.summarySectionItem}>
                      <span className={styles.summarySectionLabel}>Appointment Detail</span>
                      <div className={styles.summaryScheduleRow}>
                        <CalendarIcon size={14} />
                        <span>{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className={styles.summaryScheduleRow}>
                        <Clock size={14} />
                        <span>{selectedTimeSlot} (Arrival Window)</span>
                      </div>
                      <div className={styles.summaryScheduleRow}>
                        <Info size={14} />
                        <span>Est. Duration: {currentService?.duration}</span>
                      </div>
                    </div>
                  )}

                  {/* Mobile Lab self sufficiency details */}
                  {step >= 2 && (hasWaterAccess || hasPowerAccess) && (
                    <div className={styles.summarySectionItem}>
                      <span className={styles.summarySectionLabel}>Van Setup Configuration</span>
                      {hasWaterAccess && (
                        <div className={styles.summaryLogisticsRow}>
                          <span>Water Source:</span>
                          <strong>{hasWaterAccess === 'yes' ? 'Spigot Connection' : 'Van Pure Water Tanks'}</strong>
                        </div>
                      )}
                      {hasPowerAccess && (
                        <div className={styles.summaryLogisticsRow}>
                          <span>Power Source:</span>
                          <strong>{hasPowerAccess === 'yes' ? 'Property Outlet' : 'Van Quiet Generator'}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.sidebarFooter}>
                  <div className={styles.billingTotalRow}>
                    <span>Estimated Total:</span>
                    <span className={styles.finalTotalValue}>${total.toFixed(2)}</span>
                  </div>
                  
                  {/* Clean Assurance Card */}
                  <div className={styles.assuranceCard}>
                    <Shield size={14} className={styles.assuranceIcon} />
                    <span>No deposit required today. Pay only upon complete satisfaction after service.</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* CONFIRMED SUCCESS VIEW */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.successScreen}
            >
              <div className={styles.successCircle}>
                <Check size={40} className={styles.successCheckIcon} />
              </div>
              
              <h2 className={styles.successTitle}>Booking Request Received!</h2>
              <p className={styles.successSubtitle}>
                Thank you, {firstName}. Fernando will review your request and send a confirmation text to <strong>{phone}</strong> shortly to finalize your appointment.
              </p>
              
              <div className={styles.successDetailsBox}>
                <h3>Your Appointment Summary</h3>
                <div className={styles.successSummaryGrid}>
                  <div className={styles.successField}>
                    <span>Service Package:</span>
                    <strong>{currentService?.name}</strong>
                  </div>
                  <div className={styles.successField}>
                    <span>Vehicle Size:</span>
                    <strong style={{ textTransform: 'capitalize' }}>{selectedVehicleSize}</strong>
                  </div>
                  {selectedAddonsDetails.length > 0 && (
                    <div className={styles.successField}>
                      <span>Add-ons:</span>
                      <strong>{selectedAddonsDetails.map(a => a.name).join(', ')}</strong>
                    </div>
                  )}
                  <div className={styles.successField}>
                    <span>Date &amp; Time:</span>
                    <strong>{formatDateString(selectedDate)} @ {selectedTimeSlot}</strong>
                  </div>
                  <div className={styles.successField}>
                    <span>Location Address:</span>
                    <strong>{address}</strong>
                  </div>
                  <div className={styles.successField}>
                    <span>Utility Access:</span>
                    <strong>
                      Water: {hasWaterAccess === 'yes' ? 'Spigot' : 'Onboard Tank'} | 
                      Power: {hasPowerAccess === 'yes' ? 'Outlet' : 'Onboard Gen'}
                    </strong>
                  </div>
                  <div className={styles.successFieldDivider} />
                  <div className={styles.successFieldTotal}>
                    <span>Estimated Investment:</span>
                    <strong>${total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              <div className={styles.successSecurityNote}>
                <Info size={14} />
                <span>Need to make changes? Respond directly to the SMS or call us at (774) 747-7215.</span>
              </div>
              
              <button 
                type="button" 
                onClick={onClose}
                className={styles.successDoneBtn}
              >
                Return to Site
              </button>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

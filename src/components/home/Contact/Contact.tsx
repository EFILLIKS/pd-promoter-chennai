"use client";

import { useRef } from "react";
import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedHeading } from "@/components/ui/HeadingText";
import { FadeInBlock } from "@/components/ui/Paratext";
import { useData } from "@/context/DataContext";

export const ContactSection = () => {
  const { addEnquiry } = useData();
  const sectionRef = useRef<HTMLElement>(null);
  const isLayerInView = useInView(sectionRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", phone: "", subject: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^[0-9\s+\-()]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    addEnquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    });
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Smooth stagger for form fields
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="w-full bg-[#FFFFFF] py-[80px] md:py-[120px]">
      <div className="max-w-[1600px] mx-auto px-[24px] md:px-[64px] flex flex-col">
        
        {/* --- 1. HEADER ROW --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full mb-[64px]">
          
          {/* Left Side: Eyebrow & Heading */}
          <div className="flex flex-col gap-[16px] max-w-[700px]">
            <FadeInBlock isTriggered={isLayerInView} delay={0.1}>
              <div className="flex items-center gap-[8px] text-[#64748B] font-medium text-[14px] tracking-widest uppercase">
                <span className="w-[4px] h-[4px] rounded-full bg-[#64748B]"></span>
                Contact Us
              </div>
            </FadeInBlock>
            
            <AnimatedHeading
              text="LET'S BEGIN YOUR JOURNEY HOME"
              className="text-[36px] md:text-[48px] lg:text-[56px] font-serif text-[#1A1F2A] leading-[1.1] uppercase tracking-tight"
              isTriggered={isLayerInView}
              staggerDelay={0.04}
              as="h2"
            />
          </div>

          {/* Right Side: Paragraph */}
          <div className="max-w-[420px] mt-[24px] lg:mt-0">
            <FadeInBlock isTriggered={isLayerInView} delay={0.4}>
              <p className="text-[#64748B] font-sans text-[16px] md:text-[18px] leading-[1.6]">
                Whether you're exploring investment opportunities or searching for your future home, our team is here to guide you every step of the way.
              </p>
            </FadeInBlock>
          </div>
        </div>

        {/* --- 2. MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] lg:gap-[32px] w-full">
          
          {/* LEFT COLUMN: Brand Commitment (Dark Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={isLayerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="bg-[#0B1117] rounded-[24px] pt-[48px] px-[40px] md:px-[48px] flex flex-col overflow-hidden min-h-[400px] lg:min-h-0 h-full"
          >
            {/* Top Text Content */}
            <div className="flex flex-col gap-[24px] relative z-10 max-w-[480px] min-h-[450px] md:min-h-0">
              {/* Replace Hexagon with your actual SVG logo */}
              <img src="/assets/logowhite.png" alt="PD Logo" className="text-white w-[32px] h-[32px]" />
              
              <h3 className="text-[28px] md:text-[32px] font-serif text-white uppercase tracking-wide">
                OUR COMMITMENT
              </h3>
              
              <p className="text-white/60 font-sans text-[16px] leading-[1.6]">
                Whether you're exploring investment opportunities or searching for your future home, our team is here to guide you every step of the way.
              </p>
            </div>

            {/* Bottom Image Container
                mt-auto pushes the image to the absolute bottom of the flex container.
                object-bottom ensures the transparent PNG rests exactly on the baseline.
            */}
            <div className="relative w-[calc(100%+80px)] md:w-[calc(100%+96px)] -mx-[40px] md:-mx-[48px] mt-auto pt-[40px] flex-grow flex items-end justify-center pointer-events-none">
              <img 
                src="/assets/Contacthome.png" // ⚡ Replace with your bg-removed PNG
                alt="Modern Villa Architecture"
                className="absolute -bottom-30 left-0 w-full h-auto object-cover object-bottom"
              />
            </div>
          </motion.div>


          {/* RIGHT COLUMN: Contact Form (Light Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={isLayerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="bg-[#F9F9FB] rounded-[24px] p-[32px] md:p-[48px] flex flex-col justify-center min-h-[500px]"
          >
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center flex flex-col items-center justify-center py-[48px]"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-3xl mb-6 text-green-600">
                  ✓
                </div>
                <h3 className="text-[24px] font-serif font-bold text-[#1A1F2A] mb-2 uppercase tracking-wide">Inquiry Submitted</h3>
                <p className="text-[#64748B] text-[16px] mb-8 max-w-sm">
                  Thank you for reaching out. A construction specialist will review your request and get back to you shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-[24px] py-[12px] bg-[#1A1F2A] text-white rounded-[12px] text-[15px] font-medium transition-colors hover:bg-[#0B1117]"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form 
                onSubmit={handleSubmit}
                initial="hidden"
                animate={isLayerInView ? "visible" : "hidden"}
                variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } } }}
                className="flex flex-col gap-[24px]"
              >
                
                {/* Full Name */}
                <motion.div variants={formVariants} className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-medium text-[#1A1F2A]">Full Name*</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full bg-white rounded-[12px] h-[56px] px-[16px] text-[16px] text-[#1A1F2A] outline-none border transition-all ${
                      errors.name 
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/10" 
                        : "border-transparent focus:ring-2 focus:ring-[#0B1117]/10"
                    }`}
                  />
                  {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                </motion.div>

                {/* Email */}
                <motion.div variants={formVariants} className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-medium text-[#1A1F2A]">Email*</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full bg-white rounded-[12px] h-[56px] px-[16px] text-[16px] text-[#1A1F2A] outline-none border transition-all ${
                      errors.email 
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/10" 
                        : "border-transparent focus:ring-2 focus:ring-[#0B1117]/10"
                    }`}
                  />
                  {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                </motion.div>

                {/* Phone Number */}
                <motion.div variants={formVariants} className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-medium text-[#1A1F2A]">Phone Number*</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full bg-white rounded-[12px] h-[56px] px-[16px] text-[16px] text-[#1A1F2A] outline-none border transition-all ${
                      errors.phone 
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/10" 
                        : "border-transparent focus:ring-2 focus:ring-[#0B1117]/10"
                    }`}
                  />
                  {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                </motion.div>

                {/* Subject */}
                <motion.div variants={formVariants} className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-medium text-[#1A1F2A]">Subject*</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full bg-white rounded-[12px] h-[56px] px-[16px] text-[16px] text-[#1A1F2A] outline-none border transition-all ${
                      errors.subject 
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/10" 
                        : "border-transparent focus:ring-2 focus:ring-[#0B1117]/10"
                    }`}
                  />
                  {errors.subject && <span className="text-xs text-red-500">{errors.subject}</span>}
                </motion.div>

                {/* Message */}
                <motion.div variants={formVariants} className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-medium text-[#1A1F2A]">Message</label>
                  <textarea 
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-white rounded-[12px] p-[16px] text-[16px] text-[#1A1F2A] outline-none border border-transparent focus:ring-2 focus:ring-[#0B1117]/10 transition-all resize-none"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={formVariants} className="pt-[16px]">
                  <motion.button 
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#0B1117] text-white rounded-[12px] h-[64px] text-[16px] font-medium tracking-wide flex items-center justify-center transition-colors hover:bg-[#1A1F2A] disabled:bg-neutral-400"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </motion.button>
                </motion.div>

              </motion.form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Icon } from "@iconify/react";
import { AnimatedHeading } from "@/components/ui/HeadingText";
import { FadeInBlock } from "@/components/ui/Paratext";

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-[#E2E8F0] py-6">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left gap-4 group cursor-pointer"
      >
        <h3 className="font-serif text-lg md:text-xl text-[#1A1F2A] group-hover:text-[#0B1117] transition-colors leading-snug">
          {question}
        </h3>
        <div className={`p-2 rounded-full border border-[#E2E8F0] text-[#64748B] group-hover:text-[#0B1117] group-hover:border-[#CBD5E1] transition-all shrink-0 ${isOpen ? "bg-[#1A1F2A] !text-white !border-[#1A1F2A]" : ""}`}>
          <Icon 
            icon="lucide:chevron-down" 
            width="18" 
            height="18" 
            className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-[#64748B] font-sans text-sm md:text-base leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isLayerInView = useInView(sectionRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });

  const faqs = [
    {
      question: "Where do you build luxury villas in Chennai?",
      answer: "PD Construction develops premium residential developments and luxury villas across key prime locations in Chennai, including Valasaravakkam, Kolathur, Maduravoyal, and surrounding areas.",
    },
    {
      question: "What makes you a top property developer in Chennai?",
      answer: "As leading property developers in Chennai, we stand out due to our modern architectural designs, exceptional engineering, high-grade construction materials, and a transparent commitment to quality and timely delivery.",
    },
    {
      question: "How do you handle villa construction in Chennai?",
      answer: "Our villa construction process in Chennai is comprehensive. It spans initial architectural conceptualization, structural planning, building permissions, premium interior design layouts, and custom handovers tailored specifically to your lifestyle requirements.",
    },
    {
      question: "Do you provide customized residential construction in Chennai?",
      answer: "Yes, residential construction in Chennai by PD Construction is fully customized. We work closely with our clients from initial design concepts to select custom BHK configurations, luxury finishes, and architectural options.",
    },
  ];

  return (
    <section ref={sectionRef} className="w-full bg-[#FFFFFF] py-[80px] md:py-[120px]">
      <div className="max-w-[1600px] mx-auto px-[24px] md:px-[64px] flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* Left Column: Heading & Paragraph */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3">
          <FadeInBlock isTriggered={isLayerInView} delay={0.1}>
            <div className="flex items-center gap-[8px] text-[#64748B] font-medium text-[14px] tracking-widest uppercase">
              <span className="w-[4px] h-[4px] rounded-full bg-[#64748B]"></span>
              FAQ
            </div>
          </FadeInBlock>
          
          <AnimatedHeading
            text="FREQUENTLY ASKED QUESTIONS"
            className="text-[32px] md:text-[40px] font-serif text-[#0B1117] leading-[1.1] uppercase tracking-tight"
            isTriggered={isLayerInView}
            staggerDelay={0.04}
            as="h2"
          />

          <FadeInBlock isTriggered={isLayerInView} delay={0.4}>
            <p className="text-[#64748B] font-sans text-sm md:text-base leading-relaxed">
              Find answers to common questions about our premium villa construction, custom configurations, and development processes in Chennai.
            </p>
          </FadeInBlock>
        </div>

        {/* Right Column: Accordion */}
        <div className="w-full lg:w-2/3 flex flex-col">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

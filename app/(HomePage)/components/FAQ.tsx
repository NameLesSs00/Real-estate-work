'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FAQ.css';

const faqData = [
  {
    question: "What types of properties are available?",
    answer: "We offer apartments, villas, and investment properties across prime locations."
  },
  {
    question: "Can I schedule a property visit online?",
    answer: "Yes, you can easily schedule a visit through our online booking system or by contacting our agents directly."
  },
  {
    question: "Do you offer payment plans?",
    answer: "We provide flexible payment options and financing solutions tailored to your financial needs."
  },
  {
    question: "Is it a good time to invest in real estate?",
    answer: "With current market trends and property appreciation, it is an excellent time for long-term investments."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section overflow-hidden">
      <div className="faq-container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="faq-header"
        >
          <span className="faq-tag">LATEST ARTICLES</span>
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Find quick answers to the most common questions about buying, investing, and
            owning property. Everything you need to make confident decisions.
          </p>
          <div className="faq-accent-line"></div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="faq-list"
        >
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" }
                }
              }}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{item.question}</span>
                <ChevronDown className="faq-chevron" />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="faq-answer-wrapper overflow-hidden"
                  >
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;

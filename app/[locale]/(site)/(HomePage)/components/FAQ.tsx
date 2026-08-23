'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getQuestions, Question } from '@/lib/api/questions';
import Link from 'next/link';
import './FAQ.css';

const FAQ = () => {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqData, setFaqData] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getQuestions(language)
      .then((data) => setFaqData(data.slice(0, 5)))
      .catch((err) => console.warn('[FAQ] Failed to fetch questions:', err))
      .finally(() => setIsLoading(false));
  }, [language]);
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section overflow-hidden">
      <div className="faq-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="faq-header"
        >
          <span className="faq-tag">{t('faq.tag')}</span>
          <h2 className="faq-title">{t('faq.title')}</h2>
          <p className="faq-subtitle">{t('faq.subtitle')}</p>
          <div className="faq-accent-line"></div>
        </motion.div>

        {isLoading ? (
          <div className="faq-loading">
            <Loader2 className="faq-spinner" />
          </div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="faq-list"
            >
              {faqData.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: 'easeOut' },
                    },
                  }}
                  className={`faq-item ${openIndex === index ? 'open' : ''}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={openIndex === index}
                  >
                    <span>{item.title}</span>
                    <ChevronDown className="faq-chevron" />
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="faq-answer-wrapper overflow-hidden"
                      >
                        <div className="faq-answer">
                          <p>{item.description}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            {/* View All Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="faq-view-all-wrapper"
            >
              <Link href={`/${language}/faq`} className="faq-view-all-link">
                {t('faq.viewAll') as string || 'View All FAQs'}
                <ChevronDown className="faq-view-all-icon" />
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default FAQ;

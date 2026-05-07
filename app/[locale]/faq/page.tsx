'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Loader2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getQuestions, Question } from '@/lib/api/questions';
import './faq.css';

export default function FAQPage() {
  const { t } = useLanguage();
  const [faqData, setFaqData] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    getQuestions()
      .then((data) => setFaqData(data))
      .catch((err) => console.error('[FAQPage] Failed to fetch questions:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* Hero */}
      <section className="faqp-hero">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="faqp-hero-inner"
        >
          <div className="faqp-hero-icon">
            <HelpCircle size={40} />
          </div>
          <span className="faqp-tag">{t('faqPage.tag') as string}</span>
          <h1 className="faqp-title">{t('faqPage.title') as string}</h1>
          <p className="faqp-subtitle">
            {t('faqPage.subtitle') as string}
          </p>
          <div className="faqp-accent-line" />
        </motion.div>
      </section>

      {/* FAQ List */}
      <section className="faqp-section">
        <div className="faqp-container">
          {isLoading ? (
            <div className="faqp-loading">
              <Loader2 className="faqp-spinner" />
              <p>{t('faqPage.loading') as string}</p>
            </div>
          ) : faqData.length === 0 ? (
            <div className="faqp-empty">
              <HelpCircle size={48} className="faqp-empty-icon" />
              <p>{t('faqPage.noQuestions') as string}</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
              className="faqp-list"
            >
              {faqData.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.45, ease: 'easeOut' },
                    },
                  }}
                  className={`faqp-item ${openIndex === index ? 'open' : ''}`}
                >
                  <button
                    className="faqp-question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={openIndex === index}
                  >
                    <span className="faqp-question-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="faqp-question-text">{item.title}</span>
                    <ChevronDown className="faqp-chevron" />
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="faqp-answer-wrapper overflow-hidden"
                      >
                        <div className="faqp-answer">
                          <p>{item.description}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

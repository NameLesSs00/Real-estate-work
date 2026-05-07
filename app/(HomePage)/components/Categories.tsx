'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { getUnitsFiltered } from '@/lib/api/units';
import './Categories.css';

const categoryConfig = [
  {
    key: 'apartments',
    value: '0',
    image: '/assists/categoriesHome/appartment.png',
  },
  {
    key: 'villas',
    value: '1',
    image: '/assists/categoriesHome/vails.png',
  },
  {
    key: 'houses',
    value: '2',
    image: '/assists/categoriesHome/home.png',
  },
  {
    key: 'studio',
    value: '3',
    image: '/assists/categoriesHome/studio.png',
  },
];

const Categories = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCounts = async () => {
      try {
        const results = await Promise.all(
          categoryConfig.map(async (cat) => {
            const data = await getUnitsFiltered({ PropertyType: cat.value, PageSize: 1 });
            return { value: cat.value, count: data.totalCount || 0 };
          })
        );
        const newCounts: Record<string, number> = {};
        results.forEach(res => {
          newCounts[res.value] = res.count;
        });
        setCounts(newCounts);
      } catch (error) {
        console.error('[Categories] Failed to fetch category counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const handleCategoryClick = (value: string) => {
    router.push(`/properties?propertyType=${value}`);
  };

  return (
    <section className="categories-section overflow-hidden">
      <div className="categories-container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="categories-header"
        >
          <span className="categories-tag">{t('categories.tag') as string}</span>
          <h2 className="categories-title" dangerouslySetInnerHTML={{ __html: t('categories.title') as string }} />
          <p className="categories-subtitle">
            {t('categories.subtitle') as string}
          </p>
          <div className="categories-accent-line"></div>
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
          className="categories-grid"
        >
          {categoryConfig.map((category, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { duration: 0.6, ease: "easeOut" }
                }
              }}
              whileHover={{ 
                y: -12,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="category-card cursor-pointer"
              onClick={() => handleCategoryClick(category.value)}
            >
              <div className="category-image-wrapper">
                <Image
                  src={category.image}
                  alt={t(`categories.types.${category.key}`) as string}
                  fill
                  className="category-image"
                />
              </div>
              <div className="category-content">
                <h3 className="category-name">{t(`categories.types.${category.key}`) as string}</h3>
                <p className="category-count">
                  {loading 
                    ? '...' 
                    : `${counts[category.value] || 0} ${t('categories.listings') as string}`
                  }
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;

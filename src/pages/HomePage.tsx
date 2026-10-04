import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { FeaturedCarousel } from '../components/home/FeaturedCarousel';
import { VisitSection } from '../components/home/VisitSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { menuItems, testimonials } from '../data/menuData';

const featuredItems = menuItems.filter(item => item.isFeatured);

const HomePage: React.FC = () => (
  <>
    <Header />
    <main id="main-content">
      <HeroSection />
      <AboutSection />
      <FeaturedCarousel items={featuredItems} />
      <VisitSection />
      <TestimonialsSection testimonials={testimonials} />
    </main>
    <Footer />
  </>
);

export default HomePage;

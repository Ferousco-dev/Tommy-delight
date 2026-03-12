import React from 'react';
import Hero from '../components/Hero';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import Services from '../components/Services';
import Products from '../components/Products';
import Contact from '../components/Contact';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      
      <Services />
      <Products />
      <WhyChooseUs />
      <Testimonials />
      <Contact />
    </div>
  );
}

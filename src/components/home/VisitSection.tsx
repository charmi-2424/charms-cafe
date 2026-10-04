import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, ParkingCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { operatingHours, cafeInfo } from '../../data/menuData';

const amenities = [
  { icon: Wifi, label: 'Free High-Speed Wi-Fi' },
  { icon: ParkingCircle, label: 'Ample Street Parking' },
  { icon: Clock, label: 'Order Ahead Available' },
];

export const VisitSection: React.FC = () => (
  <section className="py-24 bg-cream" aria-labelledby="visit-heading">
    <div className="container-site">
      <div className="text-center mb-14">
        <span className="text-terracotta text-sm font-semibold tracking-widest uppercase">Come Say Hello</span>
        <h2 id="visit-heading" className="text-4xl lg:text-5xl font-serif text-espresso mt-2">
          Visit Us
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 rounded-2xl overflow-hidden min-h-[300px] bg-sage/10 border border-sage/20
                     flex items-center justify-center relative"
        >
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&q=70"
            alt="Map of Koramangala, Bengaluru"
            className="w-full h-full object-cover absolute inset-0 opacity-40"
          />
          <div className="relative z-10 text-center">
            <div className="w-14 h-14 rounded-full bg-terracotta flex items-center justify-center mx-auto mb-3 shadow-lg">
              <MapPin className="w-7 h-7 text-cream" />
            </div>
            <p className="font-semibold text-espresso">{cafeInfo.address}</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(cafeInfo.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-terracotta font-medium hover:text-terracotta-dark transition-colors"
            >
              Get Directions ↗
            </a>
          </div>
        </motion.div>

        {/* Info panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Hours */}
          <div className="card p-6">
            <h3 className="font-semibold text-espresso mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-terracotta" /> Opening Hours
            </h3>
            <ul className="space-y-2.5">
              {operatingHours.map(oh => (
                <li key={oh.day} className="flex justify-between text-sm">
                  <span className="text-gray-600">{oh.day}</span>
                  <span className="font-medium text-espresso">{oh.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="card p-6">
            <h3 className="font-semibold text-espresso mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${cafeInfo.phone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-terracotta transition-colors">
                  <Phone className="w-4 h-4 text-terracotta" /> {cafeInfo.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${cafeInfo.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-terracotta transition-colors">
                  <Mail className="w-4 h-4 text-terracotta" /> {cafeInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Amenities */}
          <div className="flex flex-col gap-2">
            {amenities.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-gray-600">
                <Icon className="w-4 h-4 text-sage" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

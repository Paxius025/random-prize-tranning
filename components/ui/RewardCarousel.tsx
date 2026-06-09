'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Printer, Wrench, Package, Zap, Gift } from 'lucide-react';

const REWARDS_DATA = [
  {
    id: 1,
    title: "ESP32 Starter Kit",
    description: "บอร์ด IoT พร้อมอุปกรณ์เริ่มต้น",
    badge: "รางวัลใหญ่",
    badgeColor: "bg-accent text-accent-foreground",
    icon: <Cpu size={48} className="text-primary/80" />,
  },
  {
    id: 2,
    title: "โควต้าปริ้น 3D ฟรี",
    description: "สิทธิ์ใช้งานเครื่องปริ้น 3D ฟรี",
    badge: "รางวัลใหญ่",
    badgeColor: "bg-accent text-accent-foreground",
    icon: <Printer size={48} className="text-primary/80" />,
  },
  {
    id: 3,
    title: "ชุดอุปกรณ์บัดกรี",
    description: "อุปกรณ์พื้นฐานสำหรับสาย Maker",
    badge: "รางวัลใหญ่",
    badgeColor: "bg-accent text-accent-foreground",
    icon: <Wrench size={48} className="text-primary/80" />,
  },
  {
    id: 4,
    title: "PCB Prototype Kit",
    description: "แผงวงจรต้นแบบสำหรับโปรเจกต์",
    badge: "รางวัลพิเศษ",
    badgeColor: "bg-primary/20 text-primary",
    icon: <Zap size={48} className="text-primary/80" />,
  },
  {
    id: 5,
    title: "Mystery Electronics Box",
    description: "กล่องสุ่มอุปกรณ์อิเล็กทรอนิกส์",
    badge: "รางวัลพิเศษ",
    badgeColor: "bg-primary/20 text-primary",
    icon: <Package size={48} className="text-primary/80" />,
  },
  {
    id: 6,
    title: "ของที่ระลึก Workshop",
    description: "ของที่ระลึกพิเศษจากงานอบรม",
    badge: "รางวัลกิจกรรม",
    badgeColor: "bg-muted-foreground/20 text-muted-foreground",
    icon: <Gift size={48} className="text-primary/80" />,
  }
];

export function RewardCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setActiveIndex(index);
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => el?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const maxIndex = REWARDS_DATA.length - 1;
      const nextIndex = activeIndex >= maxIndex ? 0 : activeIndex + 1;
      
      scrollRef.current.scrollTo({
        left: nextIndex * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, isHovered]);

  return (
    <div className="w-full max-w-sm mx-auto my-6"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         onTouchStart={() => setIsHovered(true)}
         onTouchEnd={() => setIsHovered(false)}
    >
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg text-primary flex items-center justify-center gap-2">
          <Gift size={20} className="text-accent" /> รางวัลกิจกรรมวันนี้
        </h3>
        <p className="text-sm text-muted-foreground">มากกว่า 15 รางวัล ลุ้นรับสิทธิ์ช่วงท้ายกิจกรรม</p>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {REWARDS_DATA.map((reward) => (
          <div 
            key={reward.id} 
            className="flex-none w-full snap-center"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col items-center text-center mx-2 h-full"
            >
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                {reward.icon}
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full mb-3 ${reward.badgeColor}`}>
                {reward.badge}
              </span>
              <h4 className="font-bold text-foreground text-lg mb-1">{reward.title}</h4>
              <p className="text-sm text-muted-foreground">{reward.description}</p>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-2">
        {REWARDS_DATA.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-6 bg-primary' : 'w-2 bg-border'}`}
          />
        ))}
      </div>
    </div>
  );
}

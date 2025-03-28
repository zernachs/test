import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { Button } from "@/components/ui/button";

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    }
  }
};

const navItemVariants = {
  hidden: { y: -10, opacity: 0 },
  visible: (i: number) => ({ 
    y: 0, 
    opacity: 1,
    transition: { 
      delay: i * 0.1,
      duration: 0.3, 
      ease: "easeOut" 
    }
  })
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Слушаем скролл для эффекта изменения хедера
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { label: "Главная", href: "/" },
    { label: "Войти", href: "/login" },
    { label: "Регистрация", href: "/register" }
  ];

  const isActive = (path: string) => location === path;

  return (
    <motion.header 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed w-full py-4 backdrop-blur-lg border-b z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-black/50 border-purple-900/30 shadow-md shadow-purple-900/10" 
          : "bg-black/20 border-purple-900/10"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Logo />
            </motion.div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
              >
                <Link href={item.href}>
                  <span className={`relative px-1 py-2 transition-all duration-300 ${
                    isActive(item.href) 
                      ? "text-white font-medium" 
                      : "text-gray-400 hover:text-purple-300"
                  }`}>
                    {item.label}
                    {isActive(item.href) && (
                      <motion.span 
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"
                      />
                    )}
                  </span>
                </Link>
              </motion.div>
            ))}
            <motion.div
              custom={menuItems.length}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <Link href="/dashboard">
                <Button className="gradient-button">
                  <span className="flex items-center">
                    Личный кабинет
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Button>
              </Link>
            </motion.div>
          </nav>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="md:hidden text-white hover:bg-purple-500/20"
              aria-label="Toggle mobile menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu isOpen={isMobileMenuOpen} menuItems={menuItems} onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </motion.header>
  );
}

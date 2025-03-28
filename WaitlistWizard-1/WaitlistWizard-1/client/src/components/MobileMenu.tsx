import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface MenuItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  onClose: () => void;
}

const menuVariants = {
  hidden: { 
    opacity: 0,
    height: 0,
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  visible: { 
    opacity: 1,
    height: 'auto',
    transition: { 
      duration: 0.4,
      ease: "easeInOut",
      staggerChildren: 0.07,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    height: 0,
    transition: { 
      duration: 0.3,
      ease: "easeInOut",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: { 
    y: -20, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: { 
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export default function MobileMenu({ isOpen, menuItems, onClose }: MobileMenuProps) {
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <motion.div
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      exit="exit"
      variants={menuVariants}
      className="absolute top-full left-0 right-0 backdrop-blur-xl bg-black/80 border-b border-purple-900/30 overflow-hidden md:hidden z-50"
    >
      <div className="container mx-auto px-4 py-6">
        <nav className="flex flex-col space-y-4">
          {menuItems.map((item, i) => (
            <motion.div 
              key={item.label}
              variants={itemVariants}
              className="glass-card p-3 hover:bg-purple-900/10"
            >
              <Link
                href={item.href}
                onClick={handleLinkClick}
              >
                <span className="flex items-center justify-between text-white hover:text-purple-300 font-medium">
                  {item.label}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ))}
          
          <motion.div variants={itemVariants} className="mt-4">
            <Link href="/dashboard" onClick={handleLinkClick}>
              <Button className="gradient-button w-full justify-center">
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
      </div>
    </motion.div>
  );
}

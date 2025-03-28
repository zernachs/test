import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useRef, useState, useEffect } from "react";

// Анимации для главной секции
const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.3
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1]
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1],
      delay: 0.2
    }
  }
};

// Типированные покупки для демо-карточки Minecraft
type Donation = {
  id: number;
  username: string;
  avatar: string;
  message: string;
  amount: string;
  time: string;
};

const donations: Donation[] = [
  {
    id: 1,
    username: "Steve_Miner",
    avatar: "S",
    message: "Купил привилегию VIP на сервере MineWorld",
    amount: "500 ₽",
    time: "Сейчас"
  },
  {
    id: 2,
    username: "DiamondMaster",
    avatar: "D", 
    message: "Приобрел набор алмазных инструментов и админку на 30 дней",
    amount: "2,500 ₽",
    time: "2 мин"
  },
  {
    id: 3,
    username: "Enderman2023",
    avatar: "E",
    message: "Купил привилегию PREMIUM на сервере SkyBlocks",
    amount: "1,000 ₽",
    time: "5 мин"
  }
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Состояние для активного доната
  const [activeDonation, setActiveDonation] = useState<Donation>(donations[0]);
  const [donationIndex, setDonationIndex] = useState(0);
  
  // Автоматическая смена донатов для демонстрации
  useEffect(() => {
    const interval = setInterval(() => {
      setDonationIndex((prev) => (prev + 1) % donations.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Обновляем активный донат при изменении индекса
  useEffect(() => {
    setActiveDonation(donations[donationIndex]);
  }, [donationIndex]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden pt-32 pb-20 decorated-section"
    >
      {/* Фоновые элементы и градиенты */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pink-600/5 blur-[130px]" />
        
        {/* Анимированная сетка точек */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-full h-full bg-grid-pattern"></div>
        </div>
        
        {/* Плавающие частицы */}
        <motion.div 
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4]
          }} 
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] left-[15%] w-2 h-2 bg-purple-400 rounded-full"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            opacity: [0.3, 0.7, 0.3]
          }} 
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-[30%] right-[25%] w-3 h-3 bg-indigo-400 rounded-full"
        />
        <motion.div 
          animate={{ 
            y: [0, -25, 0],
            opacity: [0.2, 0.6, 0.2]
          }} 
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-[25%] left-[35%] w-2 h-2 bg-pink-400 rounded-full"
        />
      </div>
      
      <motion.div 
        style={{ y, opacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.div 
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Левая колонка - текстовый контент */}
          <div className="max-w-xl mx-auto lg:mx-0">
            <motion.div variants={textVariants} className="space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 mb-4">
                <span className="text-sm text-gray-300 flex items-center">
                  <div className="online-indicator mr-2" />
                  Более 5,000+ Minecraft серверов уже с нами
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
                Монетизируйте <br />
                <span className="gradient-text">Minecraft</span> <br />
                сервер легко
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                FlyDonate — это удобный сервис для владельцев Minecraft серверов, который позволяет создать магазин привилегий и предметов для ваших игроков без комиссий и сложных настроек.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button size="lg" className="gradient-button h-14 px-8 text-lg">
                      <span className="flex items-center">
                        Создать аккаунт
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </Button>
                  </motion.div>
                </Link>
                
                <Link href="/login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="h-14 px-8 text-lg text-white border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-400"
                    >
                      <span className="flex items-center">
                        Войти в аккаунт
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              </div>
              
              <div className="pt-8 flex items-center space-x-6">
                <div className="flex -space-x-3">
                  {["#f472b6", "#c084fc", "#818cf8"].map((color, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                      className="w-10 h-10 rounded-full border-2 border-black/20 shadow-lg flex items-center justify-center text-white font-bold"
                      style={{ 
                        backgroundColor: color,
                        zIndex: 10 - i
                      }}
                    >
                      {["V", "I", "P"][i]}
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="text-gray-300"
                >
                  <div className="text-white font-semibold">Популярные привилегии</div>
                  <div className="text-sm">VIP, ADMIN и PREMIUM доступны</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Правая колонка - карточка доната с анимацией */}
          <motion.div variants={cardVariants} className="relative max-w-lg mx-auto lg:mx-0">
            {/* Фоновые эффекты для карточки */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-full blur-[80px]" />
            
            {/* Карточка с донатами */}
            <div className="relative glass-panel border-white/10 p-6 shadow-xl">
              {/* Верхняя часть с информацией о Minecraft сервере */}
              <div className="bg-gradient-to-r from-black/30 to-black/50 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                    M
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">MineWorld</h3>
                    <div className="flex items-center mt-1">
                      <div className="online-indicator mr-2" />
                      <span className="text-green-400 text-xs font-medium">Сервер онлайн: 152 игрока</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Секция последних покупок привилегий */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white/80 font-medium">Последние покупки</h4>
                  <span className="text-purple-400 text-sm">Показать все</span>
                </div>
                
                {/* Карусель донатов с анимацией */}
                <div className="relative h-[180px] overflow-hidden">
                  <motion.div
                    key={activeDonation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.5,
                      ease: [0.33, 1, 0.68, 1]
                    }}
                    className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/5"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {activeDonation.avatar}
                        </div>
                        <span className="text-white font-medium">{activeDonation.username}</span>
                      </div>
                      <span className="text-white/60 text-xs">{activeDonation.time}</span>
                    </div>
                    
                    <p className="text-white/90 mb-3">{activeDonation.message}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Стоимость:</span>
                      <span className="gradient-text font-bold text-lg">{activeDonation.amount}</span>
                    </div>
                  </motion.div>
                </div>
                
                {/* Индикаторы для карусели */}
                <div className="flex justify-center gap-1 mt-3">
                  {donations.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setDonationIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === donationIndex 
                          ? "bg-purple-500 w-6" 
                          : "bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Секция статистики */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl p-3">
                  <div className="text-white/60 text-xs mb-1">Прибыль за сегодня</div>
                  <div className="gradient-text font-bold text-xl">126,845 ₽</div>
                  <div className="flex items-center text-green-400 text-xs mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    +28% от вчера
                  </div>
                </div>
                <div className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl p-3">
                  <div className="text-white/60 text-xs mb-1">Всего заработано</div>
                  <div className="gradient-text font-bold text-xl">5,142,750 ₽</div>
                  <div className="flex items-center text-white/60 text-xs mt-1">
                    За 2023-2024 год
                  </div>
                </div>
              </div>
              
              {/* Кнопки действий */}
              <div className="grid grid-cols-2 gap-3">
                <Button className="gradient-button w-full">
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Просмотр магазина
                  </span>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-400 text-white"
                >
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                    Купить привилегию
                  </span>
                </Button>
              </div>
            </div>
            
            {/* Декоративные элементы вокруг карточки */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full opacity-10 animate-spin-slow" style={{ 
              background: "conic-gradient(from 0deg at 50% 50%, rgba(139, 92, 246, 0.8) 0%, rgba(239, 68, 68, 0.2) 25%, rgba(59, 130, 246, 0.2) 50%, rgba(16, 185, 129, 0.2) 75%, rgba(139, 92, 246, 0.8) 100%)",
              filter: "blur(30px)"
            }}></div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Нижняя секция с популярными серверами и отзывами */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="border-t border-white/5 pt-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-2">Популярные сервера уже с нами</h3>
            <p className="text-gray-400">Более 5000+ серверов выбрали FlyDonate для своих магазинов</p>
          </div>
          
          {/* Карточки серверов */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { 
                name: "MineWorld", 
                players: 1253, 
                logo: "M", 
                bg: "from-purple-600/20 to-indigo-600/20",
                reviews: 4.9,
                domain: "mineworld.flydonate.ru"
              },
              { 
                name: "CraftKingdom", 
                players: 857, 
                logo: "C", 
                bg: "from-pink-600/20 to-purple-600/20",
                reviews: 4.7,
                domain: "craftkingdom.com" 
              },
              { 
                name: "DiamondSMP", 
                players: 624, 
                logo: "D", 
                bg: "from-blue-600/20 to-indigo-600/20",
                reviews: 4.8,
                domain: "diamond-shop.flydonate.ru" 
              }
            ].map((server, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + i * 0.2, duration: 0.5 }}
                className="glass-panel border border-white/10 p-6 rounded-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500/30 to-transparent px-4 py-1 rounded-bl-xl text-xs font-medium text-white">
                  {server.players} игроков
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${server.bg} flex items-center justify-center text-white font-bold text-xl`}>
                    {server.logo}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{server.name}</h4>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-3 w-3 ${star <= Math.floor(server.reviews) ? "text-yellow-400" : "text-gray-600"}`}
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-400 text-xs ml-1">{server.reviews.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-3 mb-4">
                  <div className="text-white/60 text-xs mb-1">Домен магазина:</div>
                  <div className="text-white/90 text-sm font-medium">{server.domain}</div>
                </div>
                
                <div className="text-white/80 text-sm italic">
                  "FlyDonate помог увеличить наши продажи на 140% всего за месяц. Отличный сервис!"
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Отзывы */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Отзывы администраторов</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Александр_MC",
                server: "MineWorld",
                avatar: "А",
                text: "После перехода на FlyDonate, прибыль нашего сервера выросла на 78%. Игроки оценили удобный интерфейс и скорость покупки привилегий. Мы очень довольны!"
              },
              {
                name: "DiamondAdmin",
                server: "DiamondSMP",
                avatar: "D",
                text: "Наконец-то нашел сервис, где можно быстро настроить магазин и не беспокоиться о технических проблемах. Служба поддержки всегда на связи, а комиссии реально низкие."
              }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + i * 0.2, duration: 0.5 }}
                className="glass-panel border border-white/10 p-6 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{review.name}</h4>
                    <p className="text-purple-400 text-sm">{review.server}</p>
                    <p className="text-white/80 mt-3 text-sm leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

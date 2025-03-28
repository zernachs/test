import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Список популярных серверов, использующих наш сервис
const servers = [
  {
    name: "SkyGames",
    logo: "🌌",
    players: "7500+",
    created: "12.01.2025",
    online: true,
    color: "from-[#ff2a6d] to-[#1b2735]"
  },
  {
    name: "CraftZone",
    logo: "⛏️",
    players: "5800+",
    created: "22.02.2025",
    online: true,
    color: "from-[#05d9e8] to-[#005678]"
  },
  {
    name: "PixelVerse",
    logo: "🎲",
    players: "3200+",
    created: "05.03.2025",
    online: true,
    color: "from-[#d65db1] to-[#845ec2]"
  },
  {
    name: "FutureRealm",
    logo: "🚀",
    players: "4100+",
    created: "18.01.2025",
    online: true,
    color: "from-[#ff9671] to-[#ff6f91]"
  },
  {
    name: "DragonCraft",
    logo: "🐉",
    players: "3900+",
    created: "26.02.2025",
    online: true,
    color: "from-[#5a189a] to-[#7b2cbf]"
  },
  {
    name: "CyberWorld",
    logo: "💻",
    players: "2700+",
    created: "17.03.2025",
    online: true,
    color: "from-[#3a86ff] to-[#0077b6]"
  },
  {
    name: "MagicQuest",
    logo: "✨",
    players: "3300+",
    created: "04.02.2025",
    online: true,
    color: "from-[#f72585] to-[#7209b7]"
  },
  {
    name: "BattleArena",
    logo: "⚔️",
    players: "5100+",
    created: "09.03.2025",
    online: true,
    color: "from-[#ff7700] to-[#ff2b00]"
  }
];

// Пульсирующая анимация
const pulseVariant = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.3)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Слайдер с анимацией
const sliderVariant = {
  hidden: { x: 100, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

// Анимация заголовка
const titleVariant = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Анимированный счетчик
function AnimatedCounter({ end, duration = 2000 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return <span>{count}</span>;
}

// Компонент сервера
function ServerCard({ server, index, inView }: { server: any, index: number, inView: boolean }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      variants={pulseVariant}
      className="relative group"
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${server.color} opacity-10 blur-lg group-hover:opacity-30 transition-opacity duration-300`} />
      <div className="relative bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 h-full transition-all duration-500 overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br opacity-30 blur-2xl rounded-full group-hover:opacity-40" />
        
        <div className="flex items-center gap-4 mb-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${server.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-all duration-300`}>
            {server.logo}
          </div>
          <div>
            <h3 className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors duration-300">{server.name}</h3>
            <div className="flex items-center mt-1 gap-2">
              <div className="relative w-2.5 h-2.5">
                <div className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping" />
                <div className="relative rounded-full w-2.5 h-2.5 bg-green-500" />
              </div>
              <span className="text-xs text-green-400 font-medium">Онлайн</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 my-3">
          <div className="bg-white/5 rounded-lg p-2">
            <span className="text-xs text-gray-400 block">Игроков онлайн</span>
            <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">{server.players}</span>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <span className="text-xs text-gray-400 block">Дата запуска</span>
            <span className="text-lg font-medium text-white">{server.created}</span>
          </div>
        </div>
        
        <div className="mt-4 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '85%' }}
            transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${server.color}`} 
          />
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-xs text-gray-400">Стабильность</span>
          <span className="text-xs text-white font-medium">85%</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServersSection() {
  const [inView, setInView] = useState(false);

  return (
    <section className="py-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0613]/80 via-black/80 to-black/95 -z-10"></div>
      
      {/* Декоративные элементы */}
      <div className="absolute left-0 top-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute right-0 bottom-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute left-1/4 bottom-1/3 w-64 h-64 bg-pink-600/20 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={titleVariant}
          className="text-center mb-16"
          onViewportEnter={() => setInView(true)}
        >
          <div className="inline-block px-6 py-1.5 mb-4 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/20">
            <p className="text-sm text-gray-300">
              <span className="text-purple-400 font-semibold">+12</span> серверов присоединились за последнюю неделю
            </p>
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Более <AnimatedCounter end={1100} /> серверов используют нашу платформу
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Популярные игровые проекты выбирают нас для организации донатов 
            и безопасного приема платежей от своих игроков
          </p>
        </motion.div>

        <div className="relative">
          {/* Первый ряд серверов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servers.slice(0, 4).map((server, index) => (
              <ServerCard 
                key={server.name} 
                server={server} 
                index={index}
                inView={inView}
              />
            ))}
          </div>

          {/* Второй ряд серверов */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servers.slice(4).map((server, index) => (
              <ServerCard 
                key={server.name} 
                server={server} 
                index={index + 4}
                inView={inView}
              />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group">
              <p className="text-gray-200 flex items-center">
                <span className="font-bold text-white group-hover:text-purple-300 transition-colors duration-300">Присоединиться к сообществу</span>
                <motion.span 
                  initial={{ x: 0 }} 
                  animate={{ x: [0, 5, 0] }} 
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                  className="ml-2 inline-block"
                >
                  →
                </motion.span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

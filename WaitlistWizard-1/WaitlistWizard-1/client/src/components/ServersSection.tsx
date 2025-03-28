import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";

// Тип данных для хранения информации о сервере
type ServerStore = {
  id: number;
  name: string;
  description: string;
  serverIp?: string | null;
  logoUrl?: string | null;
  customDomain?: string | null;
  activeUsers: number;
  todayRevenue: number;
  totalRevenue: number;
  createdAt: string;
};

// Функция для форматирования числа с разделителями (пример: 1,000,000)
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function ServersSection() {
  const [servers, setServers] = useState<ServerStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Получаем список существующих магазинов с сервера
  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await fetch('/api/stores/public');
        if (response.ok) {
          const data = await response.json();
          setServers(data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке магазинов:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStores();
  }, []);

  return (
    <section id="servers" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Сервера использующие FlyDonate
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Присоединяйтесь к сотням Minecraft серверов, которые уже используют нашу платформу для монетизации
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {isLoading ? (
            // Состояние загрузки
            <>
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="bg-black/30 rounded-xl shadow-lg p-6 border border-purple-900/30 backdrop-blur-sm animate-pulse">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-900/50"></div>
                      <div>
                        <div className="h-4 w-24 bg-purple-900/50 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-purple-900/30 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-purple-900/30 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-purple-900/30 rounded mb-6"></div>
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="h-3 w-16 bg-purple-900/30 rounded mb-1"></div>
                      <div className="h-4 w-20 bg-purple-900/40 rounded"></div>
                    </div>
                    <div>
                      <div className="h-3 w-16 bg-purple-900/30 rounded mb-1"></div>
                      <div className="h-4 w-20 bg-purple-900/40 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : servers.length > 0 ? (
            // Отображаем существующие магазины
            servers.map((server, index) => (
              <motion.div
                key={server.id}
                variants={fadeIn}
                className="bg-black/30 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-purple-900/30 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                      {server.logoUrl ? (
                        <img 
                          src={server.logoUrl} 
                          alt={server.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        server.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{server.name}</h3>
                      {server.serverIp && (
                        <div className="flex items-center mt-1">
                          <div className="online-indicator mr-2" />
                          <span className="text-green-400 text-xs font-medium">{server.serverIp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link href={`/store/${server.id}`}>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20">
                      Посетить
                    </Button>
                  </Link>
                </div>

                <p className="text-gray-300 mb-6 line-clamp-2">{server.description || "Донат-магазин сервера Minecraft"}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl p-3">
                    <div className="text-white/60 text-xs mb-1">Прибыль за сегодня</div>
                    <div className="gradient-text font-bold text-xl">{formatNumber(server.todayRevenue)} ₽</div>
                  </div>
                  <div className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl p-3">
                    <div className="text-white/60 text-xs mb-1">Всего заработано</div>
                    <div className="gradient-text font-bold text-xl">{formatNumber(server.totalRevenue)} ₽</div>
                  </div>
                </div>
                
                <div className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl p-3">
                  <div className="text-white/60 text-xs mb-1">Активных игроков</div>
                  <div className="gradient-text font-bold text-xl">{formatNumber(server.activeUsers)}</div>
                </div>
              </motion.div>
            ))
          ) : (
            // Пустое состояние с приглашением
            <motion.div
              variants={fadeIn}
              className="col-span-full bg-black/30 rounded-xl shadow-lg p-10 border border-purple-900/30 backdrop-blur-sm text-center"
            >
              <div className="w-20 h-20 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Здесь мог бы быть ваш сервер</h3>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                К сожалению, вы еще не перешли на нашу платформу. Сотни владельцев Minecraft серверов уже монетизируют свои проекты с помощью FlyDonate.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/register">
                  <Button className="gradient-button px-6 py-2 text-base">
                    Создать магазин
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-400 text-white px-6 py-2 text-base">
                    Войти в систему
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
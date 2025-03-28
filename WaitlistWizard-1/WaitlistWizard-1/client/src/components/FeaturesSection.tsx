import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";

const features = [
  {
    icon: "bolt",
    title: "Мгновенные уведомления",
    description: "Получайте уведомления о новых донатах в реальном времени на вашем устройстве."
  },
  {
    icon: "shield",
    title: "Безопасные платежи",
    description: "Все транзакции защищены по высшим стандартам безопасности финансовых систем."
  },
  {
    icon: "sparkles",
    title: "Кастомизация",
    description: "Настраивайте внешний вид уведомлений о донатах под свой стиль и бренд."
  },
  {
    icon: "money",
    title: "Без комиссий",
    description: "Мы не берем комиссию с донатов, вы получаете 100% от пожертвований ваших зрителей."
  },
  {
    icon: "chart-line",
    title: "Аналитика и статистика",
    description: "Отслеживайте динамику донатов и прогресс роста вашего канала через удобный дашборд."
  },
  {
    icon: "device-mobile",
    title: "Мобильное приложение",
    description: "Управляйте своими донатами с любого устройства с помощью нашего мобильного приложения."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Почему владельцы серверов выбирают FlyDonate
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Наш сервис создан специально для владельцев Minecraft серверов, чтобы сделать процесс получения донатов максимально простым и выгодным.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-black/30 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-purple-900/30 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/30 to-indigo-600/30 flex items-center justify-center mb-6 backdrop-blur-sm border border-purple-500/20">
                <FeatureIcon name={feature.icon} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface FeatureIconProps {
  name: string;
}

function FeatureIcon({ name }: FeatureIconProps) {
  const renderIcon = () => {
    switch (name) {
      case "bolt":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "shield":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        );
      case "sparkles":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case "money":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "chart-line":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        );
      case "device-mobile":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  return renderIcon();
}

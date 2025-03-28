import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Как подключить FlyDonate к своему Minecraft серверу?",
    answer: "Зарегистрируйтесь на нашем сайте, создайте свой магазин привилегий, настройте категории и привилегии, затем интегрируйте его с вашим сервером через наши API или плагины. Инструкции доступны в вашем личном кабинете."
  },
  {
    question: "Какие способы оплаты поддерживаются?",
    answer: "FlyDonate поддерживает все популярные способы оплаты: банковские карты, электронные кошельки, мобильные платежи и криптовалюты. Мы постоянно расширяем список доступных методов оплаты."
  },
  {
    question: "Берет ли FlyDonate комиссию с донатов?",
    answer: "Нет, мы не взимаем комиссию с полученных донатов. Вы получаете 100% от суммы пожертвований от ваших игроков. Мы зарабатываем на дополнительных премиум-функциях и партнерских программах."
  },
  {
    question: "Как быстро приходят деньги на мой счет?",
    answer: "Деньги поступают на ваш счет мгновенно после совершения доната. Вывод средств на вашу банковскую карту или электронный кошелек обычно занимает от нескольких минут до 24 часов, в зависимости от выбранного метода."
  },
  {
    question: "Можно ли настроить уведомления о донатах?",
    answer: "Да, в личном кабинете вы можете полностью настроить внешний вид и звук уведомлений о донатах. Доступны различные шаблоны и возможность загрузки собственных изображений и звуков."
  },
  {
    question: "Какой минимальный размер доната?",
    answer: "Минимальный размер доната составляет 10 рублей. Максимальный размер не ограничен, но может применяться дополнительная верификация для крупных переводов в целях безопасности."
  }
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Часто задаваемые вопросы
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Получите ответы на самые популярные вопросы о сервисе FlyDonate
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeIn}>
                <AccordionItem 
                  value={`item-${index}`} 
                  className="border border-purple-900/30 rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm"
                >
                  <AccordionTrigger 
                    className="px-6 py-4 text-lg font-medium text-white hover:no-underline hover:text-purple-400"
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

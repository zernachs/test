import { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { waitlistFormSchema, type WaitlistFormData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckIcon } from "lucide-react";

export default function WaitlistSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: "",
      name: "",
      privacyPolicy: true,
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: WaitlistFormData) => {
      const response = await apiRequest("POST", "/api/waitlist", {
        email: data.email,
        name: data.name,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: "Вы подписались на новости FlyDonate. Мы сообщим вам о всех обновлениях!",
        duration: 5000,
      });
      setIsSubmitted(true);
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Не удалось подписаться. Пожалуйста, попробуйте снова.";
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: errorMessage,
        duration: 5000,
      });
    },
  });

  async function onSubmit(data: WaitlistFormData) {
    await waitlistMutation.mutateAsync(data);
  }

  return (
    <section id="waitlist" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Начните зарабатывать на Minecraft сервере уже сегодня
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Регистрируйтесь сейчас, чтобы получить все преимущества FlyDonate и улучшить свой Minecraft сервер
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="max-w-md mx-auto"
        >
          <div className="bg-black/30 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-purple-900/30">
            {!isSubmitted ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email адрес</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="вы@пример.com"
                            {...field}
                            className="px-4 py-3 bg-black/50 border-purple-900/50 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Ваше имя</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Иван Иванов"
                            {...field}
                            className="px-4 py-3 bg-black/50 border-purple-900/50 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="privacyPolicy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-purple-500 data-[state=checked]:bg-purple-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal text-gray-300">
                            Я согласен с <a href="#" className="text-purple-400 hover:text-purple-300">Политикой конфиденциальности</a> и получением новостей на email.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none text-white flex items-center justify-center"
                    disabled={waitlistMutation.isPending}
                  >
                    {waitlistMutation.isPending ? (
                      "Отправка..."
                    ) : (
                      <>
                        <span>Зарегистрироваться</span>
                        <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                  <CheckIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Вы подписались!</h3>
                <p className="text-gray-300">
                  Спасибо за регистрацию в FlyDonate. Мы отправили вам письмо с подтверждением.
                </p>
                <div className="mt-6">
                  <div className="flex justify-center space-x-4">
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">
                    Поделитесь с друзьями в социальных сетях
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useLocation } from "wouter";

// Создаём схему для формы регистрации
const registerSchema = z.object({
  email: z.string().email({ message: "Введите корректный email" }),
  username: z.string().min(3, { message: "Имя пользователя должно содержать не менее 3 символов" }),
  password: z.string().min(6, { message: "Пароль должен содержать не менее 6 символов" }),
  confirmPassword: z.string().min(6, { message: "Пароли должны совпадать" }),
  privacyPolicy: z.boolean().refine(value => value === true, {
    message: "Необходимо принять политику конфиденциальности"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      privacyPolicy: true,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await apiRequest("POST", "/api/auth/register", {
        email: data.email,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        privacyPolicy: data.privacyPolicy,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: "Вы успешно зарегистрировались в FlyDonate. Теперь вы можете войти в систему!",
        duration: 5000,
      });
      setIsSubmitted(true);
      // Редирект на страницу входа через 2 секунды
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Не удалось зарегистрироваться. Пожалуйста, попробуйте снова.";
      toast({
        variant: "destructive",
        title: "Ошибка регистрации",
        description: errorMessage,
        duration: 5000,
      });
    },
  });

  async function onSubmit(data: RegisterFormData) {
    await registerMutation.mutateAsync(data);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-6">
                Присоединяйтесь к FlyDonate
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Зарегистрируйтесь сейчас и получите доступ ко всем возможностям сервиса для монетизации Minecraft серверов. Создайте свой магазин привилегий и начните зарабатывать прямо сегодня!
              </p>
              <div className="hidden md:block">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-purple-500/20 p-1 rounded-full">
                      <CheckIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="text-gray-300">Быстрая настройка магазина привилегий для Minecraft сервера</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-purple-500/20 p-1 rounded-full">
                      <CheckIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="text-gray-300">Множество способов оплаты без комиссии</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-purple-500/20 p-1 rounded-full">
                      <CheckIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="text-gray-300">Автоматическая выдача привилегий через серверные команды</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-purple-900/30">
                {!isSubmitted ? (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Создать аккаунт</h2>
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
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Имя пользователя</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="minecraft_admin"
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
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Пароль</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
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
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Подтвердите пароль</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
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
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
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
                    <div className="mt-6 text-center">
                      <p className="text-gray-400">
                        Уже есть аккаунт?{" "}
                        <Link href="/login">
                          <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Войти</span>
                        </Link>
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                      <CheckIcon className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Успешная регистрация!</h3>
                    <p className="text-gray-300">
                      Спасибо за регистрацию в FlyDonate. Ваш аккаунт создан и готов к использованию. Теперь вы можете войти в систему и создать свой магазин привилегий для Minecraft сервера.
                    </p>
                    <div className="mt-8">
                      <Link href="/">
                        <Button
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none text-white"
                        >
                          Вернуться на главную
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
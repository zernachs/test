import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

import { loginFormSchema } from "@shared/schema";
import { z } from "zod";

type LoginFormData = { username: string; password: string; rememberMe?: boolean };

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // Получаем параметр redirect из URL, если он есть
  const searchParams = new URLSearchParams(window.location.search);
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema.extend({
      rememberMe: z.boolean().optional(),
    })),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: true,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      try {
        // Извлекаем rememberMe, но не передаем его на сервер
        const { rememberMe, ...loginData } = data;
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
          credentials: "include"
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.message || "Неверное имя пользователя или пароль");
        }
        
        return responseData;
      } catch (error: any) {
        throw new Error(error.message || "Не удалось войти. Проверьте имя пользователя и пароль.");
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Вход выполнен успешно!",
        description: "Добро пожаловать в личный кабинет FlyDonate для Minecraft-серверов.",
        duration: 5000,
      });
      
      // Инвалидируем запрос сессии, чтобы получить новую информацию о пользователе
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      
      // Перенаправляем пользователя после успешного входа
      setLocation(redirectUrl);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: error.message || "Не удалось войти. Проверьте имя пользователя и пароль.",
        duration: 5000,
      });
    }
  });

  async function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn}
            className="flex flex-col items-center"
          >
            <div className="w-full">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  Войти в аккаунт
                </h1>
                <p className="mt-3 text-gray-300">
                  Войдите в свой аккаунт FlyDonate, чтобы получить доступ к личному кабинету Minecraft-магазина
                </p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-purple-900/30">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Имя пользователя</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Введите имя пользователя"
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
                              placeholder="Введите пароль"
                              {...field}
                              className="px-4 py-3 bg-black/50 border-purple-900/50 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <FormField
                        control={form.control}
                        name="rememberMe"
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
                                Запомнить меня
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
                        Забыли пароль?
                      </a>
                    </div>

                    <Button
                      type="submit"
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none text-white flex items-center justify-center"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Выполняется вход..." : "Войти"}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    Ещё нет аккаунта?{" "}
                    <Link href="/register">
                      <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Зарегистрироваться</span>
                    </Link>
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">
                  Войдя, вы соглашаетесь с{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-300">Условиями использования</a>
                  {" "}и{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-300">Политикой конфиденциальности</a>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ServerIcon, CheckIcon, ArrowLeftIcon } from "lucide-react";
import { insertStoreSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

const createStoreSchema = insertStoreSchema.extend({
  // Добавляем валидацию для полей
  name: z.string()
    .min(3, "Название магазина должно содержать минимум 3 символа")
    .max(30, "Название магазина не должно превышать 30 символов"),
  description: z.string()
    .min(10, "Описание должно содержать минимум 10 символов")
    .max(500, "Описание не должно превышать 500 символов")
    .nullable(),
  serverIp: z.string()
    .nullable()
    .optional()
    .transform(val => val === "" ? null : val),
});

type CreateStoreFormData = z.infer<typeof createStoreSchema>;

export default function CreateStore() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdStore, setCreatedStore] = useState<any>(null);

  const form = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      description: "",
      serverIp: "",
    },
  });

  const createStoreMutation = useMutation({
    mutationFn: async (data: CreateStoreFormData) => {
      const response = await apiRequest("POST", "/api/stores", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Магазин создан!",
        description: "Ваш магазин успешно создан и готов к настройке.",
        duration: 5000,
      });
      setCreatedStore(data);
      setIsSubmitted(true);
      
      // Инвалидируем запрос магазинов, чтобы получить обновленный список
      queryClient.invalidateQueries({ queryKey: ['/api/stores'] });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Не удалось создать магазин. Пожалуйста, попробуйте снова.";
      toast({
        variant: "destructive",
        title: "Ошибка создания магазина",
        description: errorMessage,
        duration: 5000,
      });
    },
  });

  function onSubmit(data: CreateStoreFormData) {
    createStoreMutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 mx-auto py-12">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-gray-400 hover:text-white"
            onClick={() => setLocation('/dashboard')}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Назад к панели управления
          </Button>
        </div>
        
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn}
          className="w-full max-w-3xl mx-auto"
        >
          {!isSubmitted ? (
            <Card className="bg-black/30 border-purple-900/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <ServerIcon className="h-6 w-6 text-purple-400" />
                  Создание магазина привилегий
                </CardTitle>
                <CardDescription>
                  Создайте свой первый магазин привилегий для вашего Minecraft сервера
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Название магазина</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="FlyDonate - MyCraft Server"
                              {...field}
                              className="px-4 py-3 bg-black/50 border-purple-900/50 text-white"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Название вашего магазина, которое будет отображаться в шапке сайта
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Описание магазина</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Официальный магазин привилегий сервера MyCraft. У нас вы можете приобрести различные привилегии и предметы для комфортной игры."
                              {...field}
                              value={field.value || ''}
                              className="min-h-[120px] px-4 py-3 bg-black/50 border-purple-900/50 text-white"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Краткое описание вашего магазина, которое будет отображаться на главной странице
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="serverIp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IP адрес сервера (необязательно)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="mc.myserver.ru"
                              {...field}
                              value={field.value || ''}
                              className="px-4 py-3 bg-black/50 border-purple-900/50 text-white"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            IP адрес вашего Minecraft сервера для игроков
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  
                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none text-white flex items-center justify-center"
                        disabled={createStoreMutation.isPending}
                      >
                        {createStoreMutation.isPending ? (
                          "Создание..."
                        ) : (
                          <>
                            <span>Создать магазин</span>
                            <ServerIcon className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-black/30 border-purple-900/30 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                  <CheckIcon className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-center">
                  Магазин успешно создан!
                </CardTitle>
                <CardDescription className="text-center">
                  Ваш магазин привилегий готов к настройке
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/50 rounded-lg p-4 border border-purple-900/50">
                  <h3 className="font-medium text-purple-400 mb-1">Название магазина</h3>
                  <p>{createdStore?.name}</p>
                </div>
                
                <div className="bg-black/50 rounded-lg p-4 border border-purple-900/50">
                  <h3 className="font-medium text-purple-400 mb-1">Описание</h3>
                  <p>{createdStore?.description || 'Не указано'}</p>
                </div>
                
                {createdStore?.serverIp && (
                  <div className="bg-black/50 rounded-lg p-4 border border-purple-900/50">
                    <h3 className="font-medium text-purple-400 mb-1">IP адрес сервера</h3>
                    <p>{createdStore.serverIp}</p>
                  </div>
                )}
                
                <div className="rounded-lg p-4 border border-green-900/50 bg-green-950/20 mt-6">
                  <p className="text-green-400">
                    Следующие шаги: настройте категории и привилегии для вашего магазина, чтобы начать принимать платежи от игроков.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={() => setLocation(`/dashboard/stores/${createdStore.id}`)}
                >
                  Управление магазином
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation('/dashboard')}
                >
                  Вернуться на панель управления
                </Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, 
  ChevronRight, 
  CopyIcon, 
  ExternalLinkIcon, 
  Link2, 
  ServerIcon, 
  SettingsIcon, 
  TagIcon, 
  Trash2Icon, 
  Users 
} from "lucide-react";

import { Store, insertStoreSchema } from "@shared/schema";

// Схема для формы редактирования магазина
const editStoreSchema = insertStoreSchema.extend({
  name: z.string().min(3, { message: "Название должно содержать не менее 3 символов" }),
  description: z.string().optional(),
  serverIp: z.string().optional(),
  isActive: z.boolean().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  customDomain: z.string().optional(),
});

type EditStoreFormData = z.infer<typeof editStoreSchema>;

export default function StoreManagement() {
  const { id: storeIdStr } = useParams<{ id: string }>();
  const storeId = parseInt(storeIdStr);
  const [activeTab, setActiveTab] = useState("overview");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Запрашиваем данные магазина
  const { 
    data: store, 
    isLoading: isLoadingStore, 
    error: storeError 
  } = useQuery<Store>({
    queryKey: [`/api/stores/${storeId}`],
    retry: 1,
  });
  
  // Запрашиваем категории магазина
  const { 
    data: categories, 
    isLoading: isLoadingCategories 
  } = useQuery<any[]>({
    queryKey: [`/api/stores/${storeId}/categories`],
    enabled: !!storeId,
  });
  
  // Запрашиваем привилегии магазина
  const { 
    data: privileges, 
    isLoading: isLoadingPrivileges 
  } = useQuery<any[]>({
    queryKey: [`/api/stores/${storeId}/privileges`],
    enabled: !!storeId,
  });
  
  // Запрашиваем покупки в магазине
  const { 
    data: purchases, 
    isLoading: isLoadingPurchases 
  } = useQuery<any[]>({
    queryKey: [`/api/stores/${storeId}/purchases`],
    enabled: !!storeId,
  });
  
  // Мутация для обновления данных магазина
  const updateStoreMutation = useMutation({
    mutationFn: async (data: EditStoreFormData) => {
      const response = await apiRequest("PUT", `/api/stores/${storeId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Изменения сохранены",
        description: "Настройки магазина были успешно обновлены",
        duration: 5000,
      });
      
      // Обновляем кэшированные данные
      queryClient.invalidateQueries({
        queryKey: [`/api/stores/${storeId}`],
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Ошибка при сохранении",
        description: error.message || "Не удалось сохранить изменения. Попробуйте позже.",
        duration: 5000,
      });
    }
  });
  
  // Мутация для удаления магазина
  const deleteStoreMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/stores/${storeId}`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Магазин удален",
        description: "Магазин был успешно удален",
        duration: 5000,
      });
      
      // Обновляем список магазинов и перенаправляем на страницу Dashboard
      queryClient.invalidateQueries({
        queryKey: ['/api/stores'],
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Ошибка при удалении",
        description: error.message || "Не удалось удалить магазин. Попробуйте позже.",
        duration: 5000,
      });
    }
  });
  
  // Обработчик для формы редактирования магазина
  const form = useForm<EditStoreFormData>({
    resolver: zodResolver(editStoreSchema),
    defaultValues: {
      name: store?.name || "",
      description: store?.description || "",
      serverIp: store?.serverIp || "",
      isActive: store?.isActive || true,
      primaryColor: store?.primaryColor || "#0EA5E9",
      secondaryColor: store?.secondaryColor || "#3B82F6",
      customDomain: store?.customDomain || "",
    },
  });
  
  // Обновляем значения формы при загрузке данных
  React.useEffect(() => {
    if (store) {
      form.reset({
        name: store.name,
        description: store.description || "",
        serverIp: store.serverIp || "",
        isActive: store.isActive === null ? true : store.isActive,
        primaryColor: store.primaryColor || "#0EA5E9",
        secondaryColor: store.secondaryColor || "#3B82F6",
        customDomain: store.customDomain || "",
      });
    }
  }, [store, form]);
  
  // Функция сохранения изменений
  function onSubmit(data: EditStoreFormData) {
    updateStoreMutation.mutate(data);
  }
  
  // Функция копирования ссылки
  const copyStoreLink = () => {
    const origin = window.location.origin;
    const link = `${origin}/s/${storeId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на ваш магазин скопирована в буфер обмена",
      duration: 3000,
    });
  };
  
  // Проверка ошибок при загрузке магазина
  if (storeError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card className="max-w-md w-full bg-black/30 border-purple-900/30">
            <CardHeader>
              <CardTitle className="text-red-500">Ошибка загрузки</CardTitle>
              <CardDescription>
                Не удалось загрузить данные магазина
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                {(storeError as Error).message || "Произошла ошибка при загрузке данных магазина. Пожалуйста, попробуйте позже."}
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setLocation('/dashboard')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к списку магазинов
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Экран загрузки
  if (isLoadingStore) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-purple-500 rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow px-4 container mx-auto py-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn}
        >
          {/* Хлебные крошки и навигация */}
          <div className="mb-6 flex flex-wrap items-center text-sm text-gray-400">
            <button 
              onClick={() => setLocation('/dashboard')}
              className="hover:text-white transition"
            >
              Панель управления
            </button>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-white font-medium">{store?.name}</span>
          </div>
          
          {/* Заголовок и действия */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1 flex items-center">
                <ServerIcon className="h-7 w-7 mr-2 text-purple-400" />
                <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  {store?.name}
                </span>
              </h1>
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${store?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className="text-gray-400">
                  {store?.isActive ? 'Активен' : 'Неактивен'} • 
                  ID: {storeId} •
                  Создан: {store && new Date(store.createdAt!).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={copyStoreLink}
                className="flex gap-1"
              >
                <CopyIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Копировать ссылку</span>
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={() => window.open(`/s/${storeId}`, '_blank')}
                className="flex gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <ExternalLinkIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Открыть магазин</span>
              </Button>
            </div>
          </div>
          
          {/* Вкладки для управления */}
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <TabsList className="mb-8 grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-5 h-auto bg-black/30 rounded-xl p-1">
              <TabsTrigger 
                value="overview" 
                className="py-3 data-[state=active]:bg-purple-900/40"
              >
                <ServerIcon className="mr-2 h-4 w-4" />
                Обзор
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="py-3 data-[state=active]:bg-purple-900/40"
              >
                <TagIcon className="mr-2 h-4 w-4" />
                Категории
              </TabsTrigger>
              <TabsTrigger 
                value="privileges" 
                className="py-3 data-[state=active]:bg-purple-900/40"
              >
                <Users className="mr-2 h-4 w-4" />
                Привилегии
              </TabsTrigger>
              <TabsTrigger 
                value="purchases" 
                className="py-3 data-[state=active]:bg-purple-900/40"
              >
                <Users className="mr-2 h-4 w-4" />
                Покупки
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="py-3 data-[state=active]:bg-purple-900/40"
              >
                <SettingsIcon className="mr-2 h-4 w-4" />
                Настройки
              </TabsTrigger>
            </TabsList>
            
            {/* Вкладка обзора */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Статистика */}
                <Card className="bg-black/30 border-purple-900/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Статистика</CardTitle>
                    <CardDescription>Общая статистика магазина</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Категории</span>
                        <span className="font-medium">{isLoadingCategories ? '...' : (categories?.length || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Привилегии</span>
                        <span className="font-medium">{isLoadingPrivileges ? '...' : (privileges?.length || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Продажи</span>
                        <span className="font-medium">{isLoadingPurchases ? '...' : (purchases?.length || 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Информация о магазине */}
                <Card className="bg-black/30 border-purple-900/30 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Информация о магазине</CardTitle>
                    <CardDescription>Основные сведения о вашем магазине доната</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-1">Название магазина</h3>
                          <p className="text-gray-400">{store?.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-1">IP сервера</h3>
                          <p className="text-gray-400">{store?.serverIp || 'Не указан'}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-300 mb-1">Описание</h3>
                        <p className="text-gray-400">{store?.description || 'Описание отсутствует'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-300 mb-1">Ссылка на магазин</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-400 bg-black/20 px-3 py-1 rounded flex-grow">
                            {window.location.origin}/s/{storeId}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={copyStoreLink}
                            className="h-8"
                          >
                            <CopyIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Быстрые действия */}
                <Card className="bg-black/30 border-purple-900/30 md:col-span-3">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Быстрые действия</CardTitle>
                    <CardDescription>Управление вашим магазином</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <Button 
                        variant="outline"
                        className="h-auto py-6 flex flex-col items-center justify-center gap-3 bg-black/20 hover:bg-black/40"
                        onClick={() => setActiveTab("categories")}
                      >
                        <TagIcon className="h-6 w-6 text-purple-400" />
                        <div className="text-center">
                          <div className="font-medium mb-1">Управление категориями</div>
                          <p className="text-xs text-gray-400">Создание и редактирование категорий</p>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="h-auto py-6 flex flex-col items-center justify-center gap-3 bg-black/20 hover:bg-black/40"
                        onClick={() => setActiveTab("privileges")}
                      >
                        <Users className="h-6 w-6 text-purple-400" />
                        <div className="text-center">
                          <div className="font-medium mb-1">Управление привилегиями</div>
                          <p className="text-xs text-gray-400">Настройка привилегий сервера</p>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="h-auto py-6 flex flex-col items-center justify-center gap-3 bg-black/20 hover:bg-black/40"
                        onClick={() => setActiveTab("purchases")}
                      >
                        <ServerIcon className="h-6 w-6 text-purple-400" />
                        <div className="text-center">
                          <div className="font-medium mb-1">Просмотр покупок</div>
                          <p className="text-xs text-gray-400">История покупок и управление</p>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="h-auto py-6 flex flex-col items-center justify-center gap-3 bg-black/20 hover:bg-black/40"
                        onClick={() => setActiveTab("settings")}
                      >
                        <SettingsIcon className="h-6 w-6 text-purple-400" />
                        <div className="text-center">
                          <div className="font-medium mb-1">Настройки магазина</div>
                          <p className="text-xs text-gray-400">Оформление и настройки</p>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Вкладка категорий */}
            <TabsContent value="categories" className="space-y-6">
              <Card className="bg-black/30 border-purple-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Категории</span>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      onClick={() => setLocation(`/dashboard/stores/${storeId}/categories/create`)}
                    >
                      Создать категорию
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Управляйте категориями привилегий вашего магазина
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingCategories ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-t-2 border-purple-500 rounded-full"></div>
                    </div>
                  ) : (
                    <>
                      {categories && Array.isArray(categories) && categories.length > 0 ? (
                        <div className="space-y-4">
                          {/* Здесь будет список категорий */}
                          <div className="text-center py-8 text-gray-500">
                            Функционал в разработке
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-black/20 rounded-lg">
                          <TagIcon className="h-12 w-12 text-gray-600 mb-3 mx-auto" />
                          <h3 className="text-lg font-medium text-gray-300 mb-2">У вас пока нет категорий</h3>
                          <p className="text-gray-400 max-w-md mx-auto mb-4">
                            Создайте категории, чтобы организовать привилегии вашего магазина по группам
                          </p>
                          <Button 
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            onClick={() => setLocation(`/dashboard/stores/${storeId}/categories/create`)}
                          >
                            Создать первую категорию
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Вкладка привилегий */}
            <TabsContent value="privileges" className="space-y-6">
              <Card className="bg-black/30 border-purple-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Привилегии</span>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      onClick={() => setLocation(`/dashboard/stores/${storeId}/privileges/create`)}
                    >
                      Создать привилегию
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Управляйте привилегиями вашего Minecraft сервера
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingPrivileges ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-t-2 border-purple-500 rounded-full"></div>
                    </div>
                  ) : (
                    <>
                      {privileges && Array.isArray(privileges) && privileges.length > 0 ? (
                        <div className="space-y-4">
                          {/* Здесь будет список привилегий */}
                          <div className="text-center py-8 text-gray-500">
                            Функционал в разработке
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-black/20 rounded-lg">
                          <Users className="h-12 w-12 text-gray-600 mb-3 mx-auto" />
                          <h3 className="text-lg font-medium text-gray-300 mb-2">У вас пока нет привилегий</h3>
                          <p className="text-gray-400 max-w-md mx-auto mb-4">
                            Создайте привилегии, которые будут продаваться на вашем сервере
                          </p>
                          <Button 
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            onClick={() => setLocation(`/dashboard/stores/${storeId}/privileges/create`)}
                          >
                            Создать первую привилегию
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Вкладка покупок */}
            <TabsContent value="purchases" className="space-y-6">
              <Card className="bg-black/30 border-purple-900/30">
                <CardHeader>
                  <CardTitle>История покупок</CardTitle>
                  <CardDescription>
                    Просмотр всех транзакций и управление покупками
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingPurchases ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-t-2 border-purple-500 rounded-full"></div>
                    </div>
                  ) : (
                    <>
                      {purchases && Array.isArray(purchases) && purchases.length > 0 ? (
                        <div className="space-y-4">
                          {/* Здесь будет список покупок */}
                          <div className="text-center py-8 text-gray-500">
                            Функционал в разработке
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-black/20 rounded-lg">
                          <ServerIcon className="h-12 w-12 text-gray-600 mb-3 mx-auto" />
                          <h3 className="text-lg font-medium text-gray-300 mb-2">Пока нет покупок</h3>
                          <p className="text-gray-400 max-w-md mx-auto mb-4">
                            Здесь будут отображаться все покупки привилегий на вашем сервере
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Вкладка настроек */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-black/30 border-purple-900/30 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Основные настройки</CardTitle>
                    <CardDescription>
                      Настройте основные параметры вашего магазина
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
                                  placeholder="Название вашего магазина" 
                                  className="bg-black/50 border-purple-900/50"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Название, которое будет отображаться игрокам
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
                              <FormLabel>Описание</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Описание вашего сервера и магазина" 
                                  className="bg-black/50 border-purple-900/50 min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Краткая информация о вашем сервере
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
                              <FormLabel>IP сервера</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="play.example.com" 
                                  className="bg-black/50 border-purple-900/50"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                IP-адрес вашего Minecraft сервера
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="primaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Основной цвет</FormLabel>
                                <FormControl>
                                  <div className="flex gap-2">
                                    <div 
                                      className="w-10 h-10 rounded-md border border-gray-700" 
                                      style={{ backgroundColor: field.value }}
                                    ></div>
                                    <Input 
                                      type="color" 
                                      className="bg-black/50 border-purple-900/50 w-full"
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Основной цвет оформления
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="secondaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Дополнительный цвет</FormLabel>
                                <FormControl>
                                  <div className="flex gap-2">
                                    <div 
                                      className="w-10 h-10 rounded-md border border-gray-700" 
                                      style={{ backgroundColor: field.value }}
                                    ></div>
                                    <Input 
                                      type="color" 
                                      className="bg-black/50 border-purple-900/50 w-full"
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Дополнительный цвет оформления
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="customDomain"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Собственный домен</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="shop.yourserver.com" 
                                  className="bg-black/50 border-purple-900/50"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Настройте свой домен для магазина (опционально)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-900/30 p-4 bg-black/20">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Статус магазина</FormLabel>
                                <FormDescription>
                                  Активный магазин доступен для покупок
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-purple-600"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end pt-4">
                          <Button 
                            type="submit" 
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            disabled={updateStoreMutation.isPending}
                          >
                            {updateStoreMutation.isPending ? 
                              "Сохранение..." : 
                              "Сохранить изменения"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/30 border-purple-900/30 h-fit">
                  <CardHeader>
                    <CardTitle className="text-red-500">Опасная зона</CardTitle>
                    <CardDescription>
                      Действия, которые нельзя отменить
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Удаление магазина</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Это действие удалит ваш магазин и все связанные с ним данные навсегда. 
                        Это действие невозможно отменить.
                      </p>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            className="w-full bg-red-900/60 hover:bg-red-800"
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" />
                            Удалить магазин
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black/90 border border-red-900/50">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-500">
                              Вы уверены, что хотите удалить магазин?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Это действие нельзя отменить. Магазин "{store?.name}" будет удален навсегда 
                              вместе со всеми категориями, привилегиями и историей покупок.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-black/60 hover:bg-black/40 border-gray-800">
                              Отмена
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteStoreMutation.mutate()}
                              className="bg-red-900/60 hover:bg-red-800"
                              disabled={deleteStoreMutation.isPending}
                            >
                              {deleteStoreMutation.isPending ? 
                                "Удаление..." : 
                                "Удалить навсегда"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
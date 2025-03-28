import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, User } from "@shared/schema";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRightIcon, PlusIcon, ServerIcon, SettingsIcon, ShoppingCartIcon, TagIcon } from "lucide-react";

// Тип для данных сессии пользователя
interface UserSession {
  isAuthenticated: boolean;
  id?: number;
  username?: string;
  email?: string;
}

// Компонент для управления магазинами
export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("stores");
  
  // Запрашиваем информацию о пользователе
  const { data: user, isLoading: isLoadingUser } = useQuery<UserSession>({
    queryKey: ['/api/auth/me'],
  });
  
  // Запрашиваем магазины пользователя
  const { data: stores, isLoading: isLoadingStores } = useQuery<Store[]>({
    queryKey: ['/api/stores'],
    enabled: !!user?.isAuthenticated
  });
  
  // Функция для выхода из аккаунта
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };
  
  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-purple-500 rounded-full"></div>
      </div>
    );
  }
  
  if (!user?.isAuthenticated) {
    return null; // ProtectedRoute компонент должен перенаправить
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow px-4 container mx-auto py-8">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Панель управления FlyDonate
            </h1>
            <p className="text-gray-400 mt-1">
              Добро пожаловать, {user.username}! Управляйте своими Minecraft магазинами.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0"
            onClick={handleLogout}
          >
            Выйти из аккаунта
          </Button>
        </div>
        
        <Tabs 
          defaultValue="stores" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-8 grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto bg-black/30 rounded-xl p-1">
            <TabsTrigger 
              value="stores" 
              className="py-3 data-[state=active]:bg-purple-900/40"
            >
              <ServerIcon className="mr-2 h-4 w-4" />
              Магазины
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="py-3 data-[state=active]:bg-purple-900/40"
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              Профиль
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stores" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Карточка для создания нового магазина */}
              <Card className="hover:border-purple-500/50 transition-all duration-300 bg-black/30 border-purple-900/30 shadow-lg hover:shadow-purple-900/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <PlusIcon className="mr-2 h-5 w-5 text-purple-400" />
                    Создать магазин
                  </CardTitle>
                  <CardDescription>
                    Создайте новый Minecraft магазин
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-400 text-sm">
                    Создайте полностью настраиваемый магазин привилегий и предметов для вашего Minecraft сервера.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={() => setLocation('/dashboard/stores/create')}
                  >
                    Создать магазин
                    <PlusIcon className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Карточки магазинов пользователя */}
              {!isLoadingStores && stores && (stores as Store[]).map((store) => (
                <Card key={store.id} className="hover:border-purple-500/50 transition-all duration-300 bg-black/30 border-purple-900/30 shadow-lg hover:shadow-purple-900/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <ServerIcon className="mr-2 h-5 w-5 text-purple-400" />
                      {store.name}
                    </CardTitle>
                    <CardDescription>
                      {store.isActive ? 'Активен' : 'Неактивен'} • IP: {store.serverIp || 'Не указан'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {store.description || 'Описание отсутствует'}
                    </p>
                    <div className="mt-4 flex gap-4">
                      <div className="flex items-center text-sm">
                        <TagIcon className="h-4 w-4 mr-1 text-purple-400" />
                        <span>0 категорий</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <ShoppingCartIcon className="h-4 w-4 mr-1 text-purple-400" />
                        <span>0 продаж</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      onClick={() => setLocation(`/dashboard/stores/${store.id}`)}
                    >
                      Управление магазином
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(`/s/${store.id}`, '_blank')}
                    >
                      Открыть витрину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Состояние загрузки */}
              {isLoadingStores && (
                <Card className="bg-black/30 border-purple-900/30">
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-t-2 border-purple-500 rounded-full"></div>
                  </CardContent>
                </Card>
              )}
              
              {/* Если нет магазинов */}
              {!isLoadingStores && stores && (stores as Store[]).length === 0 && (
                <Card className="bg-black/30 border-purple-900/30 col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <ServerIcon className="h-16 w-16 text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">У вас пока нет магазинов</h3>
                    <p className="text-gray-400 text-center max-w-lg mb-6">
                      Создайте свой первый магазин привилегий для Minecraft сервера и начните принимать донаты от игроков
                    </p>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      onClick={() => setLocation('/dashboard/stores/create')}
                    >
                      Создать первый магазин
                      <PlusIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-black/30 border-purple-900/30">
              <CardHeader>
                <CardTitle>Настройки профиля</CardTitle>
                <CardDescription>
                  Управляйте данными вашего аккаунта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Имя пользователя</h3>
                    <p className="text-gray-400">{user.username}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Email</h3>
                    <p className="text-gray-400">{user.email}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" disabled>
                  Изменить пароль
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  disabled
                >
                  Сохранить изменения
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
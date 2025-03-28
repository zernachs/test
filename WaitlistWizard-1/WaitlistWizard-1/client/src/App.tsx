import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import CreateStore from "@/pages/CreateStore";
import StoreManagement from "@/pages/StoreManagement";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Тип для данных сессии пользователя
interface UserSession {
  isAuthenticated: boolean;
  id?: number;
  username?: string;
  email?: string;
}

// Защищенный маршрут, который будет проверять, авторизован ли пользователь
const ProtectedRoute = ({ component: Component, ...rest }: { component: React.ComponentType<any>, [key: string]: any }) => {
  const { data: user, isLoading } = useQuery<UserSession>({
    queryKey: ['/api/auth/me'],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  const [, setLocation] = useLocation();
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && (!user || !user.isAuthenticated)) {
      setShouldRedirect(true);
    }
  }, [user, isLoading]);

  React.useEffect(() => {
    if (shouldRedirect) {
      setLocation('/login?redirect=' + encodeURIComponent(rest.path || '/dashboard'));
    }
  }, [shouldRedirect, rest.path, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    );
  }

  if (shouldRedirect) {
    return null;
  }

  return <Component {...rest} user={user} />;
};

// Добавим наши маршруты
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/register" component={Register}/>
      
      {/* Защищенные маршруты для админ панели */}
      <Route path="/dashboard" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />
      <Route path="/dashboard/stores" component={(props) => <ProtectedRoute component={() => 
        <div className="flex items-center justify-center min-h-screen">Мои магазины (в разработке)</div>} 
        {...props} />} />
      <Route path="/dashboard/stores/create" component={(props) => <ProtectedRoute component={CreateStore} {...props} />} />
      <Route path="/dashboard/stores/:id" component={(props) => <ProtectedRoute component={StoreManagement} {...props} />} />
      <Route path="/dashboard/stores/:id/categories" component={(props) => <ProtectedRoute component={() => 
        <div className="flex items-center justify-center min-h-screen">Категории (в разработке)</div>} 
        {...props} />} />
      <Route path="/dashboard/stores/:id/privileges" component={(props) => <ProtectedRoute component={() => 
        <div className="flex items-center justify-center min-h-screen">Привилегии (в разработке)</div>} 
        {...props} />} />
      <Route path="/dashboard/stores/:id/purchases" component={(props) => <ProtectedRoute component={() => 
        <div className="flex items-center justify-center min-h-screen">История покупок (в разработке)</div>} 
        {...props} />} />
      <Route path="/dashboard/stores/:id/settings" component={(props) => <ProtectedRoute component={() => 
        <div className="flex items-center justify-center min-h-screen">Настройки магазина (в разработке)</div>} 
        {...props} />} />
      
      {/* Публичные маршруты для магазинов */}
      <Route path="/s/:id" component={() => 
        <div className="flex items-center justify-center min-h-screen">Магазин доната (в разработке)</div>} />
      <Route path="/s/:id/category/:categoryId" component={() => 
        <div className="flex items-center justify-center min-h-screen">Категория привилегий (в разработке)</div>} />
      <Route path="/s/:id/privilege/:privilegeId" component={() => 
        <div className="flex items-center justify-center min-h-screen">Покупка привилегии (в разработке)</div>} />
      <Route path="/s/:id/success" component={() => 
        <div className="flex items-center justify-center min-h-screen">Успешная покупка (в разработке)</div>} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen text-white">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;

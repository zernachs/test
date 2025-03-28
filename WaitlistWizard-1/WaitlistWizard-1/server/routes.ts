import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  waitlistFormSchema, 
  registerFormSchema, 
  loginFormSchema, 
  insertStoreSchema,
  insertCategorySchema,
  insertPrivilegeSchema,
  insertPurchaseSchema,
  insertUserSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcryptjs";
import session from "express-session";

// Простая проверка авторизации для защиты API
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "Не авторизован" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API для регистрации и входа пользователей
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Используем базовую схему для валидации на сервере
      const validatedData = insertUserSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const { username, password, email } = validatedData.data;
      
      // Проверка существующего пользователя
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(409).json({ message: "Пользователь с таким именем уже существует" });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: "Этот email уже зарегистрирован" });
      }
      
      // Хеширование пароля
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Создание пользователя
      const user = await storage.createUser({ 
        username, 
        password: hashedPassword,
        email
      });
      
      // Устанавливаем сессию
      if (req.session) {
        req.session.userId = user.id;
        req.session.username = user.username;
      }
      
      res.status(201).json({ 
        message: "Регистрация успешна",
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        } 
      });
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      res.status(500).json({ message: "Не удалось зарегистрироваться" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Валидация данных
      const validatedData = loginFormSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const { username, password } = validatedData.data;
      
      // Поиск пользователя
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Неверное имя пользователя или пароль" });
      }
      
      // Проверка пароля
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Неверное имя пользователя или пароль" });
      }
      
      // Устанавливаем сессию
      if (req.session) {
        req.session.userId = user.id;
        req.session.username = user.username;
      }
      
      res.json({ 
        message: "Вход выполнен успешно",
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        } 
      });
    } catch (error) {
      console.error("Ошибка при входе:", error);
      res.status(500).json({ message: "Не удалось войти" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Не удалось выйти" });
        }
        res.json({ message: "Выход выполнен успешно" });
      });
    } else {
      res.json({ message: "Выход выполнен успешно" });
    }
  });
  
  app.get("/api/auth/me", async (req, res) => {
    try {
      // Если пользователь не авторизован, возвращаем соответствующий статус
      if (!req.session?.userId) {
        return res.json({ isAuthenticated: false });
      }
      
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.json({ isAuthenticated: false });
      }
      
      res.json({
        isAuthenticated: true,
        id: user.id,
        username: user.username,
        email: user.email
      });
    } catch (error) {
      console.error("Ошибка при получении профиля:", error);
      res.status(500).json({ message: "Не удалось получить профиль" });
    }
  });
  
  // API для получения публичных магазинов (располагаем перед другими endpoints с /api/stores)
  app.get('/api/stores/public', async (req, res) => {
    try {
      // Получаем все магазины
      const stores = await storage.getAllStores();
      
      // Для тестирования создадим тестовые данные, если магазинов нет
      if (stores.length === 0) {
        // Возвращаем пустой массив
        return res.json([]);
      }
      
      // Получаем данные о покупках для каждого магазина
      const storesWithPurchases = await Promise.all(
        stores.map(async (store) => {
          // Получаем все покупки для этого магазина
          const purchases = await storage.getPurchasesByStoreId(store.id);
          
          // Рассчитываем статистику
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Сумма за сегодня
          const todayRevenue = purchases
            .filter(p => p.status === "completed" && p.purchaseDate && p.purchaseDate >= today)
            .reduce((sum, p) => sum + p.price, 0);
          
          // Общая сумма доходов
          const totalRevenue = purchases
            .filter(p => p.status === "completed")
            .reduce((sum, p) => sum + p.price, 0);
          
          // Активные пользователи (в реальном приложении здесь была бы настоящая статистика)
          const activeUsers = Math.floor(Math.random() * 500) + 50;
          
          return {
            id: store.id,
            name: store.name,
            description: store.description,
            serverIp: store.serverIp,
            logoUrl: store.logoUrl,
            customDomain: store.customDomain,
            todayRevenue,
            totalRevenue,
            activeUsers,
            createdAt: store.createdAt
          };
        })
      );
      
      res.json(storesWithPurchases);
    } catch (error) {
      console.error("Ошибка при получении данных о магазинах:", error);
      res.status(500).json({ message: "Не удалось получить данные о магазинах" });
    }
  });
  
  // API для управления магазинами
  app.get("/api/stores", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session?.userId!;
      const stores = await storage.getStoresByUserId(userId);
      
      res.json(stores);
    } catch (error) {
      console.error("Ошибка при получении магазинов:", error);
      res.status(500).json({ message: "Не удалось получить магазины" });
    }
  });
  
  app.post("/api/stores", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session?.userId!;
      
      // Валидация данных
      const validatedData = insertStoreSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Создание магазина
      const store = await storage.createStore({
        ...validatedData.data,
        userId
      });
      
      res.status(201).json(store);
    } catch (error) {
      console.error("Ошибка при создании магазина:", error);
      res.status(500).json({ message: "Не удалось создать магазин" });
    }
  });
  
  app.get("/api/stores/:id", async (req, res) => {
    try {
      const storeId = parseInt(req.params.id);
      
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "Некорректный ID магазина" });
      }
      
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).json({ message: "Магазин не найден" });
      }
      
      res.json(store);
    } catch (error) {
      console.error("Ошибка при получении магазина:", error);
      res.status(500).json({ message: "Не удалось получить магазин" });
    }
  });
  
  app.put("/api/stores/:id", isAuthenticated, async (req, res) => {
    try {
      const storeId = parseInt(req.params.id);
      const userId = req.session?.userId!;
      
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "Некорректный ID магазина" });
      }
      
      // Проверка владельца магазина
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).json({ message: "Магазин не найден" });
      }
      
      if (store.userId !== userId) {
        return res.status(403).json({ message: "У вас нет прав на редактирование этого магазина" });
      }
      
      // Обновление магазина
      const updatedStore = await storage.updateStore(storeId, req.body);
      
      res.json(updatedStore);
    } catch (error) {
      console.error("Ошибка при обновлении магазина:", error);
      res.status(500).json({ message: "Не удалось обновить магазин" });
    }
  });
  
  app.delete("/api/stores/:id", isAuthenticated, async (req, res) => {
    try {
      const storeId = parseInt(req.params.id);
      const userId = req.session?.userId!;
      
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "Некорректный ID магазина" });
      }
      
      // Проверка владельца магазина
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).json({ message: "Магазин не найден" });
      }
      
      if (store.userId !== userId) {
        return res.status(403).json({ message: "У вас нет прав на удаление этого магазина" });
      }
      
      // Удаление магазина
      await storage.deleteStore(storeId);
      
      res.json({ message: "Магазин успешно удален" });
    } catch (error) {
      console.error("Ошибка при удалении магазина:", error);
      res.status(500).json({ message: "Не удалось удалить магазин" });
    }
  });
  
  // API для работы с категориями
  app.get("/api/stores/:storeId/categories", async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "Некорректный ID магазина" });
      }
      
      const categories = await storage.getCategoriesByStoreId(storeId);
      
      res.json(categories);
    } catch (error) {
      console.error("Ошибка при получении категорий:", error);
      res.status(500).json({ message: "Не удалось получить категории" });
    }
  });
  
  app.post("/api/stores/:storeId/categories", isAuthenticated, async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const userId = req.session?.userId!;
      
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "Некорректный ID магазина" });
      }
      
      // Проверка владельца магазина
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).json({ message: "Магазин не найден" });
      }
      
      if (store.userId !== userId) {
        return res.status(403).json({ message: "У вас нет прав на редактирование этого магазина" });
      }
      
      // Валидация данных
      const validatedData = insertCategorySchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Создание категории
      const category = await storage.createCategory({
        ...validatedData.data,
        storeId
      });
      
      res.status(201).json(category);
    } catch (error) {
      console.error("Ошибка при создании категории:", error);
      res.status(500).json({ message: "Не удалось создать категорию" });
    }
  });
  
  // API для работы с привилегиями
  app.get("/api/stores/:storeId/privileges", async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "Некорректный ID магазина" });
      }
      
      let privileges;
      
      if (categoryId !== undefined) {
        if (isNaN(categoryId)) {
          return res.status(400).json({ message: "Некорректный ID категории" });
        }
        
        privileges = await storage.getPrivilegesByCategoryId(categoryId);
      } else {
        privileges = await storage.getPrivilegesByStoreId(storeId);
      }
      
      res.json(privileges);
    } catch (error) {
      console.error("Ошибка при получении привилегий:", error);
      res.status(500).json({ message: "Не удалось получить привилегии" });
    }
  });
  
  app.post("/api/stores/:storeId/privileges", isAuthenticated, async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const userId = req.session?.userId!;
      
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "Некорректный ID магазина" });
      }
      
      // Проверка владельца магазина
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).json({ message: "Магазин не найден" });
      }
      
      if (store.userId !== userId) {
        return res.status(403).json({ message: "У вас нет прав на редактирование этого магазина" });
      }
      
      // Валидация данных
      const validatedData = insertPrivilegeSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Создание привилегии
      const privilege = await storage.createPrivilege({
        ...validatedData.data,
        storeId
      });
      
      res.status(201).json(privilege);
    } catch (error) {
      console.error("Ошибка при создании привилегии:", error);
      res.status(500).json({ message: "Не удалось создать привилегию" });
    }
  });
  
  // API для покупок привилегий
  app.post("/api/stores/:storeId/purchases", async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "Некорректный ID магазина" });
      }
      
      // Проверка существования магазина
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).json({ message: "Магазин не найден" });
      }
      
      // Валидация данных
      const validatedData = insertPurchaseSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const { privilegeId, playerName, email } = validatedData.data;
      
      // Получаем привилегию для определения цены
      const privilege = await storage.getPrivilege(privilegeId);
      
      if (!privilege) {
        return res.status(404).json({ message: "Привилегия не найдена" });
      }
      
      // Рассчитываем итоговую цену с учетом скидки
      const finalPrice = privilege.discountPercent 
        ? Math.round(privilege.price * (1 - privilege.discountPercent / 100)) 
        : privilege.price;
      
      // Создание покупки
      const purchase = await storage.createPurchase({
        privilegeId,
        playerName,
        email: email || null,
        storeId,
        price: finalPrice
      });
      
      // В реальном приложении здесь бы создавался платеж
      // и пользователь перенаправлялся на страницу оплаты
      
      res.status(201).json({
        purchase,
        paymentUrl: `/payment/${purchase.id}` // В реальном приложении здесь был бы URL платежной системы
      });
    } catch (error) {
      console.error("Ошибка при создании покупки:", error);
      res.status(500).json({ message: "Не удалось создать покупку" });
    }
  });
  
  // Админ API для просмотра покупок
  app.get("/api/stores/:storeId/purchases", isAuthenticated, async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const userId = req.session?.userId!;
      
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "Некорректный ID магазина" });
      }
      
      // Проверка владельца магазина
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).json({ message: "Магазин не найден" });
      }
      
      if (store.userId !== userId) {
        return res.status(403).json({ message: "У вас нет прав на просмотр покупок этого магазина" });
      }
      
      const purchases = await storage.getPurchasesByStoreId(storeId);
      
      res.json(purchases);
    } catch (error) {
      console.error("Ошибка при получении покупок:", error);
      res.status(500).json({ message: "Не удалось получить покупки" });
    }
  });


  
  // Сохраняем старые API для совместимости
  app.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      res.json({ count });
    } catch (error) {
      console.error("Error getting waitlist count:", error);
      res.status(500).json({ message: "Failed to get waitlist count" });
    }
  });

  app.post("/api/waitlist", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = waitlistFormSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const { email, name } = validatedData.data;
      
      // Check if email already exists
      const existingEntry = await storage.getWaitlistEntryByEmail(email);
      if (existingEntry) {
        return res.status(409).json({ message: "Email is already on the waitlist" });
      }
      
      // Create waitlist entry
      const entry = await storage.createWaitlistEntry({ email, name });
      
      res.status(201).json({ 
        message: "Successfully joined the waitlist",
        entry: {
          id: entry.id,
          email: entry.email,
          name: entry.name
        } 
      });
    } catch (error) {
      console.error("Error joining waitlist:", error);
      res.status(500).json({ message: "Failed to join waitlist" });
    }
  });

  app.get("/api/waitlist", async (req, res) => {
    try {
      const entries = await storage.getAllWaitlistEntries();
      res.json(entries);
    } catch (error) {
      console.error("Error getting waitlist entries:", error);
      res.status(500).json({ message: "Failed to get waitlist entries" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

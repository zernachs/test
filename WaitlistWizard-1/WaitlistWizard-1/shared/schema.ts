import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Таблица пользователей (администраторов серверов)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Расширенная схема с валидацией для регистрации
export const registerFormSchema = insertUserSchema.extend({
  email: z.string().email({ message: "Пожалуйста, введите корректный email адрес" }),
  username: z.string().min(3, { message: "Имя пользователя должно содержать не менее 3 символов" }),
  password: z.string().min(6, { message: "Пароль должен содержать не менее 6 символов" }),
  confirmPassword: z.string(),
  privacyPolicy: z.literal(true, {
    errorMap: () => ({ message: "Вы должны принять политику конфиденциальности" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

// Схема для входа
export const loginFormSchema = z.object({
  username: z.string().min(1, { message: "Введите имя пользователя" }),
  password: z.string().min(1, { message: "Введите пароль" }),
});

// Таблица магазинов для Minecraft серверов
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  serverIp: text("server_ip"),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  primaryColor: text("primary_color").default("#0EA5E9"),
  secondaryColor: text("secondary_color").default("#3B82F6"),
  customDomain: text("custom_domain"),
  customCss: text("custom_css"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const insertStoreSchema = createInsertSchema(stores).pick({
  name: true,
  description: true,
  serverIp: true,
});

// Таблица категорий привилегий
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  name: text("name").notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  displayOrder: true,
});

// Таблица привилегий
export const privileges = pgTable("privileges", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  categoryId: integer("category_id").references(() => categories.id),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Цена в копейках/центах
  imageUrl: text("image_url"),
  serverCommands: text("server_commands").array(), // Команды, выполняемые на сервере после покупки
  duration: integer("duration"), // Длительность в днях (null = вечная)
  discountPercent: integer("discount_percent").default(0),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPrivilegeSchema = createInsertSchema(privileges).pick({
  name: true,
  description: true,
  price: true,
  categoryId: true,
  serverCommands: true,
  duration: true,
  discountPercent: true,
  displayOrder: true,
});

// Таблица покупок
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  privilegeId: integer("privilege_id").references(() => privileges.id),
  playerName: text("player_name").notNull(), // Имя игрока в Minecraft
  email: text("email"),
  price: integer("price").notNull(), // Итоговая цена
  transactionId: text("transaction_id"), // ID транзакции от платежной системы
  status: text("status").notNull().default("pending"), // pending, completed, failed
  paymentMethod: text("payment_method"), 
  isDelivered: boolean("is_delivered").default(false), // Была ли выдана привилегия
  purchaseDate: timestamp("purchase_date").defaultNow(),
  expiryDate: timestamp("expiry_date"), // Когда истекает привилегия
});

export const insertPurchaseSchema = createInsertSchema(purchases).pick({
  privilegeId: true,
  playerName: true,
  email: true,
});

// Таблица для истории выполненных команд
export const commandLogs = pgTable("command_logs", {
  id: serial("id").primaryKey(),
  purchaseId: integer("purchase_id").notNull().references(() => purchases.id),
  command: text("command").notNull(),
  executionTime: timestamp("execution_time").defaultNow(),
  status: text("status").notNull(), // success, failed
  errorMessage: text("error_message"),
});

// Таблица для сохранения настроек платежных систем
export const paymentSettings = pgTable("payment_settings", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  provider: text("provider").notNull(), // qiwi, yoomoney, robokassa и т.д.
  isActive: boolean("is_active").default(true),
  credentials: jsonb("credentials").notNull(), // Хранит ключи API и другие настройки
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Типы для использования в приложении
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertPrivilege = z.infer<typeof insertPrivilegeSchema>;
export type Privilege = typeof privileges.$inferSelect;

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

// Сохраняем старую схему для совместимости с текущим кодом
export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWaitlistSchema = createInsertSchema(waitlistEntries).pick({
  email: true,
  name: true,
});

export const waitlistFormSchema = insertWaitlistSchema.extend({
  email: z.string().email({ message: "Пожалуйста, введите корректный email адрес" }),
  name: z.string().min(2, { message: "Имя должно содержать не менее 2 символов" }),
  privacyPolicy: z.literal(true, {
    errorMap: () => ({ message: "Вы должны принять политику конфиденциальности" }),
  }),
});

export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type WaitlistFormData = z.infer<typeof waitlistFormSchema>;

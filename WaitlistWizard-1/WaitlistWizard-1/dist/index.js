var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/userFile.ts
var userFile_exports = {};
__export(userFile_exports, {
  findUserByEmailInFile: () => findUserByEmailInFile,
  findUserByIdInFile: () => findUserByIdInFile,
  findUserByUsernameInFile: () => findUserByUsernameInFile,
  getAllUsersFromFile: () => getAllUsersFromFile,
  saveUserToFile: () => saveUserToFile
});
import fs from "fs";
import path from "path";
function initUserFile() {
  if (!fs.existsSync(USERS_FILE_PATH)) {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify([], null, 2));
    console.log("\u0424\u0430\u0439\u043B \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439 \u0441\u043E\u0437\u0434\u0430\u043D");
  }
}
function getAllUsersFromFile() {
  initUserFile();
  try {
    const fileContent = fs.readFileSync(USERS_FILE_PATH, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0447\u0442\u0435\u043D\u0438\u0438 \u0444\u0430\u0439\u043B\u0430 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439:", error);
    return [];
  }
}
function saveUserToFile(user) {
  const users2 = getAllUsersFromFile();
  const serializedUser = {
    ...user,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
  };
  users2.push(serializedUser);
  try {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users2, null, 2));
    console.log(`\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C ${user.username} \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D \u0432 \u0444\u0430\u0439\u043B`);
  } catch (error) {
    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0432 \u0444\u0430\u0439\u043B:", error);
  }
}
function findUserByUsernameInFile(username) {
  const users2 = getAllUsersFromFile();
  return users2.find((user) => user.username === username);
}
function findUserByEmailInFile(email) {
  const users2 = getAllUsersFromFile();
  return users2.find((user) => user.email === email);
}
function findUserByIdInFile(id) {
  const users2 = getAllUsersFromFile();
  return users2.find((user) => user.id === id);
}
var USERS_FILE_PATH;
var init_userFile = __esm({
  "server/userFile.ts"() {
    "use strict";
    USERS_FILE_PATH = path.join(process.cwd(), "users.json");
    console.log("\u041F\u0443\u0442\u044C \u043A \u0444\u0430\u0439\u043B\u0443 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439:", USERS_FILE_PATH);
    initUserFile();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  waitlist;
  stores;
  categories;
  privileges;
  purchases;
  userCurrentId;
  waitlistCurrentId;
  storeCurrentId;
  categoryCurrentId;
  privilegeCurrentId;
  purchaseCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.waitlist = /* @__PURE__ */ new Map();
    this.stores = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.privileges = /* @__PURE__ */ new Map();
    this.purchases = /* @__PURE__ */ new Map();
    this.userCurrentId = 1;
    this.waitlistCurrentId = 1;
    this.storeCurrentId = 1;
    this.categoryCurrentId = 1;
    this.privilegeCurrentId = 1;
    this.purchaseCurrentId = 1;
    this.initializeDemoData();
  }
  initializeDemoData() {
    this.getUserByUsername("demo").then((user) => {
      if (!user) {
        console.log("\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0442\u0435\u0441\u0442\u043E\u0432\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F...");
        const hashedPassword = "$2a$10$9Xn7U9XW.nUvJ9LM1aZBYeZsT3VoNmUWFJ3uVDm5TxgWK8BxsWYfO";
        this.createUser({
          username: "demo",
          password: hashedPassword,
          email: "demo@example.com"
        }).then((newUser) => {
          console.log("\u0422\u0435\u0441\u0442\u043E\u0432\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441\u043E\u0437\u0434\u0430\u043D:", newUser.username);
        });
      }
    });
  }
  // Методы для работы с пользователями
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  async createUser(insertUser) {
    const id = this.userCurrentId++;
    const createdAt = /* @__PURE__ */ new Date();
    const user = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email || "",
      createdAt
    };
    this.users.set(id, user);
    try {
      Promise.resolve().then(() => (init_userFile(), userFile_exports)).then((module) => {
        module.saveUserToFile(user);
      });
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0432 \u0444\u0430\u0439\u043B:", error);
    }
    return user;
  }
  // Методы для работы с магазинами
  async getStore(id) {
    return this.stores.get(id);
  }
  async getStoresByUserId(userId) {
    return Array.from(this.stores.values()).filter(
      (store) => store.userId === userId
    );
  }
  async getAllStores() {
    return Array.from(this.stores.values());
  }
  async createStore(store) {
    const id = this.storeCurrentId++;
    const createdAt = /* @__PURE__ */ new Date();
    const updatedAt = /* @__PURE__ */ new Date();
    const newStore = {
      ...store,
      id,
      createdAt,
      updatedAt,
      logoUrl: "",
      bannerUrl: "",
      primaryColor: "#0EA5E9",
      secondaryColor: "#3B82F6",
      customDomain: "",
      customCss: "",
      isActive: true
    };
    this.stores.set(id, newStore);
    return newStore;
  }
  async updateStore(id, updates) {
    const store = this.stores.get(id);
    if (!store) return void 0;
    const updatedStore = {
      ...store,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.stores.set(id, updatedStore);
    return updatedStore;
  }
  async deleteStore(id) {
    return this.stores.delete(id);
  }
  // Методы для работы с категориями
  async getCategory(id) {
    return this.categories.get(id);
  }
  async getCategoriesByStoreId(storeId) {
    return Array.from(this.categories.values()).filter((category) => category.storeId === storeId).sort((a, b) => a.displayOrder - b.displayOrder);
  }
  async createCategory(category) {
    const id = this.categoryCurrentId++;
    const createdAt = /* @__PURE__ */ new Date();
    const newCategory = {
      ...category,
      id,
      createdAt,
      iconUrl: "",
      displayOrder: category.displayOrder || 0
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  async updateCategory(id, updates) {
    const category = this.categories.get(id);
    if (!category) return void 0;
    const updatedCategory = {
      ...category,
      ...updates
    };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  async deleteCategory(id) {
    return this.categories.delete(id);
  }
  // Методы для работы с привилегиями
  async getPrivilege(id) {
    return this.privileges.get(id);
  }
  async getPrivilegesByStoreId(storeId) {
    return Array.from(this.privileges.values()).filter((privilege) => privilege.storeId === storeId).sort((a, b) => a.displayOrder - b.displayOrder);
  }
  async getPrivilegesByCategoryId(categoryId) {
    return Array.from(this.privileges.values()).filter((privilege) => privilege.categoryId === categoryId).sort((a, b) => a.displayOrder - b.displayOrder);
  }
  async createPrivilege(privilege) {
    const id = this.privilegeCurrentId++;
    const createdAt = /* @__PURE__ */ new Date();
    const updatedAt = /* @__PURE__ */ new Date();
    const newPrivilege = {
      ...privilege,
      id,
      createdAt,
      updatedAt,
      imageUrl: "",
      isActive: true,
      serverCommands: privilege.serverCommands || [],
      displayOrder: privilege.displayOrder || 0,
      discountPercent: privilege.discountPercent || 0
    };
    this.privileges.set(id, newPrivilege);
    return newPrivilege;
  }
  async updatePrivilege(id, updates) {
    const privilege = this.privileges.get(id);
    if (!privilege) return void 0;
    const updatedPrivilege = {
      ...privilege,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.privileges.set(id, updatedPrivilege);
    return updatedPrivilege;
  }
  async deletePrivilege(id) {
    return this.privileges.delete(id);
  }
  // Методы для работы с покупками
  async getPurchase(id) {
    return this.purchases.get(id);
  }
  async getPurchasesByStoreId(storeId) {
    return Array.from(this.purchases.values()).filter((purchase) => purchase.storeId === storeId).sort((a, b) => (b.purchaseDate?.getTime() || 0) - (a.purchaseDate?.getTime() || 0));
  }
  async createPurchase(purchase) {
    const id = this.purchaseCurrentId++;
    const purchaseDate = /* @__PURE__ */ new Date();
    const newPurchase = {
      ...purchase,
      id,
      purchaseDate,
      status: "pending",
      isDelivered: false,
      transactionId: "",
      paymentMethod: "",
      expiryDate: null
    };
    if (purchase.privilegeId) {
      const privilege = this.privileges.get(purchase.privilegeId);
      if (privilege && privilege.duration) {
        const expiryDate = /* @__PURE__ */ new Date();
        expiryDate.setDate(expiryDate.getDate() + privilege.duration);
        newPurchase.expiryDate = expiryDate;
      }
    }
    this.purchases.set(id, newPurchase);
    return newPurchase;
  }
  async updatePurchaseStatus(id, status, transactionId) {
    const purchase = this.purchases.get(id);
    if (!purchase) return void 0;
    const updatedPurchase = {
      ...purchase,
      status
    };
    if (transactionId) {
      updatedPurchase.transactionId = transactionId;
    }
    this.purchases.set(id, updatedPurchase);
    return updatedPurchase;
  }
  async markPurchaseAsDelivered(id) {
    const purchase = this.purchases.get(id);
    if (!purchase) return void 0;
    const updatedPurchase = {
      ...purchase,
      isDelivered: true
    };
    this.purchases.set(id, updatedPurchase);
    return updatedPurchase;
  }
  // Методы для работы с waitlist (сохраняем для совместимости)
  async createWaitlistEntry(entry) {
    const id = this.waitlistCurrentId++;
    const createdAt = /* @__PURE__ */ new Date();
    const waitlistEntry = { ...entry, id, createdAt };
    this.waitlist.set(id, waitlistEntry);
    return waitlistEntry;
  }
  async getWaitlistEntryByEmail(email) {
    return Array.from(this.waitlist.values()).find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase()
    );
  }
  async getAllWaitlistEntries() {
    return Array.from(this.waitlist.values());
  }
  async getWaitlistCount() {
    return this.waitlist.size;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true
});
var registerFormSchema = insertUserSchema.extend({
  email: z.string().email({ message: "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 email \u0430\u0434\u0440\u0435\u0441" }),
  username: z.string().min(3, { message: "\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 3 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432" }),
  password: z.string().min(6, { message: "\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 6 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432" }),
  confirmPassword: z.string(),
  privacyPolicy: z.literal(true, {
    errorMap: () => ({ message: "\u0412\u044B \u0434\u043E\u043B\u0436\u043D\u044B \u043F\u0440\u0438\u043D\u044F\u0442\u044C \u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0443 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438" })
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "\u041F\u0430\u0440\u043E\u043B\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442",
  path: ["confirmPassword"]
});
var loginFormSchema = z.object({
  username: z.string().min(1, { message: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" }),
  password: z.string().min(1, { message: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C" })
});
var stores = pgTable("stores", {
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
  isActive: boolean("is_active").default(true)
});
var insertStoreSchema = createInsertSchema(stores).pick({
  name: true,
  description: true,
  serverIp: true
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  name: text("name").notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  displayOrder: true
});
var privileges = pgTable("privileges", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  categoryId: integer("category_id").references(() => categories.id),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  // Цена в копейках/центах
  imageUrl: text("image_url"),
  serverCommands: text("server_commands").array(),
  // Команды, выполняемые на сервере после покупки
  duration: integer("duration"),
  // Длительность в днях (null = вечная)
  discountPercent: integer("discount_percent").default(0),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertPrivilegeSchema = createInsertSchema(privileges).pick({
  name: true,
  description: true,
  price: true,
  categoryId: true,
  serverCommands: true,
  duration: true,
  discountPercent: true,
  displayOrder: true
});
var purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  privilegeId: integer("privilege_id").references(() => privileges.id),
  playerName: text("player_name").notNull(),
  // Имя игрока в Minecraft
  email: text("email"),
  price: integer("price").notNull(),
  // Итоговая цена
  transactionId: text("transaction_id"),
  // ID транзакции от платежной системы
  status: text("status").notNull().default("pending"),
  // pending, completed, failed
  paymentMethod: text("payment_method"),
  isDelivered: boolean("is_delivered").default(false),
  // Была ли выдана привилегия
  purchaseDate: timestamp("purchase_date").defaultNow(),
  expiryDate: timestamp("expiry_date")
  // Когда истекает привилегия
});
var insertPurchaseSchema = createInsertSchema(purchases).pick({
  privilegeId: true,
  playerName: true,
  email: true
});
var commandLogs = pgTable("command_logs", {
  id: serial("id").primaryKey(),
  purchaseId: integer("purchase_id").notNull().references(() => purchases.id),
  command: text("command").notNull(),
  executionTime: timestamp("execution_time").defaultNow(),
  status: text("status").notNull(),
  // success, failed
  errorMessage: text("error_message")
});
var paymentSettings = pgTable("payment_settings", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  provider: text("provider").notNull(),
  // qiwi, yoomoney, robokassa и т.д.
  isActive: boolean("is_active").default(true),
  credentials: jsonb("credentials").notNull(),
  // Хранит ключи API и другие настройки
  updatedAt: timestamp("updated_at").defaultNow()
});
var waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertWaitlistSchema = createInsertSchema(waitlistEntries).pick({
  email: true,
  name: true
});
var waitlistFormSchema = insertWaitlistSchema.extend({
  email: z.string().email({ message: "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 email \u0430\u0434\u0440\u0435\u0441" }),
  name: z.string().min(2, { message: "\u0418\u043C\u044F \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 2 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432" }),
  privacyPolicy: z.literal(true, {
    errorMap: () => ({ message: "\u0412\u044B \u0434\u043E\u043B\u0436\u043D\u044B \u043F\u0440\u0438\u043D\u044F\u0442\u044C \u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0443 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438" })
  })
});

// server/routes.ts
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcryptjs";
var isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D" });
};
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.safeParse(req.body);
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      const { username, password, email } = validatedData.data;
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(409).json({ message: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0442\u0430\u043A\u0438\u043C \u0438\u043C\u0435\u043D\u0435\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442" });
      }
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: "\u042D\u0442\u043E\u0442 email \u0443\u0436\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email
      });
      if (req.session) {
        req.session.userId = user.id;
        req.session.username = user.username;
      }
      res.status(201).json({
        message: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u0443\u0441\u043F\u0435\u0448\u043D\u0430",
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginFormSchema.safeParse(req.body);
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      const { username, password } = validatedData.data;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0438\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0438\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C" });
      }
      if (req.session) {
        req.session.userId = user.id;
        req.session.username = user.username;
      }
      res.json({
        message: "\u0412\u0445\u043E\u0434 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E",
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0432\u0445\u043E\u0434\u0435:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u043E\u0439\u0442\u0438" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u044B\u0439\u0442\u0438" });
        }
        res.json({ message: "\u0412\u044B\u0445\u043E\u0434 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E" });
      });
    } else {
      res.json({ message: "\u0412\u044B\u0445\u043E\u0434 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E" });
    }
  });
  app2.get("/api/auth/me", async (req, res) => {
    try {
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
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043F\u0440\u043E\u0444\u0438\u043B\u044F:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C" });
    }
  });
  app2.get("/api/stores/public", async (req, res) => {
    try {
      const stores2 = await storage.getAllStores();
      if (stores2.length === 0) {
        return res.json([]);
      }
      const storesWithPurchases = await Promise.all(
        stores2.map(async (store) => {
          const purchases2 = await storage.getPurchasesByStoreId(store.id);
          const today = /* @__PURE__ */ new Date();
          today.setHours(0, 0, 0, 0);
          const todayRevenue = purchases2.filter((p) => p.status === "completed" && p.purchaseDate && p.purchaseDate >= today).reduce((sum, p) => sum + p.price, 0);
          const totalRevenue = purchases2.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.price, 0);
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
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430\u0445:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u043E \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430\u0445" });
    }
  });
  app2.get("/api/stores", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session?.userId;
      const stores2 = await storage.getStoresByUserId(userId);
      res.json(stores2);
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u043E\u0432:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u044B" });
    }
  });
  app2.post("/api/stores", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session?.userId;
      const validatedData = insertStoreSchema.safeParse(req.body);
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      const store = await storage.createStore({
        ...validatedData.data,
        userId
      });
      res.status(201).json(store);
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043C\u0430\u0433\u0430\u0437\u0438\u043D" });
    }
  });
  app2.get("/api/stores/:id", async (req, res) => {
    try {
      const storeId = parseInt(req.params.id);
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 ID \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      const store = await storage.getStore(storeId);
      if (!store) {
        return res.status(404).json({ message: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
      }
      res.json(store);
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043C\u0430\u0433\u0430\u0437\u0438\u043D" });
    }
  });
  app2.put("/api/stores/:id", isAuthenticated, async (req, res) => {
    try {
      const storeId = parseInt(req.params.id);
      const userId = req.session?.userId;
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 ID \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      const store = await storage.getStore(storeId);
      if (!store) {
        return res.status(404).json({ message: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
      }
      if (store.userId !== userId) {
        return res.status(403).json({ message: "\u0423 \u0432\u0430\u0441 \u043D\u0435\u0442 \u043F\u0440\u0430\u0432 \u043D\u0430 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u044D\u0442\u043E\u0433\u043E \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      const updatedStore = await storage.updateStore(storeId, req.body);
      res.json(updatedStore);
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043C\u0430\u0433\u0430\u0437\u0438\u043D" });
    }
  });
  app2.delete("/api/stores/:id", isAuthenticated, async (req, res) => {
    try {
      const storeId = parseInt(req.params.id);
      const userId = req.session?.userId;
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 ID \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      const store = await storage.getStore(storeId);
      if (!store) {
        return res.status(404).json({ message: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
      }
      if (store.userId !== userId) {
        return res.status(403).json({ message: "\u0423 \u0432\u0430\u0441 \u043D\u0435\u0442 \u043F\u0440\u0430\u0432 \u043D\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u044D\u0442\u043E\u0433\u043E \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      await storage.deleteStore(storeId);
      res.json({ message: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D" });
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u043C\u0430\u0433\u0430\u0437\u0438\u043D" });
    }
  });
  app2.get("/api/stores/:storeId/categories", async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 ID \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      const categories2 = await storage.getCategoriesByStoreId(storeId);
      res.json(categories2);
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0439:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438" });
    }
  });
  app2.post("/api/stores/:storeId/categories", isAuthenticated, async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const userId = req.session?.userId;
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 ID \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      const store = await storage.getStore(storeId);
      if (!store) {
        return res.status(404).json({ message: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
      }
      if (store.userId !== userId) {
        return res.status(403).json({ message: "\u0423 \u0432\u0430\u0441 \u043D\u0435\u0442 \u043F\u0440\u0430\u0432 \u043D\u0430 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u044D\u0442\u043E\u0433\u043E \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      const validatedData = insertCategorySchema.safeParse(req.body);
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      const category = await storage.createCategory({
        ...validatedData.data,
        storeId
      });
      res.status(201).json(category);
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E" });
    }
  });
  app2.get("/api/stores/:storeId/privileges", async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : void 0;
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 ID \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      let privileges2;
      if (categoryId !== void 0) {
        if (isNaN(categoryId)) {
          return res.status(400).json({ message: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 ID \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438" });
        }
        privileges2 = await storage.getPrivilegesByCategoryId(categoryId);
      } else {
        privileges2 = await storage.getPrivilegesByStoreId(storeId);
      }
      res.json(privileges2);
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043F\u0440\u0438\u0432\u0438\u043B\u0435\u0433\u0438\u0439:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043F\u0440\u0438\u0432\u0438\u043B\u0435\u0433\u0438\u0438" });
    }
  });
  app2.post("/api/stores/:storeId/privileges", isAuthenticated, async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const userId = req.session?.userId;
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 ID \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      const store = await storage.getStore(storeId);
      if (!store) {
        return res.status(404).json({ message: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
      }
      if (store.userId !== userId) {
        return res.status(403).json({ message: "\u0423 \u0432\u0430\u0441 \u043D\u0435\u0442 \u043F\u0440\u0430\u0432 \u043D\u0430 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u044D\u0442\u043E\u0433\u043E \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      const validatedData = insertPrivilegeSchema.safeParse(req.body);
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      const privilege = await storage.createPrivilege({
        ...validatedData.data,
        storeId
      });
      res.status(201).json(privilege);
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u043F\u0440\u0438\u0432\u0438\u043B\u0435\u0433\u0438\u0438:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0440\u0438\u0432\u0438\u043B\u0435\u0433\u0438\u044E" });
    }
  });
  app2.post("/api/stores/:storeId/purchases", async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 ID \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      const store = await storage.getStore(storeId);
      if (!store) {
        return res.status(404).json({ message: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
      }
      const validatedData = insertPurchaseSchema.safeParse(req.body);
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      const { privilegeId, playerName, email } = validatedData.data;
      const privilege = await storage.getPrivilege(privilegeId);
      if (!privilege) {
        return res.status(404).json({ message: "\u041F\u0440\u0438\u0432\u0438\u043B\u0435\u0433\u0438\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" });
      }
      const finalPrice = privilege.discountPercent ? Math.round(privilege.price * (1 - privilege.discountPercent / 100)) : privilege.price;
      const purchase = await storage.createPurchase({
        privilegeId,
        playerName,
        email: email || null,
        storeId,
        price: finalPrice
      });
      res.status(201).json({
        purchase,
        paymentUrl: `/payment/${purchase.id}`
        // В реальном приложении здесь был бы URL платежной системы
      });
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u043F\u043E\u043A\u0443\u043F\u043A\u0438:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u043E\u043A\u0443\u043F\u043A\u0443" });
    }
  });
  app2.get("/api/stores/:storeId/purchases", isAuthenticated, async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const userId = req.session?.userId;
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 ID \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      const store = await storage.getStore(storeId);
      if (!store) {
        return res.status(404).json({ message: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
      }
      if (store.userId !== userId) {
        return res.status(403).json({ message: "\u0423 \u0432\u0430\u0441 \u043D\u0435\u0442 \u043F\u0440\u0430\u0432 \u043D\u0430 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043F\u043E\u043A\u0443\u043F\u043E\u043A \u044D\u0442\u043E\u0433\u043E \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430" });
      }
      const purchases2 = await storage.getPurchasesByStoreId(storeId);
      res.json(purchases2);
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043F\u043E\u043A\u0443\u043F\u043E\u043A:", error);
      res.status(500).json({ message: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043F\u043E\u043A\u0443\u043F\u043A\u0438" });
    }
  });
  app2.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      res.json({ count });
    } catch (error) {
      console.error("Error getting waitlist count:", error);
      res.status(500).json({ message: "Failed to get waitlist count" });
    }
  });
  app2.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = waitlistFormSchema.safeParse(req.body);
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      const { email, name } = validatedData.data;
      const existingEntry = await storage.getWaitlistEntryByEmail(email);
      if (existingEntry) {
        return res.status(409).json({ message: "Email is already on the waitlist" });
      }
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
  app2.get("/api/waitlist", async (req, res) => {
    try {
      const entries = await storage.getAllWaitlistEntries();
      res.json(entries);
    } catch (error) {
      console.error("Error getting waitlist entries:", error);
      res.status(500).json({ message: "Failed to get waitlist entries" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(__dirname, "client", "src"),
      "@shared": path2.resolve(__dirname, "shared"),
      "@assets": path2.resolve(__dirname, "attached_assets")
    }
  },
  root: path2.resolve(__dirname, "client"),
  build: {
    outDir: path2.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(__dirname2, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import session from "express-session";
import crypto from "crypto";
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    // в продакшн нужен HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3
    // 24 часа
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

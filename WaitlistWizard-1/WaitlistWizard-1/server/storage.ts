import { 
  users, 
  type User, 
  type InsertUser, 
  waitlistEntries, 
  type WaitlistEntry, 
  type InsertWaitlistEntry,
  stores,
  type Store,
  type InsertStore,
  categories,
  type Category,
  type InsertCategory,
  privileges,
  type Privilege,
  type InsertPrivilege,
  purchases,
  type Purchase,
  type InsertPurchase,
  commandLogs,
  paymentSettings
} from "@shared/schema";

// Интерфейс хранилища для нашего приложения
export interface IStorage {
  // Методы для работы с пользователями
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Методы для работы с магазинами
  getStore(id: number): Promise<Store | undefined>;
  getStoresByUserId(userId: number): Promise<Store[]>;
  getAllStores(): Promise<Store[]>;
  createStore(store: InsertStore & { userId: number }): Promise<Store>;
  updateStore(id: number, updates: Partial<Store>): Promise<Store | undefined>;
  deleteStore(id: number): Promise<boolean>;
  
  // Методы для работы с категориями
  getCategory(id: number): Promise<Category | undefined>;
  getCategoriesByStoreId(storeId: number): Promise<Category[]>;
  createCategory(category: InsertCategory & { storeId: number }): Promise<Category>;
  updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Методы для работы с привилегиями
  getPrivilege(id: number): Promise<Privilege | undefined>;
  getPrivilegesByStoreId(storeId: number): Promise<Privilege[]>;
  getPrivilegesByCategoryId(categoryId: number): Promise<Privilege[]>;
  createPrivilege(privilege: InsertPrivilege & { storeId: number }): Promise<Privilege>;
  updatePrivilege(id: number, updates: Partial<Privilege>): Promise<Privilege | undefined>;
  deletePrivilege(id: number): Promise<boolean>;
  
  // Методы для работы с покупками
  getPurchase(id: number): Promise<Purchase | undefined>;
  getPurchasesByStoreId(storeId: number): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase & { storeId: number, price: number }): Promise<Purchase>;
  updatePurchaseStatus(id: number, status: string, transactionId?: string): Promise<Purchase | undefined>;
  markPurchaseAsDelivered(id: number): Promise<Purchase | undefined>;
  
  // Сохраняем старые методы для совместимости
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
  getAllWaitlistEntries(): Promise<WaitlistEntry[]>;
  getWaitlistCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlist: Map<number, WaitlistEntry>;
  private stores: Map<number, Store>;
  private categories: Map<number, Category>;
  private privileges: Map<number, Privilege>;
  private purchases: Map<number, Purchase>;
  
  private userCurrentId: number;
  private waitlistCurrentId: number;
  private storeCurrentId: number;
  private categoryCurrentId: number;
  private privilegeCurrentId: number;
  private purchaseCurrentId: number;

  constructor() {
    this.users = new Map();
    this.waitlist = new Map();
    this.stores = new Map();
    this.categories = new Map();
    this.privileges = new Map();
    this.purchases = new Map();
    
    this.userCurrentId = 1;
    this.waitlistCurrentId = 1;
    this.storeCurrentId = 1;
    this.categoryCurrentId = 1;
    this.privilegeCurrentId = 1;
    this.purchaseCurrentId = 1;
    
    // Создаем демо-данные
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Создаем тестового пользователя, если его еще нет
    this.getUserByUsername("demo").then(user => {
      if (!user) {
        console.log("Создание тестового пользователя...");
        // Хешированный пароль "password123"
        const hashedPassword = "$2a$10$9Xn7U9XW.nUvJ9LM1aZBYeZsT3VoNmUWFJ3uVDm5TxgWK8BxsWYfO";
        this.createUser({
          username: "demo",
          password: hashedPassword,
          email: "demo@example.com"
        }).then(newUser => {
          console.log("Тестовый пользователь создан:", newUser.username);
        });
      }
    });
  }

  // Методы для работы с пользователями
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    // Явно указываем все поля для User, чтобы соответствовать типу
    const user: User = { 
      id, 
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email || "",
      createdAt 
    };
    this.users.set(id, user);
    
    // Дополнительно сохраняем пользователя в файл
    try {
      import('./userFile').then(module => {
        module.saveUserToFile(user);
      });
    } catch (error) {
      console.error('Ошибка при сохранении пользователя в файл:', error);
    }
    
    return user;
  }

  // Методы для работы с магазинами
  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }
  
  async getStoresByUserId(userId: number): Promise<Store[]> {
    return Array.from(this.stores.values()).filter(
      (store) => store.userId === userId
    );
  }
  
  async getAllStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }
  
  async createStore(store: InsertStore & { userId: number }): Promise<Store> {
    const id = this.storeCurrentId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const newStore: Store = { 
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
  
  async updateStore(id: number, updates: Partial<Store>): Promise<Store | undefined> {
    const store = this.stores.get(id);
    if (!store) return undefined;
    
    const updatedStore: Store = { 
      ...store, 
      ...updates,
      updatedAt: new Date()
    };
    this.stores.set(id, updatedStore);
    return updatedStore;
  }
  
  async deleteStore(id: number): Promise<boolean> {
    return this.stores.delete(id);
  }
  
  // Методы для работы с категориями
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoriesByStoreId(storeId: number): Promise<Category[]> {
    return Array.from(this.categories.values())
      .filter(category => category.storeId === storeId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async createCategory(category: InsertCategory & { storeId: number }): Promise<Category> {
    const id = this.categoryCurrentId++;
    const createdAt = new Date();
    const newCategory: Category = {
      ...category,
      id,
      createdAt,
      iconUrl: "",
      displayOrder: category.displayOrder || 0
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory: Category = {
      ...category,
      ...updates
    };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Методы для работы с привилегиями
  async getPrivilege(id: number): Promise<Privilege | undefined> {
    return this.privileges.get(id);
  }
  
  async getPrivilegesByStoreId(storeId: number): Promise<Privilege[]> {
    return Array.from(this.privileges.values())
      .filter(privilege => privilege.storeId === storeId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getPrivilegesByCategoryId(categoryId: number): Promise<Privilege[]> {
    return Array.from(this.privileges.values())
      .filter(privilege => privilege.categoryId === categoryId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async createPrivilege(privilege: InsertPrivilege & { storeId: number }): Promise<Privilege> {
    const id = this.privilegeCurrentId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    
    const newPrivilege: Privilege = {
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
  
  async updatePrivilege(id: number, updates: Partial<Privilege>): Promise<Privilege | undefined> {
    const privilege = this.privileges.get(id);
    if (!privilege) return undefined;
    
    const updatedPrivilege: Privilege = {
      ...privilege,
      ...updates,
      updatedAt: new Date()
    };
    this.privileges.set(id, updatedPrivilege);
    return updatedPrivilege;
  }
  
  async deletePrivilege(id: number): Promise<boolean> {
    return this.privileges.delete(id);
  }
  
  // Методы для работы с покупками
  async getPurchase(id: number): Promise<Purchase | undefined> {
    return this.purchases.get(id);
  }
  
  async getPurchasesByStoreId(storeId: number): Promise<Purchase[]> {
    return Array.from(this.purchases.values())
      .filter(purchase => purchase.storeId === storeId)
      .sort((a, b) => (b.purchaseDate?.getTime() || 0) - (a.purchaseDate?.getTime() || 0));
  }
  
  async createPurchase(purchase: InsertPurchase & { storeId: number, price: number }): Promise<Purchase> {
    const id = this.purchaseCurrentId++;
    const purchaseDate = new Date();
    
    const newPurchase: Purchase = {
      ...purchase,
      id,
      purchaseDate,
      status: "pending",
      isDelivered: false,
      transactionId: "",
      paymentMethod: "",
      expiryDate: null
    };
    
    // Если есть duration в привилегии, рассчитываем дату истечения
    if (purchase.privilegeId) {
      const privilege = this.privileges.get(purchase.privilegeId);
      if (privilege && privilege.duration) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + privilege.duration);
        newPurchase.expiryDate = expiryDate;
      }
    }
    
    this.purchases.set(id, newPurchase);
    return newPurchase;
  }
  
  async updatePurchaseStatus(id: number, status: string, transactionId?: string): Promise<Purchase | undefined> {
    const purchase = this.purchases.get(id);
    if (!purchase) return undefined;
    
    const updatedPurchase: Purchase = {
      ...purchase,
      status
    };
    
    if (transactionId) {
      updatedPurchase.transactionId = transactionId;
    }
    
    this.purchases.set(id, updatedPurchase);
    return updatedPurchase;
  }
  
  async markPurchaseAsDelivered(id: number): Promise<Purchase | undefined> {
    const purchase = this.purchases.get(id);
    if (!purchase) return undefined;
    
    const updatedPurchase: Purchase = {
      ...purchase,
      isDelivered: true
    };
    
    this.purchases.set(id, updatedPurchase);
    return updatedPurchase;
  }

  // Методы для работы с waitlist (сохраняем для совместимости)
  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.waitlistCurrentId++;
    const createdAt = new Date();
    const waitlistEntry: WaitlistEntry = { ...entry, id, createdAt };
    this.waitlist.set(id, waitlistEntry);
    return waitlistEntry;
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    return Array.from(this.waitlist.values()).find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async getAllWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlist.values());
  }

  async getWaitlistCount(): Promise<number> {
    return this.waitlist.size;
  }
}

export const storage = new MemStorage();

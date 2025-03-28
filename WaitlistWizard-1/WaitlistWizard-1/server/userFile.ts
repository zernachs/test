import fs from 'fs';
import path from 'path';
import { User } from '@shared/schema';

// Путь к файлу, где будут храниться пользователи
const USERS_FILE_PATH = path.join(process.cwd(), 'users.json');
console.log('Путь к файлу пользователей:', USERS_FILE_PATH);

// Интерфейс для представления пользователей в файле
interface SerializedUser {
  id: number;
  username: string;
  email: string;
  password: string; // Хешированный пароль
  createdAt: string;
}

// Функция для инициализации файла, если он не существует
function initUserFile(): void {
  if (!fs.existsSync(USERS_FILE_PATH)) {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify([], null, 2));
    console.log('Файл пользователей создан');
  }
}

// Функция для получения всех пользователей из файла
export function getAllUsersFromFile(): SerializedUser[] {
  initUserFile();
  try {
    const fileContent = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Ошибка при чтении файла пользователей:', error);
    return [];
  }
}

// Функция для сохранения пользователя в файл
export function saveUserToFile(user: User): void {
  const users = getAllUsersFromFile();
  
  // Преобразуем дату в строку для корректной сериализации
  const serializedUser: SerializedUser = {
    ...user,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString()
  };
  
  // Добавляем пользователя в массив
  users.push(serializedUser);
  
  // Сохраняем обновленный массив в файл
  try {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
    console.log(`Пользователь ${user.username} сохранен в файл`);
  } catch (error) {
    console.error('Ошибка при сохранении пользователя в файл:', error);
  }
}

// Функция для поиска пользователя по имени
export function findUserByUsernameInFile(username: string): SerializedUser | undefined {
  const users = getAllUsersFromFile();
  return users.find(user => user.username === username);
}

// Функция для поиска пользователя по email
export function findUserByEmailInFile(email: string): SerializedUser | undefined {
  const users = getAllUsersFromFile();
  return users.find(user => user.email === email);
}

// Функция для поиска пользователя по ID
export function findUserByIdInFile(id: number): SerializedUser | undefined {
  const users = getAllUsersFromFile();
  return users.find(user => user.id === id);
}

// Инициализируем файл при импорте модуля
initUserFile();
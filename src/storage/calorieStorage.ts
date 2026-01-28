/**
 * Сервис для работы с chrome.storage
 */

import type { Product } from '../types/calorie';

const STORAGE_KEY = 'calorie_counter_products';

/**
 * Получение списка продуктов из хранилища
 * @returns Массив продуктов
 */
export async function getProducts(): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve((result[STORAGE_KEY] as Product[]) || []);
      }
    });
  });
}

/**
 * Сохранение списка продуктов в хранилище
 * @param products - Массив продуктов для сохранения
 */
export async function saveProducts(products: Product[]): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_KEY]: products }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Добавление продукта в хранилище
 * @param product - Продукт для добавления
 */
export async function addProduct(product: Product): Promise<void> {
  const products = await getProducts();
  products.push(product);
  await saveProducts(products);
}

/**
 * Удаление продукта из хранилища
 * @param productId - ID продукта для удаления
 */
export async function removeProduct(productId: string): Promise<void> {
  const products = await getProducts();
  const filteredProducts = products.filter((p) => p.id !== productId);
  await saveProducts(filteredProducts);
}

/**
 * Очистка всех продуктов из хранилища
 */
export async function clearProducts(): Promise<void> {
  await saveProducts([]);
}

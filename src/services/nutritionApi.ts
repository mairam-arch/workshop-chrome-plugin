/**
 * Сервис для работы с Open Food Facts API
 */

import type { FoodSearchResult, OpenFoodFactsResponse } from '../types/calorie';

const API_BASE_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

/**
 * Кэш для хранения результатов поиска
 */
const searchCache = new Map<string, FoodSearchResult[]>();

/**
 * Поиск продуктов по названию
 * @param query - Название продукта для поиска
 * @param page - Номер страницы (по умолчанию 1)
 * @returns Массив найденных продуктов
 */
export async function searchProducts(
  query: string,
  page: number = 1
): Promise<FoodSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  // Проверка кэша
  const cacheKey = `${query}_${page}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  try {
    const params = new URLSearchParams({
      search_terms: query,
      search_simple: '1',
      action: 'process',
      page: page.toString(),
      page_size: '10',
      json: '1',
    });

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OpenFoodFactsResponse = await response.json();

    // Фильтруем продукты, у которых есть калорийность
    const productsWithCalories = data.products.filter(
      (product) => product.nutriments?.['energy-kcal_100g']
    );

    // Сохраняем в кэш
    searchCache.set(cacheKey, productsWithCalories);

    return productsWithCalories;
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Не удалось найти продукт. Попробуйте позже.');
  }
}

/**
 * Получение калорийности продукта
 * @param product - Результат поиска продукта
 * @returns Калорийность на 100г
 */
export function getCaloriesPer100g(product: FoodSearchResult): number {
  return product.nutriments?.['energy-kcal_100g'] || 0;
}

/**
 * Получение белков на 100г
 * @param product - Результат поиска продукта
 * @returns Белки на 100г
 */
export function getProteinsPer100g(product: FoodSearchResult): number {
  return product.nutriments?.proteins_100g || 0;
}

/**
 * Получение жиров на 100г
 * @param product - Результат поиска продукта
 * @returns Жиры на 100г
 */
export function getFatPer100g(product: FoodSearchResult): number {
  return product.nutriments?.fat_100g || 0;
}

/**
 * Получение углеводов на 100г
 * @param product - Результат поиска продукта
 * @returns Углеводы на 100г
 */
export function getCarbsPer100g(product: FoodSearchResult): number {
  return product.nutriments?.carbohydrates_100g || 0;
}

/**
 * Очистка кэша поиска
 */
export function clearSearchCache(): void {
  searchCache.clear();
}

/**
 * Типы для приложения подсчета калорий
 */

/**
 * Продукт в списке пользователя
 */
export interface Product {
  id: string;
  name: string;
  caloriesPer100g: number;
  weight: number;
  totalCalories: number;
  imageUrl?: string;
  brand?: string;
}

/**
 * Результат поиска из Open Food Facts API
 */
export interface FoodSearchResult {
  product_name: string;
  code: string;
  image_url?: string;
  brands?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
}

/**
 * Ответ от Open Food Facts API
 */
export interface OpenFoodFactsResponse {
  products: FoodSearchResult[];
  count: number;
  page: number;
  page_size: number;
}

/**
 * Состояние поиска
 */
export interface SearchState {
  query: string;
  results: FoodSearchResult[];
  loading: boolean;
  error: string | null;
}

/**
 * Состояние приложения
 */
export interface CalorieCounterState {
  products: Product[];
  search: SearchState;
  totalCalories: number;
}

/**
 * Параметры для добавления продукта
 */
export interface AddProductParams {
  searchResult: FoodSearchResult;
  weight: number;
}

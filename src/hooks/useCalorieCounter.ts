/**
 * Кастомный хук для управления состоянием приложения подсчета калорий
 */

import { useState, useEffect, useCallback } from 'react';
import type { Product, FoodSearchResult, SearchState } from '../types/calorie';
import { searchProducts, getCaloriesPer100g } from '../services/nutritionApi';
import {
  getProducts,
  addProduct as addProductToStorage,
  removeProduct as removeProductFromStorage,
} from '../storage/calorieStorage';

export function useCalorieCounter() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<SearchState>({
    query: '',
    results: [],
    loading: false,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка продуктов при монтировании
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const savedProducts = await getProducts();
      setProducts(savedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Поиск продуктов с debounce
  const searchQuery = useCallback(
    async (query: string) => {
      setSearch((prev) => ({ ...prev, query, loading: true, error: null }));

      if (!query.trim()) {
        setSearch((prev) => ({ ...prev, results: [], loading: false }));
        return;
      }

      try {
        const results = await searchProducts(query);
        setSearch((prev) => ({ ...prev, results, loading: false }));
      } catch (error) {
        setSearch((prev) => ({
          ...prev,
          results: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Произошла ошибка',
        }));
      }
    },
    []
  );

  // Добавление продукта
  const addProduct = useCallback(
    async (searchResult: FoodSearchResult, weight: number) => {
      const caloriesPer100g = getCaloriesPer100g(searchResult);
      const totalCalories = Math.round((caloriesPer100g * weight) / 100);

      const newProduct: Product = {
        id: Date.now().toString(),
        name: searchResult.product_name,
        caloriesPer100g,
        weight,
        totalCalories,
        imageUrl: searchResult.image_url,
        brand: searchResult.brands,
      };

      try {
        await addProductToStorage(newProduct);
        setProducts((prev) => [...prev, newProduct]);
        setSearch((prev) => ({ ...prev, query: '', results: [] }));
      } catch (error) {
        console.error('Error adding product:', error);
      }
    },
    []
  );

  // Удаление продукта
  const removeProduct = useCallback(async (productId: string) => {
    try {
      await removeProductFromStorage(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  }, []);

  // Подсчет общей суммы калорий
  const totalCalories = products.reduce((sum, product) => sum + product.totalCalories, 0);

  return {
    products,
    search,
    isLoading,
    totalCalories,
    searchQuery,
    addProduct,
    removeProduct,
  };
}

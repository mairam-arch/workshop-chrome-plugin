/**
 * Компонент формы для ввода и поиска продуктов
 */

import { useState, useEffect } from 'react';
import type { FoodSearchResult } from '../types/calorie';
import { getCaloriesPer100g } from '../services/nutritionApi';

interface ProductFormProps {
  onSearch: (query: string) => void;
  onAddProduct: (product: FoodSearchResult, weight: number) => void;
  searchResults: FoodSearchResult[];
  isSearching: boolean;
  searchError: string | null;
}

export function ProductForm({
  onSearch,
  onAddProduct,
  searchResults,
  isSearching,
  searchError,
}: ProductFormProps) {
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<FoodSearchResult | null>(null);
  const [weight, setWeight] = useState<number>(100);

  // Debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleSelectProduct = (product: FoodSearchResult) => {
    setSelectedProduct(product);
    setQuery(product.product_name);
  };

  const handleAddProduct = () => {
    if (selectedProduct && weight > 0) {
      onAddProduct(selectedProduct, weight);
      setQuery('');
      setSelectedProduct(null);
      setWeight(100);
    }
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="product-form">
      <div className="form-group">
        <label htmlFor="product-search">Поиск продукта:</label>
        <input
          id="product-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите название продукта (например, яблоко)"
          className="search-input"
        />
        {isSearching && <span className="loading">Поиск...</span>}
        {searchError && <span className="error">{searchError}</span>}
      </div>

      {/* Результаты поиска */}
      {!selectedProduct && searchResults.length > 0 && (
        <div className="search-results">
          <h4>Найденные продукты:</h4>
          <ul className="results-list">
            {searchResults.map((result) => (
              <li
                key={result.code}
                className="result-item"
                onClick={() => handleSelectProduct(result)}
              >
                <div className="result-info">
                  <span className="result-name">{result.product_name}</span>
                  {result.brands && <span className="result-brand">{result.brands}</span>}
                  <span className="result-calories">
                    {Math.round(getCaloriesPer100g(result))} ккал/100г
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Выбранный продукт */}
      {selectedProduct && (
        <div className="selected-product">
          <div className="selected-info">
            <h4>Выбрано: {selectedProduct.product_name}</h4>
            <p>Калорийность: {Math.round(getCaloriesPer100g(selectedProduct))} ккал/100г</p>
            {selectedProduct.brands && <p>Бренд: {selectedProduct.brands}</p>}
            <button onClick={handleClearSelection} className="clear-btn">
              Выбрать другой продукт
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="product-weight">Вес (граммы):</label>
            <input
              id="product-weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min="1"
              max="10000"
              className="weight-input"
            />
          </div>

          <div className="calories-preview">
            <p>
              Итого: <strong>{Math.round((getCaloriesPer100g(selectedProduct) * weight) / 100)}</strong>{' '}
              ккал
            </p>
          </div>

          <button onClick={handleAddProduct} className="add-btn" disabled={weight <= 0}>
            Добавить в список
          </button>
        </div>
      )}
    </div>
  );
}

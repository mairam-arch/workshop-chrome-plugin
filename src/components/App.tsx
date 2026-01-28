/**
 * Главный компонент приложения
 */

import { useCalorieCounter } from '../hooks/useCalorieCounter';
import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';
import { TotalCalories } from './TotalCalories';
import '../styles/popup.css';

export function App() {
  const {
    products,
    search,
    isLoading,
    totalCalories,
    searchQuery,
    addProduct,
    removeProduct,
  } = useCalorieCounter();

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍎 Calorie Counter</h1>
      </header>

      <main className="app-main">
        <TotalCalories totalCalories={totalCalories} productCount={products.length} />

        <ProductForm
          onSearch={searchQuery}
          onAddProduct={addProduct}
          searchResults={search.results}
          isSearching={search.loading}
          searchError={search.error}
        />

        <ProductList products={products} onRemove={removeProduct} />
      </main>
    </div>
  );
}

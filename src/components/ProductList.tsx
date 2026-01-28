/**
 * Компонент списка продуктов
 */

import type { Product } from '../types/calorie';
import { ProductItem } from './ProductItem';

interface ProductListProps {
  products: Product[];
  onRemove: (id: string) => void;
}

export function ProductList({ products, onRemove }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>Список продуктов пуст</p>
        <p>Добавьте продукты, используя форму поиска выше</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <h3>Список продуктов ({products.length})</h3>
      <ul className="products">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} onRemove={onRemove} />
        ))}
      </ul>
    </div>
  );
}

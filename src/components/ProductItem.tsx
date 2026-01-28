/**
 * Компонент карточки продукта
 */

import type { Product } from '../types/calorie';

interface ProductItemProps {
  product: Product;
  onRemove: (id: string) => void;
}

export function ProductItem({ product, onRemove }: ProductItemProps) {
  return (
    <div className="product-item">
      <div className="product-content">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        )}
        <div className="product-details">
          <h4 className="product-name">{product.name}</h4>
          {product.brand && <p className="product-brand">{product.brand}</p>}
          <div className="product-stats">
            <span className="stat">
              <strong>{product.weight}</strong> г
            </span>
            <span className="stat">
              <strong>{product.caloriesPer100g}</strong> ккал/100г
            </span>
            <span className="stat total">
              <strong>{product.totalCalories}</strong> ккал
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onRemove(product.id)}
        className="remove-btn"
        aria-label="Удалить продукт"
      >
        ✕
      </button>
    </div>
  );
}

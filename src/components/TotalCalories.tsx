/**
 * Компонент отображения общей суммы калорий
 */

interface TotalCaloriesProps {
  totalCalories: number;
  productCount: number;
}

export function TotalCalories({ totalCalories, productCount }: TotalCaloriesProps) {
  return (
    <div className="total-calories">
      <div className="total-info">
        <h3>Всего калорий</h3>
        <p className="total-value">{totalCalories} ккал</p>
        <p className="total-products">{productCount} {productCount === 1 ? 'продукт' : productCount > 1 && productCount < 5 ? 'продукта' : 'продуктов'}</p>
      </div>
    </div>
  );
}

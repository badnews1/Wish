import type { ItemCategoriesProps } from '../model';

/**
 * Секция категорий товара
 */
export function ItemCategories({ categories }: ItemCategoriesProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="px-6 pb-6 flex flex-wrap gap-2">
      {categories.map((cat, index) => (
        <span 
          key={index}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
        >
          {cat}
        </span>
      ))}
    </div>
  );
}
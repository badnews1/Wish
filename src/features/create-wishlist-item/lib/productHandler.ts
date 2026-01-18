import type { ParsedProduct } from '../model/productParser';
import { MAX_WISH_TITLE_LENGTH, MAX_WISH_DESCRIPTION_LENGTH } from '@/shared/lib';

/**
 * Создаёт обработчик автозаполнения формы из распарсенного товара
 */
export function createProductParsedHandler(
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setDescription: React.Dispatch<React.SetStateAction<string>>,
  setImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>,
  setPrice: React.Dispatch<React.SetStateAction<number | undefined>>,
  setCurrency: React.Dispatch<React.SetStateAction<string | undefined>>
) {
  return (product: ParsedProduct) => {
    // Обрезаем название до максимальной длины
    if (product.title) {
      const truncatedTitle = product.title.slice(0, MAX_WISH_TITLE_LENGTH);
      setTitle(truncatedTitle);
    }
    // Обрезаем описание до максимальной длины
    if (product.description) {
      const truncatedDescription = product.description.slice(0, MAX_WISH_DESCRIPTION_LENGTH);
      setDescription(truncatedDescription);
    }
    if (product.imageUrl) setImageUrl(product.imageUrl);
    if (product.price !== undefined) setPrice(product.price);
    if (product.currency) setCurrency(product.currency);
  };
}
import type { ParsedProduct } from '../model/productParser';

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
    if (product.title) setTitle(product.title);
    if (product.description) setDescription(product.description);
    if (product.imageUrl) setImageUrl(product.imageUrl);
    if (product.price !== undefined) setPrice(product.price);
    if (product.currency) setCurrency(product.currency);
  };
}
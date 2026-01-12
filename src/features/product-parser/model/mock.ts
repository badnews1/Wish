import type { ParsedProduct } from './types';

// Моковые данные для демонстрации автозаполнения
export const MOCK_PARSED_PRODUCTS: Record<string, ParsedProduct> = {
  'amazon.com': {
    title: 'Беспроводные наушники Sony WH-1000XM5',
    description: 'Флагманские беспроводные наушники с активным шумоподавлением, временем работы до 30 часов и поддержкой Hi-Res Audio.',
    price: 399.99,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcf?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'
    ],
    brand: 'Sony',
    color: 'Черный'
  },
  'nike.com': {
    title: 'Nike Air Max 270',
    description: 'Стильные мужские кроссовки с максимальной амортизацией и современным дизайном.',
    price: 150,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    brand: 'Nike',
    sizes: ['US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11'],
    color: 'Черный/Белый'
  },
  'default': {
    title: 'Смарт-часы Apple Watch Series 9',
    description: 'Новейшие умные часы от Apple с ярким дисплеем, продвинутыми датчиками здоровья и долгим временем автономной работы.',
    price: 429,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80',
    brand: 'Apple',
    color: 'Graphite'
  }
};

// Функция для получения mock-данных на основе URL
export function getMockProductByUrl(url: string): ParsedProduct {
  const hostname = new URL(url).hostname.toLowerCase();
  
  // Ищем соответствие в моковых данных
  for (const [key, product] of Object.entries(MOCK_PARSED_PRODUCTS)) {
    if (hostname.includes(key)) {
      return product;
    }
  }
  
  // Возвращаем дефолтный продукт
  return MOCK_PARSED_PRODUCTS.default;
}

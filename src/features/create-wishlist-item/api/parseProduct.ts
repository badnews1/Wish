import type { ParsedProduct, ParserError } from '../model/productParser';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

/**
 * API для парсинга товаров по URL
 * 
 * Поддерживаемые источники данных:
 * - Open Graph метатеги (og:title, og:description, og:image, og:price)
 * - JSON-LD schema.org (Product)
 * - Twitter Card метатеги
 * - Обычные HTML метатеги
 * 
 * Обработка ошибок:
 * - INVALID_URL - некорректный URL
 * - PARSE_ERROR - ошибка парсинга (не удалось извлечь данные)
 * - NETWORK_ERROR - проблемы с сетью
 */
export async function parseProductUrl(url: string): Promise<ParsedProduct> {
  // Валидация URL
  try {
    new URL(url);
  } catch {
    const error: ParserError = {
      code: 'INVALID_URL'
    };
    throw error;
  }

  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-557c7f29/parse-product`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ url }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData.error;
    }

    return response.json();
  } catch (error) {
    // Если ошибка уже в формате ParserError, пробрасываем её
    if ((error as ParserError).code) {
      throw error;
    }

    // Иначе оборачиваем в NETWORK_ERROR
    const networkError: ParserError = {
      code: 'NETWORK_ERROR'
    };
    throw networkError;
  }
}
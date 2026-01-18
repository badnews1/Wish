import { Context } from "npm:hono";

/**
 * Типы для парсера товаров
 */
interface ParsedProduct {
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  additionalImages?: string[];
  brand?: string;
  sizes?: string[];
  color?: string;
}

interface ParserError {
  code: 'INVALID_URL' | 'PARSE_ERROR' | 'NETWORK_ERROR' | 'UNSUPPORTED_SITE';
  message?: string;
}

/**
 * Парсинг HTML страницы для извлечения данных о товаре
 */
async function parseProductFromUrl(url: string): Promise<ParsedProduct> {
  try {
    // Fetch HTML страницы с ручной обработкой редиректов
    const html = await fetchWithManualRedirects(url);
    
    // Парсинг Open Graph метатегов и JSON-LD
    const product = extractProductData(html);
    
    if (!product.title) {
      throw { code: 'PARSE_ERROR', message: 'Не удалось извлечь данные товара' };
    }

    return product;
  } catch (error) {
    if ((error as ParserError).code) {
      throw error;
    }
    console.error('Parse error:', error);
    throw { code: 'PARSE_ERROR', message: String(error) };
  }
}

/**
 * Fetch с ручной обработкой редиректов (максимум 10)
 */
async function fetchWithManualRedirects(url: string, maxRedirects = 10): Promise<string> {
  let currentUrl = url;
  let redirectCount = 0;

  while (redirectCount < maxRedirects) {
    try {
      const response = await fetch(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0',
          'Referer': new URL(currentUrl).origin,
        },
        redirect: 'manual', // Вручную обрабатываем редиректы
      });

      // Если это редирект (3xx)
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (!location) {
          throw { code: 'NETWORK_ERROR', message: 'Редирект без заголовка Location' };
        }

        // Если location относительный, делаем абсолютным
        currentUrl = location.startsWith('http') 
          ? location 
          : new URL(location, currentUrl).href;

        redirectCount++;
        console.log(`Redirect ${redirectCount}: ${currentUrl}`);
        continue;
      }

      // Если не успешный ответ
      if (!response.ok) {
        throw { code: 'NETWORK_ERROR', message: `HTTP ${response.status}` };
      }

      // Успешный ответ - возвращаем HTML
      return await response.text();

    } catch (error) {
      // Если это наша ошибка с кодом, пробрасываем
      if ((error as ParserError).code) {
        throw error;
      }
      
      // Если это сетевая ошибка TypeError
      if (error instanceof TypeError) {
        throw { 
          code: 'NETWORK_ERROR', 
          message: `Не удалось загрузить страницу: ${error.message}` 
        };
      }
      
      throw error;
    }
  }

  // Достигли лимита редиректов
  throw { 
    code: 'NETWORK_ERROR', 
    message: 'Слишком много редиректов. Попробуйте скопировать прямую ссылку на товар.' 
  };
}

/**
 * Извлечение данных товара из HTML
 */
function extractProductData(html: string): ParsedProduct {
  const product: ParsedProduct = {
    title: '',
  };

  // Извлечение Open Graph метатегов
  const ogTitle = extractMetaTag(html, 'og:title');
  const ogDescription = extractMetaTag(html, 'og:description');
  const ogImage = extractMetaTag(html, 'og:image');
  const ogPriceAmount = extractMetaTag(html, 'product:price:amount') || extractMetaTag(html, 'og:price:amount');
  const ogPriceCurrency = extractMetaTag(html, 'product:price:currency') || extractMetaTag(html, 'og:price:currency');

  // Извлечение Twitter Card метатегов как fallback
  const twitterTitle = extractMetaTag(html, 'twitter:title');
  const twitterDescription = extractMetaTag(html, 'twitter:description');
  const twitterImage = extractMetaTag(html, 'twitter:image');

  // Извлечение обычных метатегов как fallback
  const metaDescription = extractMetaTag(html, 'description');
  
  // Извлечение title из тега <title>
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1].trim() : '';

  // Попытка извлечь JSON-LD данные (schema.org)
  const jsonLdData = extractJsonLd(html);

  // Приоритет: JSON-LD > Open Graph > Twitter Card > обычные метатеги
  product.title = jsonLdData?.name || ogTitle || twitterTitle || pageTitle;
  product.description = jsonLdData?.description || ogDescription || twitterDescription || metaDescription;
  product.imageUrl = jsonLdData?.image || ogImage || twitterImage;
  
  // Декодируем HTML entities в title и description
  if (product.title) {
    product.title = decodeHtmlEntities(product.title);
    product.title = cleanTitle(product.title);
  }
  if (product.description) {
    product.description = decodeHtmlEntities(product.description);
    product.description = cleanDescription(product.description);
  }
  
  // Фильтруем плохие описания (маркетинговые фразы)
  if (product.description) {
    const badPhrases = [
      'shop online at',
      'free shipping',
      'find the',
      'buy now',
      'shop now',
      'add to cart',
      'sign in',
      'create account',
    ];
    
    const descLower = product.description.toLowerCase();
    const isBadDescription = badPhrases.some(phrase => descLower.includes(phrase));
    
    // Если описание плохое или слишком короткое, пытаемся найти лучшее
    if (isBadDescription || product.description.length < 30) {
      const betterDescription = extractDescriptionFromHtml(html);
      if (betterDescription) {
        product.description = betterDescription;
      }
    }
  }
  
  // Если описания всё ещё нет, ищем в HTML
  if (!product.description || product.description.length < 30) {
    const descFromHtml = extractDescriptionFromHtml(html);
    if (descFromHtml) {
      product.description = descFromHtml;
    }
  }
  
  // Если image это массив в JSON-LD, берём первый элемент
  if (product.imageUrl && Array.isArray(product.imageUrl)) {
    product.imageUrl = product.imageUrl[0];
  }
  
  // Цена - сначала проверяем JSON-LD
  if (jsonLdData?.offers) {
    const offers = Array.isArray(jsonLdData.offers) ? jsonLdData.offers[0] : jsonLdData.offers;
    if (offers?.price) {
      const priceStr = String(offers.price).replace(/[^0-9.]/g, '');
      product.price = parseFloat(priceStr);
      product.currency = offers.priceCurrency || 'USD';
      console.log('Price from JSON-LD:', { raw: offers.price, parsed: product.price, currency: product.currency });
    }
  }
  
  // Если цены нет, пробуем Open Graph
  if (!product.price && ogPriceAmount) {
    product.price = parseFloat(ogPriceAmount);
    product.currency = ogPriceCurrency || 'USD';
    console.log('Price from Open Graph:', { raw: ogPriceAmount, parsed: product.price, currency: product.currency });
  }
  
  // Если цены всё ещё нет, ищем в HTML напрямую
  if (!product.price) {
    const priceFromHtml = extractPriceFromHtml(html);
    if (priceFromHtml) {
      product.price = priceFromHtml.amount;
      product.currency = priceFromHtml.currency;
      console.log('Price from HTML:', priceFromHtml);
    }
  }

  // Если изображения нет, пытаемся найти в HTML
  if (!product.imageUrl) {
    product.imageUrl = extractImageFromHtml(html);
  }

  // Бренд
  if (jsonLdData?.brand?.name) {
    product.brand = jsonLdData.brand.name;
  } else if (jsonLdData?.brand && typeof jsonLdData.brand === 'string') {
    product.brand = jsonLdData.brand;
  }

  // Дополнительные изображения
  if (jsonLdData?.image && Array.isArray(jsonLdData.image)) {
    product.additionalImages = jsonLdData.image.slice(1, 6); // Берем до 5 дополнительных
  }

  // Цвет (попытка извлечь из description или title)
  const colorMatch = product.description?.match(/color:\s*([^,\n]+)/i) || 
                     product.title?.match(/\((.*?)\)/);
  if (colorMatch) {
    product.color = colorMatch[1].trim();
  }

  // Логирование для отладки
  console.log('Parsed product:', {
    title: product.title?.substring(0, 50),
    hasImage: !!product.imageUrl,
    hasPrice: !!product.price,
    price: product.price,
    currency: product.currency
  });

  return product;
}

/**
 * Извлечение цены напрямую из HTML
 */
function extractPriceFromHtml(html: string): { amount: number; currency: string } | null {
  // Паттерны для поиска цены (в порядке приоритета - от специфичных к общим)
  const patterns = [
    // Amazon специфичные паттерны - АКТУАЛЬНАЯ ЦЕНА (самые специфичные первыми!)
    
    // 0. aria-hidden="true" - ЭТО ВИДИМАЯ АКТУАЛЬНАЯ ЦЕНА (внутри priceToPay или любого другого контейнера)
    /<span[^>]*aria-hidden=["']true["'][^>]*>([\s\S]{0,200}?)<span[^>]*class=["'][^"']*a-price-whole[^"']*["'][^>]*>([\s\S]*?)<\/span>\s*<span[^>]*class=["'][^"']*a-price-fraction[^"']*["'][^>]*>([0-9]+)<\/span>/i,
    
    // 1. priceToPay - главная цена на Amazon (но aria-hidden точнее!)
    /<span[^>]*class=["'][^"']*priceToPay[^"']*["'][^>]*>([\s\S]{0,400}?)<span[^>]*class=["'][^"']*a-price-whole[^"']*["'][^>]*>([\s\S]*?)<\/span>\s*<span[^>]*class=["'][^"']*a-price-fraction[^"']*["'][^>]*>([0-9]+)<\/span>/i,
    
    // 2. Цена внутри corePriceDisplay (это главная цена товара)
    /id=["']corePriceDisplay[^>]*>([\s\S]{0,500}?)<span[^>]*class=["'][^"']*a-price-whole[^"']*["'][^>]*>([\s\S]*?)<\/span>\s*<span[^>]*class=["'][^"']*a-price-fraction[^"']*["'][^>]*>([0-9]+)<\/span>/i,
    
    // 3. Цена с атрибутом data-a-color="price" (это отличает актуальную от старой зачеркнутой)
    /<span[^>]*data-a-color=["'](?:price|base)["'][^>]*>([\s\S]{0,300}?)<span[^>]*class=["'][^"']*a-price-whole[^"']*["'][^>]*>([\s\S]*?)<\/span>\s*<span[^>]*class=["'][^"']*a-price-fraction[^"']*["'][^>]*>([0-9]+)<\/span>/i,
    
    // 4. Цена внутри priceblock_ourprice или priceblock_dealprice
    /id=["']priceblock_(?:ourprice|dealprice)[^>]*>([\s\S]{0,300}?)<span[^>]*class=["'][^"']*a-price-whole[^"']*["'][^>]*>([\s\S]*?)<\/span>\s*<span[^>]*class=["'][^"']*a-price-fraction[^"']*["'][^>]*>([0-9]+)<\/span>/i,
    
    // 5. Общий паттерн для Amazon (если специфичные не сработали) - берём ПЕРВУЮ
    /<span[^>]*class=["'][^"']*a-price-whole[^"']*["'][^>]*>([\s\S]*?)<\/span>\s*<span[^>]*class=["'][^"']*a-price-fraction[^"']*["'][^>]*>([0-9]+)<\/span>/gi,
    
    // 6. JSON структуры - ищем в порядке приоритета
    /"currentPrice":\s*"?[\$€£¥]?([0-9]+[.,][0-9]{2})"?/i,
    /"offerPrice":\s*"?[\$€£¥]?([0-9]+[.,][0-9]{2})"?/i,
    /"priceAmount":\s*([0-9]+\.?[0-9]*)/i,
    /"price":\s*([0-9]+\.?[0-9]*)/i,
    
    // Общие паттерны с контекстом
    /[\$€£¥]\s*([0-9]{1,3}(?:[,\s][0-9]{3})*[.,][0-9]{2})/,
    /[\$€£¥]\s*([1-9][0-9]{1,})/,
    /([0-9]{1,3}(?:[,\s][0-9]{3})*[.,]?[0-9]{0,2})\s*(USD|EUR|GBP|RUB|₽)/i,
    /(?:price|цена|стоимость)[:=\s]+[\$€£¥]?\s*([0-9]{1,3}(?:[,\s][0-9]{3})*[.,]?[0-9]*)/i,
    /data-price=["']([0-9]+[.,]?[0-9]*)/i,
  ];

  const foundPrices: Array<{ amount: number; currency: string; pattern: string; match: string }> = [];

  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    
    // Для паттерна #4 (общий Amazon паттерн) используем matchAll чтобы найти ВСЕ цены
    if (i === 4) {
      const matches = html.matchAll(pattern);
      const prices: number[] = [];
      
      for (const match of matches) {
        const wholePart = match[1].replace(/<[^>]+>/g, '').replace(/[,\s]/g, '');
        const fractionPart = match[2];
        const priceStr = `${wholePart}.${fractionPart}`;
        const price = parseFloat(priceStr);
        
        if (!isNaN(price) && price > 0.5) {
          prices.push(price);
          console.log(`Found Amazon price variant:`, { price, wholePart, fractionPart });
        }
      }
      
      // Берем ПЕРВУЮ найденную цену (обычно это цена текущего товара вверху страницы)
      // НЕ максимальную! Максимальная может быть от другого товара
      if (prices.length > 0) {
        const firstPrice = prices[0];
        
        // Определяем валюту
        const matchIndex = html.indexOf('a-price-whole');
        const context = html.substring(Math.max(0, matchIndex - 100), matchIndex + 200);
        let currency = 'USD';
        
        if (context.includes('€') || context.toLowerCase().includes('eur')) {
          currency = 'EUR';
        } else if (context.includes('£') || context.toLowerCase().includes('gbp')) {
          currency = 'GBP';
        } else if (context.includes('₽') || context.toLowerCase().includes('rub')) {
          currency = 'RUB';
        } else if (context.includes('$') || context.toLowerCase().includes('usd')) {
          currency = 'USD';
        }
        
        console.log(`Using FIRST price from ${prices.length} variants:`, { firstPrice, allPrices: prices.slice(0, 5), currency });
        return { amount: firstPrice, currency };
      }
      
      continue;
    }
    
    // Для остальных паттернов - обычная обработка
    const match = html.match(pattern);
    if (match) {
      let priceStr: string;
      
      // Если это первые четыре паттерна (Amazon контейнеры), нужна специальная обработка
      const isAmazonContainerPattern = i < 4;
      
      if (isAmazonContainerPattern && match[3] !== undefined) {
        // У этих паттернов 3 группы: [0]=весь match, [1]=контекст, [2]=целая часть, [3]=дробная
        const wholePart = match[2].replace(/<[^>]+>/g, '').replace(/[,\s.]/g, ''); // Удаляем теги, пробелы, запятые И точки
        const fractionPart = match[3];
        priceStr = `${wholePart}.${fractionPart}`;
        
        console.log('Amazon container pattern matched:', { 
          container: i === 0 ? 'priceToPay' : i === 1 ? 'corePriceDisplay' : i === 2 ? 'data-a-color=price/base' : 'priceblock',
          rawWhole: match[2].substring(0, 100), 
          cleanWhole: wholePart, 
          fraction: fractionPart,
          final: priceStr 
        });
      }
      // Если есть две группы и вторая это валюта
      else if (match[2] !== undefined && ['USD', 'EUR', 'GBP', 'RUB'].includes(match[2].toUpperCase())) {
        priceStr = match[1].replace(/[,\s]/g, '').replace(',', '.');
      } 
      // Обычная обработка
      else {
        priceStr = match[1].replace(/[,\s]/g, '').replace(',', '.');
      }
      
      const price = parseFloat(priceStr);
      
      // Проверяем что цена валидная и разумная
      if (!isNaN(price) && price > 0.5) {
        // Определяем валюту
        let currency = 'USD';
        
        // Проверяем явную валюту из группы захвата
        if (match[2] && ['USD', 'EUR', 'GBP', 'RUB'].includes(match[2].toUpperCase())) {
          currency = match[2].toUpperCase();
        } 
        // Иначе определяем по символу в HTML
        else {
          const matchIndex = html.indexOf(match[0]);
          const context = html.substring(Math.max(0, matchIndex - 100), matchIndex + 100);
          
          if (context.includes('€') || context.toLowerCase().includes('eur')) {
            currency = 'EUR';
          } else if (context.includes('£') || context.toLowerCase().includes('gbp')) {
            currency = 'GBP';
          } else if (context.includes('₽') || context.toLowerCase().includes('rub')) {
            currency = 'RUB';
          } else if (context.includes('¥')) {
            currency = 'JPY';
          } else if (context.includes('$') || context.toLowerCase().includes('usd')) {
            currency = 'USD';
          }
        }
        
        foundPrices.push({
          amount: price,
          currency,
          pattern: pattern.toString().substring(0, 60),
          match: match[0].substring(0, 80)
        });
        
        console.log(`Found price #${foundPrices.length}:`, { 
          price, 
          currency, 
          patternIndex: i,
          matched: match[0].substring(0, 80) 
        });
        
        // Для специфичных Amazon паттернов (первые 4) возвращаем сразу
        if (i < 4) {
          console.log('Using Amazon-specific container pattern, returning immediately');
          return { amount: price, currency };
        }
        
        // Для JSON паттернов (индексы 5-8) тоже возвращаем сразу если нашли
        if (i >= 5 && i <= 8) {
          console.log('Using JSON pattern, returning immediately');
          return { amount: price, currency };
        }
      }
    }
  }
  
  // Если нашли хотя бы одну цену через общие паттерны, возвращаем первую
  if (foundPrices.length > 0) {
    console.log('Using first found price from general patterns:', foundPrices[0]);
    return { amount: foundPrices[0].amount, currency: foundPrices[0].currency };
  }
  
  return null;
}

/**
 * Извлечение изображения напрямую из HTML
 */
function extractImageFromHtml(html: string): string | null {
  // Паттерны для поиска изображения товара (в порядке приоритета)
  const patterns = [
    // Amazon specific - основное изображение
    /landingImage[\"'][^>]*src=[\"']([^\"']+\.(?:jpg|jpeg|png|webp)[^\"']*)/i,
    /imgTagWrapperId[\"'][^>]*src=[\"']([^\"']+\.(?:jpg|jpeg|png|webp)[^\"']*)/i,
    /data-old-hires=[\"']([^\"']+\.(?:jpg|jpeg|png|webp)[^\"']*)/i,
    // img с id/class содержащими product, main, primary
    /<img[^>]*(?:id|class)=[\"'][^\"']*(?:landingImage|main-image|product-image|primary-image)[^\"']*[\"'][^>]*src=[\"']([^\"']+\.(?:jpg|jpeg|png|webp)[^\"']*)/i,
    // data-image-url, data-src
    /data-image-url=[\"']([^\"']+\.(?:jpg|jpeg|png|webp)[^\"']*)/i,
    /data-src=[\"']([^\"']+\.(?:jpg|jpeg|png|webp)[^\"']*)/i,
    // Общие паттерны
    /<img[^>]*(?:id|class)=[\"'][^\"']*(?:product|main|primary|hero)[^\"']*[\"'][^>]*src=[\"']([^\"']+\.(?:jpg|jpeg|png|webp)[^\"']*)/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let imageUrl = match[1];
      
      // Если URL относительный, пропускаем
      if (!imageUrl.startsWith('http')) {
        continue;
      }
      
      // Фильтруем плохие изображения
      const badPatterns = [
        'logo',
        'icon',
        'sprite',
        'video',
        'play',
        'thumbnail',
        'thumb',
        'preview-video',
        'video-thumbnail',
        'playback',
      ];
      
      const urlLower = imageUrl.toLowerCase();
      const isBadImage = badPatterns.some(pattern => urlLower.includes(pattern));
      
      if (isBadImage) {
        continue;
      }
      
      // Проверяем что это достаточно большое изображение (не иконка)
      // Amazon использует параметры типа ._AC_SX300_ - извлекаем размер
      const sizeMatch = imageUrl.match(/_(?:AC|SR|SX|SY)_?(\d+)_/);
      if (sizeMatch) {
        const size = parseInt(sizeMatch[1]);
        if (size < 100) {
          continue; // Слишком маленькое
        }
      }
      
      return imageUrl;
    }
  }
  
  return null;
}

/**
 * Извлечение значения метатега
 */
function extractMetaTag(html: string, property: string): string | null {
  // Open Graph и другие property-based метатеги
  const propertyRegex = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  let match = html.match(propertyRegex);
  if (match) return match[1].trim();

  // name-based метатеги
  const nameRegex = new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  match = html.match(nameRegex);
  if (match) return match[1].trim();

  // Обратный порядок (content перед property/name)
  const reversePropertyRegex = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i');
  match = html.match(reversePropertyRegex);
  if (match) return match[1].trim();

  const reverseNameRegex = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, 'i');
  match = html.match(reverseNameRegex);
  if (match) return match[1].trim();

  return null;
}

/**
 * Извлечение JSON-LD данных (schema.org Product)
 */
function extractJsonLd(html: string): any {
  try {
    const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis;
    const matches = html.matchAll(scriptRegex);

    for (const match of matches) {
      try {
        const jsonData = JSON.parse(match[1]);
        
        // Поддержка @graph структуры
        if (jsonData['@graph']) {
          const product = jsonData['@graph'].find((item: any) => item['@type'] === 'Product');
          if (product) return product;
        }
        
        // Прямой Product
        if (jsonData['@type'] === 'Product') {
          return jsonData;
        }
      } catch (e) {
        // Пропускаем невалидный JSON
        continue;
      }
    }
  } catch (error) {
    console.error('JSON-LD parse error:', error);
  }
  
  return null;
}

/**
 * Извлечение описания из HTML
 */
function extractDescriptionFromHtml(html: string): string | null {
  // Паттерны для поиска описания с приоритетом
  const patterns = [
    // Специфичные классы и id для описания товара
    /<div[^>]*(?:class|id)=[\"'][^\"']*(?:product-description|description|product-info|product-details)[^\"']*[\"'][^>]*>(.*?)<\/div>/is,
    /<p[^>]*(?:class|id)=[\"'][^\"']*(?:product-description|description|product-info)[^\"']*[\"'][^>]*>(.*?)<\/p>/is,
    // data-атрибуты
    /data-description=[\"']([^\"']+)[\"']/i,
    // JSON данные (описание в JavaScript)
    /\"description\"\s*:\s*\"([^\"]{30,500})\"/i,
    // Параграфы с длинным текстом (более 50 символов)
    /<p[^>]*>([^<]{50,500})<\/p>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let description = match[1].trim();
      
      // Удаляем HTML теги если есть
      description = description.replace(/<[^>]+>/g, ' ').trim();
      
      // Декодируем HTML entities
      description = decodeHtmlEntities(description);
      
      // Удаляем лишние пробелы
      description = description.replace(/\s+/g, ' ');
      
      // Проверяем длину и качество
      if (description.length > 30 && description.length < 1000) {
        // Фильтруем плохие описания
        const badPhrases = [
          'shop online at',
          'free shipping',
          'find the',
          'buy now',
          'shop now',
          'add to cart',
          'sign in',
          'create account',
        ];
        
        const descLower = description.toLowerCase();
        const isBad = badPhrases.some(phrase => descLower.includes(phrase));
        
        if (!isBad) {
          return description;
        }
      }
    }
  }
  
  return null;
}

/**
 * Декодирование HTML entities
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2019;': "'",
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&#x2013;': '–',
    '&#x2014;': '—',
    '&mdash;': '—',
    '&ndash;': '–',
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
  };

  // Заменяем известные entities
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }

  // Декодируем числовые HTML entities (&#123; или &#xAB;)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(parseInt(dec, 10));
  });
  
  decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  // Декодируем Unicode escape-последовательности из JSON (\u0027)
  decoded = decoded.replace(/\\u([0-9A-Fa-f]{4})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  // Декодируем escaped символы из JSON
  decoded = decoded.replace(/\\'/g, "'");
  decoded = decoded.replace(/\\"/g, '"');
  decoded = decoded.replace(/\\\\/g, '\\');

  return decoded;
}

/**
 * Очистка заголовка от лишних символов
 */
function cleanTitle(title: string): string {
  // Удаляем префиксы интернет-магазинов
  const prefixes = [
    /^Amazon\.com:\s*/i,
    /^Amazon:\s*/i,
    /^Nike\.com:\s*/i,
    /^Nike:\s*/i,
    /^eBay:\s*/i,
    /^Walmart:\s*/i,
    /^AliExpress:\s*/i,
    /^Etsy:\s*/i,
  ];
  
  let cleaned = title;
  for (const prefix of prefixes) {
    cleaned = cleaned.replace(prefix, '');
  }
  
  // Удаляем суффиксы интернет-магазинов (часто в <title>)
  const suffixes = [
    /\s*\|\s*eBay\s*$/i,
    /\s*\|\s*Amazon\.com\s*$/i,
    /\s*\|\s*Amazon\s*$/i,
    /\s*\|\s*Nike\.com\s*$/i,
    /\s*\|\s*Nike\s*$/i,
    /\s*\|\s*Walmart\s*$/i,
    /\s*\|\s*AliExpress\s*$/i,
    /\s*\|\s*Etsy\s*$/i,
    /\s*-\s*eBay\s*$/i,
    /\s*-\s*Amazon\.com\s*$/i,
    /\s*-\s*Amazon\s*$/i,
    /\s*:\s*Amazon\.com\s*$/i,
    /\s*:\s*Amazon\s*$/i,
  ];
  
  for (const suffix of suffixes) {
    cleaned = cleaned.replace(suffix, '');
  }
  
  // Удаляем лишние пробелы
  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Очистка описания от лишних символов
 */
function cleanDescription(description: string): string {
  // Удаляем префиксы интернет-магазинов из начала описания
  const prefixes = [
    /^Amazon\.com:\s*/i,
    /^Amazon:\s*/i,
    /^Nike\.com:\s*/i,
    /^Nike:\s*/i,
  ];
  
  let cleaned = description;
  for (const prefix of prefixes) {
    cleaned = cleaned.replace(prefix, '');
  }
  
  // Удаляем лишние пробелы
  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Хендлер для парсинга товара
 */
export async function handleParseProduct(c: Context) {
  try {
    const { url } = await c.req.json();

    if (!url || typeof url !== 'string') {
      return c.json({ 
        error: { 
          code: 'INVALID_URL', 
          message: 'URL не предоставлен' 
        } 
      }, 400);
    }

    // Валидация URL
    try {
      new URL(url);
    } catch {
      return c.json({ 
        error: { 
          code: 'INVALID_URL', 
          message: 'Некорректный URL' 
        } 
      }, 400);
    }

    // Парсинг товара
    const product = await parseProductFromUrl(url);

    return c.json(product);
  } catch (error) {
    const parserError = error as ParserError;
    console.error('Parse product error:', parserError);
    
    return c.json({ 
      error: {
        code: parserError.code || 'PARSE_ERROR',
        message: parserError.message || 'Не удалось распарсить товар'
      }
    }, 500);
  }
}
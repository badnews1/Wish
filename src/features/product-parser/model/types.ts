export interface ParsedProduct {
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

export type ParserStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ParserError {
  code: 'INVALID_URL' | 'PARSE_ERROR' | 'NETWORK_ERROR' | 'UNSUPPORTED_SITE';
  message: string;
}

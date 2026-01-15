/**
 * Supabase client singleton
 * Используется во всём приложении для работы с БД
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

// Формируем URL из projectId
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

// Создаём клиент с типизацией
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
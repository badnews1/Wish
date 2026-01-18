/**
 * Временные моки для страницы подборок
 * TODO: Заменить на реальные данные из БД
 */

import type { Collection } from '@/entities/collection';

export const mockCollectionsColumn1: Collection[] = [
  {
    id: '1',
    title: 'Для уютной спальни',
    backgroundColor: '#554A96',
    size: 'medium',
  },
  {
    id: '2',
    title: 'Книги',
    backgroundColor: '#D9A5B5',
    size: 'small',
  },
  {
    id: '3',
    title: 'Творческий беспорядок',
    backgroundColor: '#6CB28E',
    size: 'medium',
  },
  {
    id: '4',
    title: 'Мода и стиль',
    backgroundColor: '#B4E7CE',
    size: 'small',
  },
];

export const mockCollectionsColumn2: Collection[] = [
  {
    id: '5',
    title: 'Рабочее место',
    backgroundColor: '#FA6E5A',
    size: 'small',
  },
  {
    id: '6',
    title: 'Для жаркого отпуска',
    backgroundColor: '#FFCF86',
    size: 'medium',
  },
  {
    id: '7',
    title: 'Спорт',
    backgroundColor: '#4E5567',
    size: 'small',
  },
  {
    id: '8',
    title: 'Спорт и активность',
    backgroundColor: '#F4A17C',
    size: 'medium',
  },
];

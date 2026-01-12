import type { VisualEntity, CardSize } from '../../../shared/model';

/**
 * Размеры для коллекций (исключаем 'large')
 */
export type CollectionSize = Exclude<CardSize, 'large'>;

export interface Collection extends VisualEntity {
  size?: CollectionSize;
}
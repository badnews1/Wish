import React from 'react';
import { Card, CardContent } from '../../../../components/ui/card';
import { CardImage } from '../../../../shared/ui';
import { ASPECT_RATIOS } from '../../config';

interface CollectionCardProps {
  title: string;
  backgroundColor: string;
  onClick?: () => void;
  size?: 'small' | 'medium';
  imageUrl?: string;
  imageComponent?: React.ReactNode;
}

export function CollectionCard({ title, backgroundColor, onClick, size = 'medium', imageUrl, imageComponent }: CollectionCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="overflow-hidden active:scale-95 transition-transform cursor-pointer border-0 flex flex-col p-4"
      style={{ aspectRatio: ASPECT_RATIOS[size], backgroundColor }}
    >
      <CardImage imageUrl={imageUrl} imageComponent={imageComponent} alt={title} />
      
      {/* Текст */}
      <h2 className="font-semibold text-white">{title}</h2>
    </Card>
  );
}
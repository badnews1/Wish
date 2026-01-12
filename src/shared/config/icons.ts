import { 
  Gift, 
  Cake, 
  Bell, 
  Heart, 
  Sparkles, 
  Star, 
  Home, 
  Music, 
  Laptop, 
  Coffee, 
  Camera, 
  Plane, 
  Gamepad, 
  Palette,
  Trees,
  Sparkle,
  LucideIcon
} from 'lucide-react';

export interface WishlistIcon {
  id: string;
  icon: LucideIcon;
  /** i18n ключ для label (например, 'icons.gift') */
  labelKey: string;
  emoji: string;
}

export const WISHLIST_ICONS: WishlistIcon[] = [
  { id: 'gift', icon: Gift, labelKey: 'icons.gift', emoji: '🎁' },
  { id: 'cake', icon: Cake, labelKey: 'icons.cake', emoji: '🎂' },
  { id: 'trees', icon: Trees, labelKey: 'icons.trees', emoji: '🎄' },
  { id: 'sparkle', icon: Sparkle, labelKey: 'icons.sparkle', emoji: '💅' },
  { id: 'home', icon: Home, labelKey: 'icons.home', emoji: '🏠' },
  { id: 'sparkles', icon: Sparkles, labelKey: 'icons.sparkles', emoji: '✨' },
  { id: 'bell', icon: Bell, labelKey: 'icons.bell', emoji: '🔔' },
  { id: 'heart', icon: Heart, labelKey: 'icons.heart', emoji: '❤️' },
  { id: 'star', icon: Star, labelKey: 'icons.star', emoji: '⭐' },
  { id: 'music', icon: Music, labelKey: 'icons.music', emoji: '🎵' },
  { id: 'laptop', icon: Laptop, labelKey: 'icons.laptop', emoji: '💻' },
  { id: 'coffee', icon: Coffee, labelKey: 'icons.coffee', emoji: '☕' },
  { id: 'camera', icon: Camera, labelKey: 'icons.camera', emoji: '📷' },
  { id: 'plane', icon: Plane, labelKey: 'icons.plane', emoji: '✈️' },
  { id: 'gamepad', icon: Gamepad, labelKey: 'icons.gamepad', emoji: '🎮' },
  { id: 'palette', icon: Palette, labelKey: 'icons.palette', emoji: '🎨' },
];

export const DEFAULT_ICON_ID = 'gift';
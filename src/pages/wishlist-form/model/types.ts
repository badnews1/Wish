import type { CreateWishlistForm } from '../../../features/create-wishlist';

export interface WishlistFormPageProps {
  onBack: () => void;
  onSubmit: (data: CreateWishlistForm) => void;
  onDelete?: () => void;
  initialData?: Partial<CreateWishlistForm>;
  mode?: 'create' | 'edit';
}

import type { KeyboardEvent } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../../../shared/lib/formatPrice';
import type { Listing } from '../model/types';

type ListingCardProps = {
  listing: Listing;
  isFavorite?: boolean;
  isInCart?: boolean;
  onOpen?: (listing: Listing) => void;
  onToggleCart?: (listing: Listing) => void;
  onToggleFavorite?: (listing: Listing) => void;
};

export function ListingCard({ isFavorite = false, isInCart = false, listing, onOpen, onToggleCart, onToggleFavorite }: ListingCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && onOpen) {
      event.preventDefault();
      onOpen(listing);
    }
  };

  return (
    <article
      className={onOpen ? 'listing-card clickable' : 'listing-card'}
      onClick={() => onOpen?.(listing)}
      onKeyDown={handleKeyDown}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      <div className="listing-image">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80'}
          alt=""
        />
        <div className="listing-actions">
          <button
            aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
            className={isFavorite ? 'active' : ''}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite?.(listing);
            }}
            type="button"
          >
            <Heart size={18} />
          </button>
          <button
            aria-label={isInCart ? 'Убрать из корзины' : 'Добавить в корзину'}
            className={isInCart ? 'active cart' : 'cart'}
            onClick={(event) => {
              event.stopPropagation();
              onToggleCart?.(listing);
            }}
            type="button"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
      <div className="listing-body">
        <strong>{formatPrice(listing.price)}</strong>
        <h2>{listing.title}</h2>
        <p>{listing.description}</p>
        <div className="meta-row">
          <span>{listing.category.name}</span>
          <span>{listing.city}</span>
        </div>
      </div>
    </article>
  );
}

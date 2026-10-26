import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Heart, MapPin, Phone, ShoppingCart, Tag, UserRound } from 'lucide-react';
import { formatPrice } from '../../../shared/lib/formatPrice';
import type { Listing } from '../model/types';

type ListingDetailsProps = {
  isFavorite: boolean;
  isInCart: boolean;
  listing: Listing;
  onBack: () => void;
  onToggleCart: (listing: Listing) => void;
  onToggleFavorite: (listing: Listing) => void;
};

const fallbackImage = 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=80';

export function ListingDetails({ isFavorite, isInCart, listing, onBack, onToggleCart, onToggleFavorite }: ListingDetailsProps) {
  const images = listing.images.length ? listing.images : [fallbackImage];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = images[activeImageIndex] || images[0];

  useEffect(() => {
    setActiveImageIndex(0);
  }, [listing.id]);

  const showPrevImage = () => {
    setActiveImageIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const showNextImage = () => {
    setActiveImageIndex((current) => (current + 1) % images.length);
  };

  return (
    <section className="details-shell">
      <button className="ghost-button details-back" onClick={onBack} type="button">
        <ArrowLeft size={18} />
        Назад к каталогу
      </button>

      <div className="details-grid">
        <div className="details-gallery-wrap">
          <div className="details-gallery">
            <img src={activeImage} alt="" />
            {images.length > 1 && (
              <div className="gallery-nav">
                <button aria-label="Предыдущее фото" onClick={showPrevImage} type="button">
                  <ChevronLeft size={20} />
                </button>
                <button aria-label="Следующее фото" onClick={showNextImage} type="button">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((image, index) => (
                <button
                  className={index === activeImageIndex ? 'active' : ''}
                  key={image}
                  onClick={() => setActiveImageIndex(index)}
                  type="button"
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="details-summary">
          <span className="details-category">
            <Tag size={16} />
            {listing.category.name}
          </span>
          <h1>{listing.title}</h1>
          <strong>{formatPrice(listing.price)}</strong>
          <div className="details-actions">
            <button className={isInCart ? 'primary-button muted' : 'primary-button'} onClick={() => onToggleCart(listing)} type="button">
              <ShoppingCart size={18} />
              {isInCart ? 'В корзине' : 'В корзину'}
            </button>
            <button className={isFavorite ? 'ghost-button active' : 'ghost-button'} onClick={() => onToggleFavorite(listing)} type="button">
              <Heart size={18} />
              {isFavorite ? 'В избранном' : 'В избранное'}
            </button>
          </div>
        </aside>
      </div>

      <div className="details-content">
        <section>
          <h2>Описание</h2>
          <p>{listing.description}</p>
        </section>

        <section className="seller-card">
          <h2>Продавец</h2>
          <p>
            <UserRound size={17} />
            {listing.seller.name}
          </p>
          <p>
            <MapPin size={17} />
            {listing.city}
          </p>
          {listing.seller.phone && (
            <p>
              <Phone size={17} />
              {listing.seller.phone}
            </p>
          )}
          <p>
            <Eye size={17} />
            {listing.views} просмотров
          </p>
        </section>
      </div>
    </section>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Heart, Mail, MapPin, Pencil, Phone, Plus, ShoppingCart, Store, Trash2 } from 'lucide-react';
import { loadCategories } from '../../../entities/category/api/categoryApi';
import type { Category } from '../../../entities/category/model/types';
import { deleteListing, loadMyListings } from '../../../entities/listing/api/listingApi';
import type { Listing } from '../../../entities/listing/model/types';
import { ListingCard } from '../../../entities/listing/ui/ListingCard';
import { AuthPanel } from '../../../features/auth/ui/AuthPanel';
import type { User } from '../../../features/auth/model/types';
import { clearCart, loadCart, removeFromCart } from '../../../entities/cart/api/cartApi';
import { loadFavorites, removeFavorite } from '../../../entities/favorite/api/favoriteApi';
import { ListingEditForm } from '../../../features/listing-edit/ui/ListingEditForm';
import { formatPrice } from '../../../shared/lib/formatPrice';

type ProfilePageProps = {
  user: User | null;
  onAuth: (user: User) => void;
  onCreateListing: () => void;
};

type ProfileTab = 'listings' | 'favorites' | 'cart';

export function ProfilePage({ user, onAuth, onCreateListing }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('listings');
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [cart, setCart] = useState<Listing[]>([]);
  const [notice, setNotice] = useState('');

  const cartTotal = useMemo(() => cart.reduce((sum, listing) => sum + listing.price, 0), [cart]);

  useEffect(() => {
    loadCategories()
      .then(setCategories)
      .catch(() => undefined);
  }, []);

  const reloadProfileData = () => {
    if (!user) {
      setMyListings([]);
      setFavorites([]);
      setCart([]);
      return;
    }

    Promise.all([loadMyListings(), loadFavorites(), loadCart()])
      .then(([listings, favoriteListings, cartListings]) => {
        setMyListings(listings);
        setFavorites(favoriteListings);
        setCart(cartListings);
        setNotice('');
      })
      .catch((error) => {
        setNotice(error instanceof Error ? error.message : 'Не удалось загрузить данные кабинета');
      });
  };

  useEffect(reloadProfileData, [user]);

  const removeFavoriteItem = async (listing: Listing) => {
    setFavorites((current) => current.filter((item) => item.id !== listing.id));
    await removeFavorite(listing.id).catch((error) => {
      setFavorites((current) => [listing, ...current]);
      setNotice(error instanceof Error ? error.message : 'Не удалось обновить избранное');
    });
  };

  const removeCartItem = async (listing: Listing) => {
    setCart((current) => current.filter((item) => item.id !== listing.id));
    await removeFromCart(listing.id).catch((error) => {
      setCart((current) => [listing, ...current]);
      setNotice(error instanceof Error ? error.message : 'Не удалось обновить корзину');
    });
  };

  const clearCartItems = async () => {
    const previousCart = cart;
    setCart([]);
    await clearCart().catch((error) => {
      setCart(previousCart);
      setNotice(error instanceof Error ? error.message : 'Не удалось очистить корзину');
    });
  };

  const removeOwnListing = async (listing: Listing) => {
    const confirmed = window.confirm(`Удалить объявление "${listing.title}"?`);
    if (!confirmed) {
      return;
    }

    setMyListings((current) => current.filter((item) => item.id !== listing.id));
    setFavorites((current) => current.filter((item) => item.id !== listing.id));
    setCart((current) => current.filter((item) => item.id !== listing.id));

    await deleteListing(listing.id).catch((error) => {
      setNotice(error instanceof Error ? error.message : 'Не удалось удалить объявление');
      reloadProfileData();
    });
  };

  const saveEditedListing = (listing: Listing) => {
    setMyListings((current) => current.map((item) => (item.id === listing.id ? listing : item)));
    setFavorites((current) => current.map((item) => (item.id === listing.id ? listing : item)));
    setCart((current) => current.map((item) => (item.id === listing.id ? listing : item)));
    setEditingListing(null);
  };

  if (!user) {
    return (
      <section className="auth-page">
        <div className="auth-page-copy">
          <span className="auth-badge">Дельта</span>
          <h1>Личный кабинет</h1>
          <p>Войдите или зарегистрируйтесь, чтобы управлять объявлениями, избранным и корзиной.</p>
        </div>
        <AuthPanel onAuth={onAuth} />
      </section>
    );
  }

  const currentItems = activeTab === 'listings' ? myListings : activeTab === 'favorites' ? favorites : cart;
  const title = activeTab === 'listings' ? 'Мои объявления' : activeTab === 'favorites' ? 'Избранное' : 'Корзина';
  const subtitle =
    activeTab === 'listings'
      ? 'Объявления, опубликованные с вашего аккаунта'
      : activeTab === 'favorites'
        ? 'Товары, которые вы сохранили для сравнения'
        : cart.length
          ? `Итого: ${formatPrice(cartTotal)}`
          : 'Добавьте товары из каталога, чтобы собрать покупку';

  return (
    <section className="profile-layout">
      <aside className="profile-card">
        <div className="avatar">{user.name.slice(0, 1).toUpperCase()}</div>
        <h1>{user.name}</h1>
        <p>
          <Mail size={16} />
          {user.email}
        </p>
        <p>
          <MapPin size={16} />
          {user.city}
        </p>
        {user.phone && (
          <p>
            <Phone size={16} />
            {user.phone}
          </p>
        )}

        <div className="profile-tabs">
          <button className={activeTab === 'listings' ? 'active' : ''} onClick={() => setActiveTab('listings')} type="button">
            <Store size={17} />
            Мои объявления
            <span>{myListings.length}</span>
          </button>
          <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')} type="button">
            <Heart size={17} />
            Избранное
            <span>{favorites.length}</span>
          </button>
          <button className={activeTab === 'cart' ? 'active' : ''} onClick={() => setActiveTab('cart')} type="button">
            <ShoppingCart size={17} />
            Корзина
            <span>{cart.length}</span>
          </button>
        </div>
      </aside>

      <section className="profile-listings">
        {editingListing && (
          <ListingEditForm
            categories={categories}
            listing={editingListing}
            onCancel={() => setEditingListing(null)}
            onNotice={setNotice}
            onSaved={saveEditedListing}
          />
        )}

        <div className="catalog-head">
          <div>
            <h1>{title}</h1>
            <p>{notice || subtitle}</p>
          </div>
          {activeTab === 'cart' && cart.length > 0 ? (
            <button className="ghost-button danger" onClick={clearCartItems} type="button">
              <Trash2 size={17} />
              Очистить
            </button>
          ) : (
            <span>{currentItems.length} шт.</span>
          )}
        </div>

        {currentItems.length === 0 ? (
          <div className="empty-state">
            {activeTab === 'listings' ? (
              <button className="primary-button" onClick={onCreateListing} type="button">
                <Plus size={18} />
                Добавить первый товар
              </button>
            ) : (
              'Здесь пока пусто'
            )}
          </div>
        ) : (
          <div className="listing-grid">
            {currentItems.map((listing) => (
              <div className="managed-listing" key={listing.id}>
                <ListingCard
                  isFavorite={favorites.some((item) => item.id === listing.id)}
                  isInCart={cart.some((item) => item.id === listing.id)}
                  listing={listing}
                  onToggleCart={activeTab === 'cart' ? removeCartItem : undefined}
                  onToggleFavorite={activeTab === 'favorites' ? removeFavoriteItem : undefined}
                />
                {activeTab === 'listings' && (
                  <div className="managed-actions">
                    <button className="ghost-button" onClick={() => setEditingListing(listing)} type="button">
                      <Pencil size={16} />
                      Изменить
                    </button>
                    <button className="ghost-button danger" onClick={() => removeOwnListing(listing)} type="button">
                      <Trash2 size={16} />
                      Удалить
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

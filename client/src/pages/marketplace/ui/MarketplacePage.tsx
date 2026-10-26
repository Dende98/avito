import { useEffect, useMemo, useState } from 'react';
import { Tag } from 'lucide-react';
import { loadCategories } from '../../../entities/category/api/categoryApi';
import type { Category } from '../../../entities/category/model/types';
import { loadListing, loadListings } from '../../../entities/listing/api/listingApi';
import { fallbackCategories, fallbackListings } from '../../../entities/listing/lib/demoData';
import type { Listing } from '../../../entities/listing/model/types';
import { ListingCard } from '../../../entities/listing/ui/ListingCard';
import { ListingDetails } from '../../../entities/listing/ui/ListingDetails';
import { addToCart, loadCart, removeFromCart } from '../../../entities/cart/api/cartApi';
import { addFavorite, loadFavorites, removeFavorite } from '../../../entities/favorite/api/favoriteApi';
import { ListingCreateForm } from '../../../features/listing-create/ui/ListingCreateForm';
import { ListingFilters } from '../../../features/listing-filters/ui/ListingFilters';
import type { User } from '../../../features/auth/model/types';

type MarketplacePageProps = {
  user: User | null;
};

export function MarketplacePage({ user }: MarketplacePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notice, setNotice] = useState('Подключаемся к API...');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [cartIds, setCartIds] = useState<string[]>([]);

  const activeCategories = categories.length ? categories : fallbackCategories;
  const visibleListings = listings.length ? listings : fallbackListings;

  const params = useMemo(() => {
    const nextParams = new URLSearchParams();
    if (search) nextParams.set('search', search);
    if (city) nextParams.set('city', city);
    if (categoryId) nextParams.set('categoryId', categoryId);
    return nextParams;
  }, [categoryId, city, search]);

  useEffect(() => {
    loadCategories()
      .then((data) => {
        setCategories(data);
        setNotice('API подключен');
      })
      .catch(() => {
        setNotice('Демо-режим: запусти сервер и базу, чтобы увидеть реальные объявления');
      });
  }, []);

  useEffect(() => {
    loadListings(params)
      .then((data) => {
        setListings(data);
        setNotice('API подключен');
      })
      .catch(() => {
        setListings([]);
      });
  }, [params]);

  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      setCartIds([]);
      return;
    }

    Promise.all([loadFavorites(), loadCart()])
      .then(([favorites, cart]) => {
        setFavoriteIds(favorites.map((listing) => listing.id));
        setCartIds(cart.map((listing) => listing.id));
      })
      .catch(() => undefined);
  }, [user]);

  const openListing = async (listing: Listing) => {
    setSelectedListing(listing);

    if (listing.id.startsWith('demo-')) {
      return;
    }

    try {
      const detailedListing = await loadListing(listing.id);
      setSelectedListing(detailedListing);
      setListings((current) => current.map((item) => (item.id === detailedListing.id ? detailedListing : item)));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Не удалось открыть объявление');
    }
  };

  const toggleFavorite = async (listing: Listing) => {
    if (!user) {
      setNotice('Войдите или зарегистрируйтесь, чтобы добавлять в избранное');
      return;
    }

    const exists = favoriteIds.includes(listing.id);
    setFavoriteIds((current) => (exists ? current.filter((id) => id !== listing.id) : [...current, listing.id]));

    try {
      if (exists) {
        await removeFavorite(listing.id);
      } else {
        await addFavorite(listing.id);
      }
    } catch (error) {
      setFavoriteIds((current) => (exists ? [...current, listing.id] : current.filter((id) => id !== listing.id)));
      setNotice(error instanceof Error ? error.message : 'Не удалось обновить избранное');
    }
  };

  const toggleCart = async (listing: Listing) => {
    if (!user) {
      setNotice('Войдите или зарегистрируйтесь, чтобы добавлять товары в корзину');
      return;
    }

    const exists = cartIds.includes(listing.id);
    setCartIds((current) => (exists ? current.filter((id) => id !== listing.id) : [...current, listing.id]));

    try {
      if (exists) {
        await removeFromCart(listing.id);
      } else {
        await addToCart(listing.id);
      }
    } catch (error) {
      setCartIds((current) => (exists ? [...current, listing.id] : current.filter((id) => id !== listing.id)));
      setNotice(error instanceof Error ? error.message : 'Не удалось обновить корзину');
    }
  };

  if (selectedListing) {
    return (
      <ListingDetails
        isFavorite={favoriteIds.includes(selectedListing.id)}
        isInCart={cartIds.includes(selectedListing.id)}
        listing={selectedListing}
        onBack={() => setSelectedListing(null)}
        onToggleCart={toggleCart}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  return (
    <>
      <section className="market-hero">
        <div className="market-hero-content">
          <span>Дельта</span>
          <h1>Место, где вещи находят новых владельцев</h1>
          <p>
            Мы собираем объявления рядом с вами: техника, мебель, транспорт, недвижимость и товары для повседневной жизни.
            Продавайте своё, сохраняйте понравившееся и собирайте покупки в корзину.
          </p>
          <div className="hero-actions">
            <strong>{visibleListings.length} объявлений сейчас в каталоге</strong>
          </div>
        </div>
      </section>

      <ListingFilters
        categories={activeCategories}
        categoryId={categoryId}
        city={city}
        onCategory={setCategoryId}
        onCity={setCity}
        onSearch={setSearch}
        search={search}
      />

      <section className="content-grid">
        <aside className="sidebar">
          <h2>Категории</h2>
          <div className="category-list">
            {activeCategories.map((category) => (
              <button
                className={categoryId === category.id ? 'category-button active' : 'category-button'}
                key={category.id}
                onClick={() => setCategoryId(categoryId === category.id ? '' : category.id)}
                type="button"
              >
                <Tag size={17} />
                <span>{category.name}</span>
                <small>{category._count?.listings ?? 0}</small>
              </button>
            ))}
          </div>
          <ListingCreateForm
            categories={activeCategories}
            isAuthenticated={Boolean(user)}
            onCreated={(listing) => setListings((current) => [listing, ...current])}
            onNotice={setNotice}
          />
        </aside>

        <section className="catalog">
          <div className="catalog-head">
            <div>
              <h1>Объявления рядом</h1>
              <p>{notice}</p>
            </div>
            <span>{visibleListings.length} шт.</span>
          </div>

          <div className="listing-grid">
            {visibleListings.map((listing) => (
              <ListingCard
                isFavorite={favoriteIds.includes(listing.id)}
                isInCart={cartIds.includes(listing.id)}
                key={listing.id}
                listing={listing}
                onOpen={openListing}
                onToggleCart={toggleCart}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      </section>
    </>
  );
}

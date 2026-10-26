import { useEffect, useState } from 'react';
import { loadCurrentUser, logout as logoutRequest, refreshSession } from '../features/auth/api/authApi';
import type { User } from '../features/auth/model/types';
import { tokenStorage } from '../shared/api/base';
import { Header } from '../widgets/header/ui/Header';
import { MarketplacePage } from '../pages/marketplace/ui/MarketplacePage';
import { ProfilePage } from '../pages/profile/ui/ProfilePage';
import { ListingCreatePage } from '../pages/listing-create/ui/ListingCreatePage';
import type { Listing } from '../entities/listing/model/types';

type Page = 'market' | 'profile' | 'create';

export function App() {
  const [page, setPage] = useState<Page>('market');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!tokenStorage.get()) {
      return;
    }

    loadCurrentUser()
      .then(setUser)
      .catch(async () => {
        try {
          const result = await refreshSession();
          tokenStorage.set(result.accessToken);
          setUser(result.user);
        } catch {
          tokenStorage.clear();
          setUser(null);
        }
      });
  }, []);

  const logout = () => {
    logoutRequest().catch(() => undefined);
    tokenStorage.clear();
    setUser(null);
    setPage('market');
  };

  const handleListingCreated = (listing: Listing) => {
    setPage('profile');
  };

  const renderPage = () => {
    if (page === 'create') {
      return (
        <ListingCreatePage
          onBack={() => setPage('profile')}
          onCreated={handleListingCreated}
          onGoProfile={() => setPage('profile')}
          user={user}
        />
      );
    }

    if (page === 'profile') {
      return <ProfilePage onAuth={setUser} onCreateListing={() => setPage('create')} user={user} />;
    }

    return <MarketplacePage user={user} />;
  };

  return (
    <main className="app-shell">
      <Header onLogout={logout} onPageChange={setPage} page={page} user={user} />
      {renderPage()}
    </main>
  );
}

import { useEffect, useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { loadCategories } from '../../../entities/category/api/categoryApi';
import type { Category } from '../../../entities/category/model/types';
import type { Listing } from '../../../entities/listing/model/types';
import { ListingCreateForm } from '../../../features/listing-create/ui/ListingCreateForm';
import type { User } from '../../../features/auth/model/types';

type ListingCreatePageProps = {
  user: User | null;
  onBack: () => void;
  onCreated: (listing: Listing) => void;
  onGoProfile: () => void;
};

export function ListingCreatePage({ user, onBack, onCreated, onGoProfile }: ListingCreatePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    loadCategories()
      .then(setCategories)
      .catch((error) => setNotice(error instanceof Error ? error.message : 'Не удалось загрузить категории'));
  }, []);

  return (
    <section className="create-page">
      <button className="ghost-button details-back" onClick={onBack} type="button">
        <ArrowLeft size={18} />
        Назад
      </button>

      <div className="create-layout">
        <div className="create-copy">
          <span className="auth-badge">Продажа</span>
          <h1>Добавить свой товар</h1>
          <p>Заполните описание, выберите город и загрузите до 8 фотографий. После публикации объявление появится в каталоге и в вашем кабинете.</p>
          {notice && <p className="form-notice">{notice}</p>}
          {!user && <p className="form-notice">Чтобы создать товар, сначала войдите в личный кабинет.</p>}
        </div>

        <div className="create-form-card">
          <ListingCreateForm
            categories={categories}
            isAuthenticated={Boolean(user)}
            onCreated={(listing) => {
              onCreated(listing);
              onGoProfile();
            }}
            onNotice={setNotice}
          />
        </div>
      </div>
    </section>
  );
}

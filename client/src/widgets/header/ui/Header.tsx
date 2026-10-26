import { LogOut, Plus, Store, UserRound } from 'lucide-react';
import type { User } from '../../../features/auth/model/types';

type Page = 'market' | 'profile' | 'create';

type HeaderProps = {
  user: User | null;
  page: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
};

export function Header({ user, page, onPageChange, onLogout }: HeaderProps) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onPageChange('market')} type="button">
        <span className="brand-mark">Д</span>
        <span>
          <strong>Дельта</strong>
          <small>частные объявления</small>
        </span>
      </button>

      <nav className="top-actions">
        <button className={page === 'market' ? 'ghost-button active' : 'ghost-button'} onClick={() => onPageChange('market')} type="button">
          <Store size={18} />
          Каталог
        </button>
        {user && (
          <button className={page === 'create' ? 'ghost-button active' : 'ghost-button'} onClick={() => onPageChange('create')} type="button">
            <Plus size={18} />
            Добавить
          </button>
        )}
        <button className={page === 'profile' ? 'ghost-button active' : 'ghost-button'} onClick={() => onPageChange('profile')} type="button">
          <UserRound size={18} />
          Кабинет
        </button>
        {user && (
          <button className="ghost-button" onClick={onLogout} type="button">
            <LogOut size={18} />
            Выйти
          </button>
        )}
      </nav>
    </header>
  );
}

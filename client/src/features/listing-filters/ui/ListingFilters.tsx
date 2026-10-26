import { MapPin, Search, SlidersHorizontal } from 'lucide-react';
import type { Category } from '../../../entities/category/model/types';
import { CityInput } from '../../../shared/ui/CityInput';

type ListingFiltersProps = {
  categories: Category[];
  search: string;
  city: string;
  categoryId: string;
  onSearch: (value: string) => void;
  onCity: (value: string) => void;
  onCategory: (value: string) => void;
};

export function ListingFilters({ categories, search, city, categoryId, onSearch, onCity, onCategory }: ListingFiltersProps) {
  return (
    <section className="search-band">
      <div className="search-box">
        <Search size={20} />
        <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Поиск по объявлениям" />
      </div>
      <div className="filter-box">
        <MapPin size={18} />
        <CityInput value={city} onChange={onCity} />
      </div>
      <div className="filter-box">
        <SlidersHorizontal size={18} />
        <select value={categoryId} onChange={(event) => onCategory(event.target.value)}>
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

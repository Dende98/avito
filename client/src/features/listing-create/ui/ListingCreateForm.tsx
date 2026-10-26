import { FormEvent, useState } from 'react';
import { ImagePlus, Plus, X } from 'lucide-react';
import { createListing } from '../../../entities/listing/api/listingApi';
import { uploadListingImages } from '../../../entities/listing/api/uploadApi';
import type { Listing, ListingForm } from '../../../entities/listing/model/types';
import type { Category } from '../../../entities/category/model/types';
import { CityInput } from '../../../shared/ui/CityInput';

type ListingCreateFormProps = {
  categories: Category[];
  isAuthenticated: boolean;
  onCreated: (listing: Listing) => void;
  onNotice: (message: string) => void;
};

const initialForm: ListingForm = {
  title: '',
  description: '',
  price: '',
  city: '',
  address: '',
  images: [],
  categoryId: '',
};

export function ListingCreateForm({ categories, isAuthenticated, onCreated, onNotice }: ListingCreateFormProps) {
  const [form, setForm] = useState<ListingForm>(initialForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const submitListing = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      onNotice('Войдите или зарегистрируйтесь, чтобы подать объявление');
      return;
    }

    setIsCreating(true);

    try {
      const uploadedImages = imageFiles.length ? await uploadListingImages(imageFiles) : [];
      const created = await createListing({ ...form, images: uploadedImages });
      onCreated(created);
      setForm(initialForm);
      setImageFiles([]);
      onNotice('Объявление опубликовано');
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Не удалось создать объявление');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form className="listing-form" onSubmit={submitListing}>
      <h2>Новое объявление</h2>
      <input required placeholder="Название" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
      <textarea required placeholder="Описание" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
      <input required placeholder="Цена, ₽" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
      <CityInput required value={form.city} onChange={(city) => setForm({ ...form, city })} />
      <input placeholder="Адрес" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
      <label className="file-drop">
        <ImagePlus size={18} />
        <span>{imageFiles.length ? `Выбрано фото: ${imageFiles.length}` : 'Загрузить фото'}</span>
        <input
          accept="image/*"
          multiple
          onChange={(event) => setImageFiles(Array.from(event.target.files || []).slice(0, 8))}
          type="file"
        />
      </label>
      {imageFiles.length > 0 && (
        <div className="image-chips">
          {imageFiles.map((file) => (
            <span key={`${file.name}-${file.size}`}>
              {file.name}
              <button
                aria-label="Убрать фото"
                onClick={() => setImageFiles((current) => current.filter((item) => item !== file))}
                type="button"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
      <select required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
        <option value="">Категория</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button className="primary-button full" disabled={isCreating} type="submit">
        <Plus size={18} />
        {isCreating ? 'Публикуем...' : 'Опубликовать'}
      </button>
    </form>
  );
}

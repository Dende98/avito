import { FormEvent, useMemo, useState } from 'react';
import { ImagePlus, Save, X } from 'lucide-react';
import { updateListing } from '../../../entities/listing/api/listingApi';
import { uploadListingImages } from '../../../entities/listing/api/uploadApi';
import type { Listing, ListingForm } from '../../../entities/listing/model/types';
import type { Category } from '../../../entities/category/model/types';
import { CityInput } from '../../../shared/ui/CityInput';

type ListingEditFormProps = {
  categories: Category[];
  listing: Listing;
  onCancel: () => void;
  onSaved: (listing: Listing) => void;
  onNotice: (message: string) => void;
};

export function ListingEditForm({ categories, listing, onCancel, onNotice, onSaved }: ListingEditFormProps) {
  const initialForm = useMemo<ListingForm>(
    () => ({
      title: listing.title,
      description: listing.description,
      price: String(listing.price),
      city: listing.city,
      address: listing.address || '',
      images: listing.images,
      categoryId: listing.category.id,
    }),
    [listing],
  );

  const [form, setForm] = useState<ListingForm>(initialForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const uploadedImages = imageFiles.length ? await uploadListingImages(imageFiles) : [];
      const saved = await updateListing(listing.id, {
        ...form,
        images: [...form.images, ...uploadedImages],
      });
      onSaved(saved);
      onNotice('Объявление обновлено');
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Не удалось обновить объявление');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="listing-form edit-form" onSubmit={submit}>
      <div className="edit-form-head">
        <h2>Редактировать объявление</h2>
        <button aria-label="Закрыть" onClick={onCancel} type="button">
          <X size={18} />
        </button>
      </div>
      <input required placeholder="Название" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
      <textarea required placeholder="Описание" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
      <input required placeholder="Цена, ₽" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
      <CityInput required value={form.city} onChange={(city) => setForm({ ...form, city })} />
      <input placeholder="Адрес" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
      <select required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
        <option value="">Категория</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {form.images.length > 0 && (
        <div className="edit-images">
          {form.images.map((image) => (
            <div key={image}>
              <img src={image} alt="" />
              <button
                aria-label="Удалить фото"
                onClick={() => setForm((current) => ({ ...current, images: current.images.filter((item) => item !== image) }))}
                type="button"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="file-drop">
        <ImagePlus size={18} />
        <span>{imageFiles.length ? `Новые фото: ${imageFiles.length}` : 'Добавить фото'}</span>
        <input
          accept="image/*"
          multiple
          onChange={(event) => setImageFiles(Array.from(event.target.files || []).slice(0, 8))}
          type="file"
        />
      </label>

      <div className="edit-form-actions">
        <button className="ghost-button" onClick={onCancel} type="button">
          Отмена
        </button>
        <button className="primary-button" disabled={isSaving} type="submit">
          <Save size={18} />
          {isSaving ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
}

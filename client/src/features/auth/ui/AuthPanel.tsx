import { FormEvent, useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { login, register } from '../api/authApi';
import type { AuthMode, User } from '../model/types';
import { tokenStorage } from '../../../shared/api/base';
import { formatRussianPhoneInput, isRussianPhoneComplete } from '../../../shared/lib/phone';
import { CityInput } from '../../../shared/ui/CityInput';

type AuthPanelProps = {
  onAuth: (user: User) => void;
};

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  city: '',
};

export function AuthPanel({ onAuth }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [form, setForm] = useState(initialForm);
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice('');

    if (mode === 'register' && form.phone && !isRussianPhoneComplete(form.phone)) {
      setNotice('Введите телефон в формате +7 (999) 123-45-67');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = mode === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register(form);

      tokenStorage.set(result.accessToken);
      onAuth(result.user);
      setForm(initialForm);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Не удалось выполнить действие');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-panel">
      <div className="auth-heading">
        <span className="auth-badge">{mode === 'login' ? 'Вход' : 'Регистрация'}</span>
        <h2>{mode === 'login' ? 'Вернитесь к объявлениям' : 'Создайте профиль продавца'}</h2>
        <p>{mode === 'login' ? 'Войдите, чтобы публиковать объявления и открыть кабинет.' : 'Аккаунт нужен для публикации и управления объявлениями.'}</p>
      </div>

      <div className="auth-switch" role="tablist" aria-label="Выбор авторизации">
        <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')} type="button">
          Войти
        </button>
        <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')} type="button">
          Создать
        </button>
      </div>

      <form className="stack-form" onSubmit={submit}>
        {mode === 'register' && (
          <>
            <label className="input-line">
              <UserRound size={18} />
              <input required placeholder="Имя" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label className="input-line city-line">
              <MapPin size={18} />
              <CityInput required value={form.city} onChange={(city) => setForm({ ...form, city })} />
            </label>
            <label className="input-line">
              <Phone size={18} />
              <input
                inputMode="tel"
                placeholder="+7 (999) 123-45-67"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: formatRussianPhoneInput(event.target.value) })}
              />
            </label>
          </>
        )}

        <label className="input-line">
          <Mail size={18} />
          <input required placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label className="input-line">
          <LockKeyhole size={18} />
          <input
            required
            minLength={6}
            placeholder="Пароль"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </label>

        <button className="primary-button full auth-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Подождите...' : mode === 'login' ? 'Войти в кабинет' : 'Зарегистрироваться'}
          <ArrowRight size={18} />
        </button>
        {notice && <p className="form-notice">{notice}</p>}
      </form>
    </section>
  );
}

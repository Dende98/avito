export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city: string;
  createdAt: string;
};

export type AuthResult = {
  user: User;
  accessToken: string;
};

export type AuthMode = 'login' | 'register';

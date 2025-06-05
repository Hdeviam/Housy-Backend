export class User {
  id?: number;

  email?: string; // 👈 ahora opcional
  name?: string; // 👈 ahora opcional
  password?: string; // 👈 ahora opcional
  role?: 'admin' | 'agent' | 'client'; // 👈 ahora opcional

  createdAt?: Date;
  updatedAt?: Date;
}

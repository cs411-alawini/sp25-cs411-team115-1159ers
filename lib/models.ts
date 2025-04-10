export interface User {
  UserID: number;
  Username: string;
  Email: string | null;
  PasswordHash: string;
  RegistrationDate: Date;
}

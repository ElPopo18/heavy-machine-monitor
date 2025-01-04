export interface FormData {
  cedula: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  photo: File | null;
}

export interface FormErrors {
  cedula: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}
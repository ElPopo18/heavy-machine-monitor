export interface Equipment {
  id: string;
  name: string;
  code: string;
  description: string;
  photo_url: string | null;
  brand: {
    name: string;
  };
}
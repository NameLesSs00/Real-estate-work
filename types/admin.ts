export interface Unit {
  id: number;
  title: string;
  subtitle?: string;
  price: string;
  type: string;
  status: string;
  location: string;
  description?: string;
}

export interface Project {
  id: number;
  title: string;
  developer: string;
  location: string;
  unitCount: number;
  image: string;
  description?: string;
  price?: string;
  deliveryDate?: string;
  unitSize?: string;
}

export interface Developer {
  id: number;
  name: string;
  description: string;
  logoImage: string | null;
  gallery: { id: number; imageUrl: string }[];
  projects: unknown[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string | null;
}

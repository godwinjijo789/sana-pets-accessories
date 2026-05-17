
export interface Pet {
  id?: string;
  name: string;
  breed: string;
  age: string;
  gender: 'Male' | 'Female';
  vaccination: string;
  price: number;
  description: string;
  availability: boolean;
  images: string[];
  createdAt: any;
}

export interface Accessory {
  id?: string;
  name: string;
  category: 'Food' | 'Toys' | 'Collars' | 'Beds' | 'Grooming' | string;
  price: number;
  description: string;
  availability: boolean;
  images: string[];
  createdAt: any;
}

export interface Review {
  id?: string;
  accessoryId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface Enquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: any;
}

export interface Admin {
  uid: string;
  name: string;
  email: string;
  role: string;
  createdAt: any;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  socials: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    twitter?: string;
  };
}

type ProductStatusType = "active" | "inactive";

export interface Product {
  id: string | number;
  _id?: string;
  title?: { ar: string; en: string };
  name?: string;
  price?: number;
  default_price?: number;
  oldPrice?: number;
  image?: string | Array<{ url: string }>;
  description?: string;
  desc?: { ar: string; en: string };
  quantity?: number;
  sale?: number;
  category?: string;
  rating?: number;
  status?: ProductStatusType;
  created_at?: string;
  updated_at?: string;
  reviews?: Array<{
    name: string;
    rating: number;
    comment: string;
  }>;
}

// النوع الجديد للاستخدام العام - يتضمن جميع الخصائص المطلوبة
export type ProductType = {
  id: string | number;
  _id?: string;
  title?: { ar: string; en: string };
  name?: string;
  price?: number;
  default_price?: number;
  oldPrice?: number;
  image?: string | Array<{ url: string }>;
  description?: string;
  desc?: { ar: string; en: string };
  quantity?: number;
  sale?: number;
  category?: string;
  rating?: number;
  status?: ProductStatusType;
  created_at?: string;
  updated_at?: string;
  reviews?: Array<{
    name: string;
    rating: number;
    comment: string;
  }>;
};

// النوع القديم للتوافق مع الكود الموجود
export interface LegacyProductType {
  id: number;
  name: string;
  description: string;
  default_price: number;
  quantity: number;
  status: ProductStatusType;
  created_at: string;
  updated_at: string;

  // TODO : الحجات دي من عندي يعني لكن الباك معملهاش
  image: string;
  price: number;
  oldPrice: number;
  category: any;
  rating: number;
  sale: boolean;
}

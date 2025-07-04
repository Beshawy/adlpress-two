type ProductStatusType = "active" | "inactive";

export interface ProductType {
  _id: string;
  title: {
    ar: string;
    en: string;
  };
  desc: {
    ar: string;
    en: string;
  };
  category: string;
  price: number;
  review?: number;
  sale?: number;
  image: Array<{
    public_id: string;
    url: string;
    _id: string;
  }>;
  __v: number;
}

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

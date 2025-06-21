type ProductStatusType = "active" | "inactive";
export interface ProductType {
  id: number;
  name: string;
  description: string;
  default_price: number;
  quantity: number;
  status: ProductStatusType;
  created_at: string;
  updated_at: string;

    // TODO : الحجات دي من عندي يعني لكن الباك معملهاش
  image:string,
  price: number,
  oldPrice: number,
  category: any,
  rating: number,
  sale: boolean,
}

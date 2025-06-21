import { Image } from "@/components/layouts/category-header";

type ProductStatusType = "active" | "inactive";
export interface CategoriesType {
  documentId: string;
  name: string;
  image: Image;
  // products: [];
  // subcategories: [];
  // status: ProductStatusType;
  // created_at: string;
  // updated_at: string;  
}

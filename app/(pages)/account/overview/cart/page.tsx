import { ProductType } from "@/@types/api/product";
import ProductAccountCart from "@/components/products/product-account-cart";

const productsData: ProductType[] = [
  {
    id: 1,
    image: "/icons/products/1.png",
    name: "Laptop v23",
    description: "Laptop v23",
    price: 300,
    oldPrice: 559,
    quantity: 1,
    rating: 4,
    category: "Electronics",
    sale: 20,
  },
  {
    id: 2,
    image: "/icons/products/2.png",
    name: "Laptop v23",
    description: "Laptop v23",
    price: 300,
    oldPrice: 559,
    quantity: 1,
    rating: 4,
    category: "Electronics",
    sale: 20,
  },
  {
    id: 3,
    image: "/icons/products/3.png",
    name: "Laptop v23",
    description: "Laptop v23",
    price: 300,
    oldPrice: 559,
    quantity: 1,
    rating: 4,
    category: "Electronics",
    sale: 20,
  },
  {
    id: 4,
    image: "/icons/products/4.png",
    name: "Laptop v23",
    description: "Laptop v23",
    price: 300,
    oldPrice: 559,
    quantity: 1,
    rating: 4,
    category: "Electronics",
    sale: 20,
  },
  {
    id: 5,
    image: "/icons/products/5.png",
    name: "Laptop v23",
    description: "Laptop v23",
    price: 300,
    oldPrice: 559,
    quantity: 1,
    rating: 4,
    category: "Electronics",
    sale: 20,
  },
  {
    id: 6,
    image: "/icons/products/6.png",
    name: "Laptop v23",
    description: "Laptop v23",
    price: 300,
    oldPrice: 559,
    quantity: 1,
    rating: 4,
    category: "Electronics",
    sale: 20,
  },
];

export default async function page() {
  return (
    <div className="md:mt-24 container mx-auto">
      <div>
        <div className="mt-5 md:mt-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[
            ...productsData,
            ...productsData.reverse(),
            ...productsData.reverse(),
            ...productsData.reverse(),
          ].map((item: ProductType, index: number) => (
            <div key={`${item.id}-${index}-${Math.random()}`}>
              <ProductAccountCart product={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

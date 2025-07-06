import { ProductType } from "@/@types/api/product";
import ProductAccountLinks from "@/components/global/ProductAccountLinks";

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

export default function AccountOverview() {
  return (
    <div className="md:mt-24 container mx-auto">
      <div>
        <h1 className="text-2xl font-bold mb-6">نظرة عامة على الحساب</h1>
        <ProductAccountLinks />
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">المنتجات المفضلة</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {productsData.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow p-4">
                <div className="aspect-square relative mb-2">
                  <img
                    src={product.image as string}
                    alt={product.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600 font-bold">${product.price}</span>
                  {product.oldPrice && (
                    <span className="text-gray-500 line-through text-sm">
                      ${product.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

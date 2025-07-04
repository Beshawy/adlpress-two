import Link from "next/link";
import { CategoryNode } from "@/utils/buildCategoryTree";
import Image from "next/image";

interface CategoryTreeProps {
  categories: CategoryNode[];
}

const CategoryItem: React.FC<{ category: CategoryNode }> = ({ category }) => {
  return (
    <li className="my-3">
      <div className="flex items-center gap-4">
        {category.image && (
          <Image
            src={category.image.url}
            alt={category.name}
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
        )}
        <Link href={`/categories/${category._id}`} className="font-bold text-lg hover:text-primary transition-colors">
          {category.name}
        </Link>
      </div>

      {category.children && category.children.length > 0 && (
        <ul className="pr-8 mt-2 border-r-2 border-gray-200 dark:border-gray-700">
          {category.children.map(child => (
            <CategoryItem key={child._id} category={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export const CategoryTree: React.FC<CategoryTreeProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return <div className="text-center py-10">لا توجد تصنيفات لعرضها حاليًا.</div>;
  }
  return (
    <ul className="w-full">
      {categories.map(category => (
        <CategoryItem key={category._id} category={category} />
      ))}
    </ul>
  );
}; 
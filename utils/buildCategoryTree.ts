export interface CategoryNode {
  _id: string;
  name: string;
  parentId?: string;
  children: CategoryNode[];
  image?: { url: string };
  [key: string]: any;
}

export function buildCategoryTree(categories: any[]): CategoryNode[] {
  const categoryMap: { [key: string]: CategoryNode } = {};
  const categoryTree: CategoryNode[] = [];

  if (!categories) {
    return [];
  }

  // First pass: create a map of categories and initialize children array
  categories.forEach(category => {
    categoryMap[category._id] = { ...category, children: [] };
  });

  // Second pass: build the tree
  categories.forEach(category => {
    if (category.parentId && categoryMap[category.parentId]) {
      // It's a sub-category, add it to its parent's children array
      categoryMap[category.parentId].children.push(categoryMap[category._id]);
    } else {
      // It's a root category
      categoryTree.push(categoryMap[category._id]);
    }
  });

  return categoryTree;
} 
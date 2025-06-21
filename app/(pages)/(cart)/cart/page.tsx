"use client";
import React, { useState, useEffect } from "react";
import ProductInCart from "@/components/cart/productInCart";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import AlertCart from "@/components/cart/AlertCart";
import useDelete from "@/hooks/use-delete";
import CartLayout from "./CartLayout";
import useFetchAuth from "@/hooks/use-fetch-auth";
import LoadingPage from "../../products/[id]/loading";
import { notFound } from "next/navigation";

export default function Page() {
  const [refresh, setRefresh] = useState(false);
  const { data, loading: fetchLoading, error: fetchError } = useFetchAuth("/carts", refresh);
  const { deleteData, loading: deleteLoading, error: deleteError, deleteRequest } = useDelete("/carts");

  const [productsInCart, setProductsInCart] = useState([]);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  // Sync fetched data with state
  useEffect(() => {
    if (data?.cart?.products) {
      setProductsInCart(
        data.cart.products.map((item:any) => ({
          ...item,
          isChecked: false,
          isFavorite: item.product?.isFavorite || false,
        }))
      );
    }
  }, [data]);

  // Calculate selected items count
  const selectedItemsCount = productsInCart.filter(
    (product:any) => product.isChecked
  ).length;

  // Handle select all checkbox
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setProductsInCart((prevProducts:any) =>
      prevProducts.map((product:any) => ({
        ...product,
        isChecked: !selectAll,
      }))
    );
  };

  // Handle individual product selection
  const handleProductSelect = (documentId: string, isChecked: boolean) => {
    setProductsInCart((prevProducts:any) =>
      prevProducts.map((product:any) =>
        product.documentId === documentId ? { ...product, isChecked } : product
      )
    );
    const allChecked = productsInCart.every((product:any) =>
      product.documentId === documentId ? isChecked : product.isChecked
    );
    setSelectAll(allChecked);
  };

  // Handle toggling wishlist
  const handleToggleWishlist = (documentId: string) => {
    setProductsInCart((prevProducts:any) =>
      prevProducts.map((product:any) =>
        product.documentId === documentId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    );
  };

  // Handle delete for a single product
  const handleDeleteProduct = (documentId: string) => {
    setProductsInCart((prevProducts) =>
      prevProducts.filter((product:any) => product.documentId !== documentId)
    );
    setSelectAll(false); // Reset selectAll if any product is deleted
  };

  // Handle empty cart or delete selected products
  const handleEmptyCart = async () => {
    const selectedProducts = productsInCart.filter(
      (product:any) => product.isChecked
    );
    const documentIds = selectedProducts.length > 0
      ? selectedProducts.map((product:any) => product.documentId)
      : productsInCart.map((product:any) => product.documentId);

    await deleteRequest(documentIds);

    if (!deleteError) {
      setProductsInCart((prevProducts) =>
        selectedProducts.length > 0
          ? prevProducts.filter((product:any) => !product.isChecked)
          : []
      );
      setIsOpenAlert(false);
      setSelectAll(false);
    }
  };

  if (fetchLoading) return <LoadingPage />;
  if (fetchError) return notFound();

  return (
    <CartLayout productsInCart={productsInCart}>
      <div className="space-y-4">
        <div className="flex justify-between">
          <h1 className="text-lg md:text-xl">سلة التسوق</h1>
          <Button
            disabled={productsInCart.length === 0 || deleteLoading}
            variant={"link"}
            className={`text-red-600 underline`}
            onClick={() => setIsOpenAlert(true)}
          >
            {selectedItemsCount > 0 ? "حذف المحدد" : "إفراغ السلة"}
          </Button>
        </div>
        <div className="flex gap-x-4 items-center p-4 border border-gray-200">
          <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
          <h3>كل العناصر ({selectedItemsCount})</h3>
        </div>
        <div>
          <div className="space-y-4">
            {productsInCart.map((product: any) => (
              <ProductInCart
              setRefresh={setRefresh}
                key={product.documentId}
                product={product}
                isChecked={product.isChecked}
                isFavorite={product.isFavorite}
                onCheckChange={(isChecked: boolean) =>
                  handleProductSelect(product.documentId, isChecked)
                }
                toggleWishlist={() => handleToggleWishlist(product.documentId)}
                onDelete={handleDeleteProduct} // Pass delete handler
              />
            ))}
          </div>
        </div>
        <AlertCart
          isOpen={isOpenAlert}
          setIsOpen={setIsOpenAlert}
          msg={
            selectedItemsCount > 0
              ? `هل أنت متأكد أنك تريد حذف ${selectedItemsCount} من العناصر المحددة؟`
              : "هل أنت متأكد أنك تريد حذف كل شيء في السلة؟"
          }
          text={selectedItemsCount > 0 ? "حذف المحدد" : "إفراغ السلة"}
          btnText="لا، العودة"
          btnText2="نعم، احذف"
          action={handleEmptyCart}
        />
      </div>
    </CartLayout>
  );
}
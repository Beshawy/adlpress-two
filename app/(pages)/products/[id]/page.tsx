"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ProductRating from "@/components/products/ProductRating";
import ProductsSectionClient from "@/components/pages/home/productsSectionClient";
import useFetch from "@/hooks/use-fetch";
import { notFound, useParams } from "next/navigation";
import { Image as ImageType } from "@/components/layouts/category-header";
import LoadingPage from "./loading";

type ChildLast = {
  id: number;
  documentId: string;
  name: string;
  createdAt: string; // يمكن تغييره إلى Date إذا كنت ستحوله عند الاستخدام
  updatedAt: string;
  publishedAt: string;
};

export type Product = {
  id: number;
  documentId: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  count: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  reviews: any[]; // يمكنك تعديل النوع حسب شكل الـ review إذا كان معروف
  child_lasts: ChildLast[];
  image: ImageType;
  images: ImageType[];
};

export default function ProductDetails() {
  return <div>تفاصيل المنتج</div>;
}

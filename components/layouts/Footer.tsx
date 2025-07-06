"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ArrowRight, Facebook, Instagram, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getAllCategories } from "@/lib/api"
import { CategoriesType } from "@/@types/api/categories"
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog"
import { VisuallyHidden } from "../ui/visually-hidden"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [categories, setCategories] = useState<CategoriesType[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: "", body: "", date: "", email: "" })
  const [status, setStatus] = useState<null | "success" | "error">(null)

  useEffect(() => {
    const fetchFooterCategories = async () => {
      try {
        const allCategories = await getAllCategories();
        // نأخذ أول 12 تصنيف فقط لعرضهم في الفوتر
        setCategories(allCategories?.slice(0, 12) || []);
      } catch (error) {
        console.error("Failed to fetch categories for footer:", error);
      }
    };
    fetchFooterCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Subscribed with:", email)
    setEmail("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    // هنا سيتم إرسال البيانات للباك اند لاحقاً
    if (form.title && form.body && form.date && form.email) {
      setStatus("success")
      setForm({ title: "", body: "", date: "", email: "" })
    } else {
      setStatus("error")
    }
  }

  // دالة مساعدة لتقسيم المصفوفة إلى أعمدة
  const chunkArray = (arr: any[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  
  const categoryColumns = chunkArray(categories, 3);

  return (
    <footer className="bg-[#FFCF33] w-full py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Newsletter Section */}
          <div className="bg-[#2A3990] p-6 rounded-lg lg:col-span-1">
            <h2 className="text-2xl font-bold text-[#FFCF33] mb-4">اشترك في النشرة البريدية</h2>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="w-full bg-transparent border-b border-[#FFCF33]/50 py-2 pr-10 text-[#FFCF33] placeholder-[#FFCF33]/70 focus:outline-none"
                  required
                />
                <button type="submit" className="absolute right-0 bottom-2 text-[#FFCF33]" aria-label="اشتراك">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Dynamic Category Columns */}
          {categoryColumns.map((column, colIndex) => (
            <div key={colIndex} className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-[#2A3990] mb-4">
                {colIndex === 0 ? "تسوق حسب الفئة" : <span className="invisible">الفئات</span>}
              </h3>
              <ul className="space-y-3">
                {column.map((category: any) => (
                  <li key={category._id}>
                    <Link href={`/categories/${category._id}`} className="text-[#2A3990] hover:underline">
                      {category.name.ar}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#2A3990]/20 my-8"></div>

        {/* App Downloads and Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4">
            <Link href="#" aria-label="احصل عليه من جوجل بلاي">
              <Image
                src="/icons/social/google.png"
                alt="جوجل بلاي"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <Link href="#" aria-label="تنزيل من متجر التطبيقات">
              <Image
                src="/icons/social/apple.png"
                alt="متجر التطبيقات"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="flex gap-4">
            <Link
              href="https://www.facebook.com/adlpress.sa"
              className="bg-[#FFCF33] border border-[#2A3990] rounded-full p-2 hover:bg-[#2A3990] hover:text-[#FFCF33] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 text-[#2A3990] hover:text-[#FFCF33]" />
            </Link>
            <Link
              href="https://www.instagram.com/adlpress/"
              className="bg-[#FFCF33] border border-[#2A3990] rounded-full p-2 hover:bg-[#2A3990] hover:text-[#FFCF33] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-[#2A3990] hover:text-[#FFCF33]" />
            </Link>
            <Link
              href="https://www.tiktok.com/@adlpress"
              className="bg-[#FFCF33] border border-[#2A3990] rounded-full p-2 hover:bg-[#2A3990] hover:text-[#FFCF33] transition-colors"
              aria-label="TikTok"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-[#2A3990] hover:text-[#FFCF33]"
              >
                <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                <path d="M15 8a4 4 0 0 0 0 8V8Z" />
                <path d="M9 12V4h6" />
              </svg>
            </Link>
            <Link
              href="https://x.com/adlpresss"
              className="bg-[#FFCF33] border border-[#2A3990] rounded-full p-2 hover:bg-[#2A3990] hover:text-[#FFCF33] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5 text-[#2A3990] hover:text-[#FFCF33]" />
            </Link>
            <Link
              href="https://www.youtube.com/@adlpress"
              className="bg-[#FFCF33] border border-[#2A3990] rounded-full p-2 hover:bg-[#2A3990] hover:text-[#FFCF33] transition-colors"
              aria-label="YouTube"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-[#2A3990] hover:text-[#FFCF33]"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Copyright and Privacy */}
        <div className="flex flex-col items-center justify-center mt-8 text-sm text-[#2A3990]">
          <div className="flex flex-row items-center gap-2">
            <p>© 2023 — Copyright</p>
            <span>|</span>
            <Link href="#" className="hover:underline">Privacy</Link>
          </div>
        </div>

        <button className="bg-primary text-white rounded px-4 py-2 mt-4" onClick={() => setOpen(true)}>
          تواصل مع الدعم الفني
        </button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogTitle>
              <VisuallyHidden>نموذج الشكوى</VisuallyHidden>
            </DialogTitle>
            <form onSubmit={handleSubmitForm} className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="عنوان الشكوى"
                value={form.title}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
              <textarea
                name="body"
                placeholder="نص الشكوى"
                value={form.body}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="email"
                placeholder="الإيميل أو اسم المستخدم"
                value={form.email}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
              <button type="submit" className="bg-primary text-white rounded px-4 py-2">إرسال الشكوى</button>
              {status === "success" && <div className="text-green-600">تم إرسال الشكوى بنجاح!</div>}
              {status === "error" && <div className="text-red-600">يرجى ملء جميع الحقول بشكل صحيح.</div>}
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  )
}

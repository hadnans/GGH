export interface Category {
  id: string;
  icon: string;
  nameEn: string;
  nameAr: string;
  color: string;
}

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  brandEn: string;
  brandAr: string;
  weight: string;
  todayPrice: number;
  yesterdayPrice: number;
  rating: number;
  icon: string;
  bgColor: string;
  categoryId: string;
}

export interface Deal {
  id: string;
  productEn: string;
  productAr: string;
  dealPrice: number;
  originalPrice: number;
  discount: number;
  icon: string;
  bgColor: string;
}

export const categories: Category[] = [
  { id: "rice", icon: "🍚", nameEn: "Rice", nameAr: "أرز", color: "#FFF8E1" },
  { id: "pasta", icon: "🍝", nameEn: "Pasta", nameAr: "مكرونة", color: "#FFF3E0" },
  { id: "tomato", icon: "🥫", nameEn: "Tomato Paste", nameAr: "صلصة طماطم", color: "#FFEBEE" },
  { id: "oil", icon: "🫒", nameEn: "Cooking Oils", nameAr: "زيوت", color: "#E8F5E9" },
  { id: "sugar", icon: "🍬", nameEn: "Sugar", nameAr: "سكر", color: "#FCE4EC" },
  { id: "flour", icon: "🌾", nameEn: "Flour", nameAr: "دقيق", color: "#FFFDE7" },
  { id: "beans", icon: "🫘", nameEn: "Beans", nameAr: "فول", color: "#EFEBE9" },
  { id: "tea", icon: "🍵", nameEn: "Tea", nameAr: "شاي", color: "#E0F2F1" },
  { id: "coffee", icon: "☕", nameEn: "Coffee", nameAr: "قهوة", color: "#D7CCC8" },
  { id: "cleaning", icon: "🧹", nameEn: "Cleaning", nameAr: "تنظيف", color: "#E3F2FD" },
];

export const products: Product[] = [
  {
    id: "p1",
    nameEn: "Premium Rice",
    nameAr: "أرز ممتاز",
    brandEn: "Al Doha",
    brandAr: "الضحى",
    weight: "1kg",
    todayPrice: 25,
    yesterdayPrice: 27,
    rating: 4.5,
    icon: "🍚",
    bgColor: "#FFF8E1",
    categoryId: "rice",
  },
  {
    id: "p2",
    nameEn: "Premium Rice",
    nameAr: "أرز ممتاز",
    brandEn: "Al Doha",
    brandAr: "الضحى",
    weight: "5kg",
    todayPrice: 110,
    yesterdayPrice: 115,
    rating: 4.7,
    icon: "🍚",
    bgColor: "#FFF8E1",
    categoryId: "rice",
  },
  {
    id: "p3",
    nameEn: "Pasta",
    nameAr: "مكرونة",
    brandEn: "El Maleka",
    brandAr: "الملكة",
    weight: "500g",
    todayPrice: 15,
    yesterdayPrice: 16,
    rating: 4.3,
    icon: "🍝",
    bgColor: "#FFF3E0",
    categoryId: "pasta",
  },
  {
    id: "p4",
    nameEn: "Pasta",
    nameAr: "مكرونة",
    brandEn: "Regina",
    brandAr: "رجينا",
    weight: "500g",
    todayPrice: 14.5,
    yesterdayPrice: 15.5,
    rating: 4.1,
    icon: "🍝",
    bgColor: "#FFF3E0",
    categoryId: "pasta",
  },
  {
    id: "p5",
    nameEn: "Tomato Paste",
    nameAr: "صلصة طماطم",
    brandEn: "Al Ain",
    brandAr: "العين",
    weight: "200g",
    todayPrice: 8,
    yesterdayPrice: 9,
    rating: 4.6,
    icon: "🥫",
    bgColor: "#FFEBEE",
    categoryId: "tomato",
  },
  {
    id: "p6",
    nameEn: "Tomato Paste",
    nameAr: "صلصة طماطم",
    brandEn: "El Wadi",
    brandAr: "الوادي",
    weight: "200g",
    todayPrice: 7.5,
    yesterdayPrice: 8.5,
    rating: 4.2,
    icon: "🥫",
    bgColor: "#FFEBEE",
    categoryId: "tomato",
  },
  {
    id: "p7",
    nameEn: "Cooking Oil",
    nameAr: "زيت طعام",
    brandEn: "Crystal",
    brandAr: "كريستال",
    weight: "1L",
    todayPrice: 65,
    yesterdayPrice: 70,
    rating: 4.4,
    icon: "🫒",
    bgColor: "#E8F5E9",
    categoryId: "oil",
  },
  {
    id: "p8",
    nameEn: "Cooking Oil",
    nameAr: "زيت طعام",
    brandEn: "El Hanim",
    brandAr: "الخانم",
    weight: "1L",
    todayPrice: 63,
    yesterdayPrice: 68,
    rating: 4.3,
    icon: "🫒",
    bgColor: "#E8F5E9",
    categoryId: "oil",
  },
  {
    id: "p9",
    nameEn: "Sugar",
    nameAr: "سكر",
    brandEn: "Local",
    brandAr: "محلي",
    weight: "1kg",
    todayPrice: 22,
    yesterdayPrice: 24,
    rating: 4.0,
    icon: "🍬",
    bgColor: "#FCE4EC",
    categoryId: "sugar",
  },
  {
    id: "p10",
    nameEn: "Tea",
    nameAr: "شاي",
    brandEn: "Local",
    brandAr: "محلي",
    weight: "250g",
    todayPrice: 18,
    yesterdayPrice: 20,
    rating: 4.2,
    icon: "🍵",
    bgColor: "#E0F2F1",
    categoryId: "tea",
  },
];

export const deals: Deal[] = [
  {
    id: "d1",
    productEn: "Premium Rice 5kg",
    productAr: "أرز ممتاز 5 كيلو",
    dealPrice: 99,
    originalPrice: 115,
    discount: 14,
    icon: "🍚",
    bgColor: "#FFF8E1",
  },
  {
    id: "d2",
    productEn: "Pasta (Buy 2)",
    productAr: "مكرونة (اشتري 2)",
    dealPrice: 25,
    originalPrice: 30,
    discount: 17,
    icon: "🍝",
    bgColor: "#FFF3E0",
  },
  {
    id: "d3",
    productEn: "Cooking Oil",
    productAr: "زيت طعام",
    dealPrice: 55,
    originalPrice: 70,
    discount: 21,
    icon: "🫒",
    bgColor: "#E8F5E9",
  },
  {
    id: "d4",
    productEn: "Sugar 2kg",
    productAr: "سكر 2 كيلو",
    dealPrice: 38,
    originalPrice: 48,
    discount: 21,
    icon: "🍬",
    bgColor: "#FCE4EC",
  },
];

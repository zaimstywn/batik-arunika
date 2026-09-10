import type { Category, Product } from "@/types";

export const homepageCategories: Category[] = [
  {
    id: "batik-pria",
    name: "Batik Pria",
    slug: "batik-pria",
    description: "Kemeja dan atasan batik dengan potongan modern.",
  },
  {
    id: "batik-wanita",
    name: "Batik Wanita",
    slug: "batik-wanita",
    description: "Dress dan blouse batik yang anggun dan nyaman.",
  },
  {
    id: "outer-batik",
    name: "Outer Batik",
    slug: "outer-batik",
    description: "Outer dan luaran batik untuk layering kasual.",
  },
];

export const homepageProducts: Product[] = [
  {
    id: "batik-kawung-arunika",
    name: "Batik Kawung Arunika",
    slug: "batik-kawung-arunika",
    price: 349000,
    category: "Batik Pria",
    badge: "Terlaris",
  },
  {
    id: "batik-sekar-jagad-laras",
    name: "Batik Sekar Jagad Laras",
    slug: "batik-sekar-jagad-laras",
    price: 459000,
    category: "Batik Wanita",
    badge: "Baru",
  },
  {
    id: "batik-parang-senja",
    name: "Batik Parang Senja",
    slug: "batik-parang-senja",
    price: 289000,
    category: "Batik Pria",
  },
  {
    id: "outer-batik-senja-kirana",
    name: "Outer Batik Senja Kirana",
    slug: "outer-batik-senja-kirana",
    price: 399000,
    category: "Outer Batik",
    badge: "Baru",
  },
];

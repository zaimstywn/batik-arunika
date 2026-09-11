import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/types";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: string | null;
  image_url: string | null;
  is_featured: boolean;
  categories: { name: string } | { name: string }[] | null;
};

function mapProduct(row: ProductRow): Product {
  const categoryName = Array.isArray(row.categories)
    ? row.categories[0]?.name ?? null
    : row.categories?.name ?? null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    stock: row.stock,
    category_id: row.category_id,
    image_url: row.image_url,
    is_featured: row.is_featured,
    category: categoryName,
    badge: row.is_featured ? "Unggulan" : undefined,
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  if (error) {
    throw new Error(`Gagal memuat kategori: ${error.message}`);
  }

  return (data ?? []) as Category[];
}

export type ProductFilters = {
  categorySlug?: string;
  search?: string;
};

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      "id, name, slug, description, price, stock, category_id, image_url, is_featured, categories(name)"
    )
    .order("created_at", { ascending: false });

  if (filters.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.categorySlug)
      .maybeSingle();

    if (!category) {
      return [];
    }
    query = query.eq("category_id", category.id);
  }

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Gagal memuat produk: ${error.message}`);
  }

  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, stock, category_id, image_url, is_featured, categories(name)"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal memuat produk: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapProduct(data as ProductRow);
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  const { createServiceClient } = await import("@/lib/supabase/service");
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, stock, category_id, image_url, is_featured, categories(name)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat produk admin: ${error.message}`);
  }

  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, stock, category_id, image_url, is_featured, categories(name)"
    )
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Gagal memuat produk unggulan: ${error.message}`);
  }

  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

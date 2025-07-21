"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  thumbnail: string;
  images: string[];
}

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}
interface PageProps {
  filteredProducts?: Product[];
}

export default function Home() {
  const searchParams = useSearchParams();
  const [products, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get("q") || "";

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://dummyjson.com/products");
      setProduct(res.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Couldn't load products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, []);
  const truncate = (text: string, maxLength: number): string =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const filteredProducts = products.filter(
    (product) =>
      !searchQuery ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <section className="w-full min-h-[100vh]">
      {filteredProducts.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-400">
            {products.length === 0
              ? "No products available."
              : "No products found. Try a different search."}
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-5 container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((item) => (
            <Link href={`/product/${item.id}`} key={item.id} passHref>
              <div
                // key={item.id}
                className="border-1 border-[rgba(255,255,255,0.05)] rounded-md cursor-pointer"
              >
                <div className="images">
                  <img src={item.thumbnail} alt={item.title} className="" />
                </div>

                <div className="p-2 content">
                  <h2 className="text-[1.1rem] font-medium text-white">
                    {item.title}
                  </h2>

                  <div className="main">
                    <p className="text-[rgba(255,255,255,0.45)] text-sm font-extralight">
                      {truncate(item.description, 50)}
                    </p>
                    <div className="bg-yellow-600 text-sm mt-5 text-white inline-block px-2 rounded-sm rating">
                      {item.rating} *
                    </div>
                    <div className="pricing flex items-center gap-3">
                      <div className="price font-medium mt-1.5 text-white">
                        ₹{item.price}
                      </div>
                      <div className="dis text-[0.8rem] pt-1 text-yellow-600">
                        {item.discountPercentage}% off
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

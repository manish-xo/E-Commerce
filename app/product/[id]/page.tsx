"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const page = () => {
  const params = useParams();

  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://dummyjson.com/products/${params.id}`
      );
      setProduct(res.data);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!params.id) {
      router.push("/");
      return;
    }
    fetchProductData();
  }, [params.id, router]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product)
    return <div className="text-center py-20">Product not found</div>;

  return (
    <section>
      <Link href={"/"} passHref className="text-blue-500 mb-4 inline-block">
        ← Back to products
      </Link>

      <div className="bg-gray-800 rounded-lg p-6">
        {/* Product Header */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover w-15 h-15"
                priority
              />
            </div>
            <div className="grid w-[10rem] h-[10rem] grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  fill
                  className="object-cover bg-red-500 w-full h-full cursor-pointer"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center mb-4">
              <span className="bg-yellow-600 text-white px-2 py-1 rounded text-sm">
                {product.rating} ★
              </span>
              <span className="ml-2 text-gray-400">
                {product.brand} | {product.category}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold">₹{product.price}</span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="ml-2 text-gray-400 line-through">
                    ₹
                    {Math.round(
                      (product.price * (100 + product.discountPercentage)) / 100
                    )}
                  </span>
                  <span className="ml-2 text-green-500">
                    {product.discountPercentage}% off
                  </span>
                </>
              )}
            </div>

            <p className="mb-6">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold">Availability</h3>
                <p>{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Weight</h3>
                <p>{product.weight} g</p>
              </div>
              {/* Add more specs as needed */}
            </div>

            <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition">
              Add to Cart
            </button>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Specifications</h3>
              <ul className="space-y-2">
                <li>
                  <strong>Brand:</strong> {product.brand}
                </li>
                <li>
                  <strong>Category:</strong> {product.category}
                </li>
                <li>
                  <strong>SKU:</strong> {product.sku}
                </li>
                <li>
                  <strong>Dimensions:</strong> {product.dimensions.width}x
                  {product.dimensions.height}x{product.dimensions.depth} cm
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Warranty</h3>
              <p>{product.warrantyInformation}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-700 pb-4">
                  <div className="flex items-center mb-2">
                    <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                      {review.rating} ★
                    </span>
                    <span className="ml-2 font-medium">
                      {review.reviewerName}
                    </span>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default page;

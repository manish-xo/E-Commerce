"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Heart } from "lucide-react";
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

  const addToCart = async (productId: number) => {
    if (!product) return;

    try {
      await axios.post("/api/add-to-cart", {
        productId: product.id,
        title: product.title,
        rating: product.rating,
        brand: product.brand,
        category: product.category,
        price: product.price,
        discountPercentage: product.discountPercentage,
        description: product.description,
        stock: product.stock,
        quantity: 1, // or allow user to select
      });
      toast.success("🛒 Added to cart", {
        description: `${product.title} has been added successfully.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("❌ Failed to add", {
        description: "Something went wrong. Please try again.",
        duration: 3000,
      });
    }
  };

  return (
    <section>
      <Link
        href={"/"}
        passHref
        className="text-blue-500 my-3 mx-5 inline-block"
      >
        ← Back to products
      </Link>

      <div className="bg-black rounded-lg p-6">
        {/* Product Header */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2">
            <div className="relative w-[30rem] h-[25rem]">
              {product.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  fill
                  className="object-cover w-full h-full cursor-pointer absolute"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-bold mb-2 text-white">
              {product.title}
            </h1>
            <div className="flex items-center mb-4">
              <span className="bg-yellow-600 text-white px-2 py-1 rounded text-sm">
                {product.rating} ★
              </span>
              <span className="ml-2 text-gray-400">
                {product.brand} | {product.category}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-white">
                ₹{product.price}
              </span>
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

            <p className="mb-6 text-white">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-white">Availability</h3>
                <p className="text-white">
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Weight</h3>
                <p className="text-white">{product.weight} g</p>
              </div>
              {/* Add more specs as needed */}
            </div>

            <div className="opt flex items-center gap-5">
              <button
                onClick={() => addToCart(product.id)}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-yellow-700 transition"
              >
                Add to Cart
              </button>

              <div className="wishlist">
                <Heart
                  className="text-white cursor-pointer"
                  fill=""
                  size={30}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4 text-white">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-white">Specifications</h3>
              <ul className="space-y-2 text-white">
                <li>
                  <strong>Brand:</strong>{" "}
                  <span className="font-extralight">{product.brand}</span>
                </li>
                <li>
                  <strong>Category:</strong>{" "}
                  <span className="font-extralight text-sm">
                    {product.category}
                  </span>
                </li>
                <li>
                  <strong>SKU:</strong>{" "}
                  <span className="font-extralight text-sm">{product.sku}</span>
                </li>
                <li>
                  <strong>Dimensions:</strong>{" "}
                  <span className="font-extralight text-sm">
                    {product.dimensions.width}x{product.dimensions.height}x
                    {product.dimensions.depth} cm
                  </span>
                </li>
              </ul>
            </div>
            <div className="text-white">
              <h3 className="font-semibold mb-2">Warranty</h3>
              <p>{product.warrantyInformation}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 text-white">
              Customer Reviews
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-700 pb-4">
                  <div className="flex items-center mb-2">
                    <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                      {review.rating} ★
                    </span>
                    <span className="ml-2 font-medium text-white">
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

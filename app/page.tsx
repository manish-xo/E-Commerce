"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";

export default function Home() {
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

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
  console.log(products);
  return (
    <section className="w-full min-h-[100vh] bg-gray-500">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {products.map((item) => (
            <div key={item}></div>
          ))}
        </div>
      )}
    </section>
  );
}

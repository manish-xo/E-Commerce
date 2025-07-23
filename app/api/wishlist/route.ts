import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "@/libs/prisma";

// const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { productId, title, rating, price, discountPercentage } =
      await req.json();

    if (!productId || !title || price === undefined) {
      return NextResponse.json(
        { error: "Missing required product fields" },
        { status: 400 }
      );
    }

    //todo      <-----check if item already in wishlist----->
    const existingItem = await prisma.wishlistItem.findFirst({
      where: { productId },
    });
    if (existingItem) {
      return NextResponse.json(
        { message: "Item already in wishlist", item: existingItem },
        { status: 200 }
      );
    }

    // //todo      <-----Add new wishlist item----->
    const item = await prisma.wishlistItem.create({
      data: {
        productId,
        title,
        rating,
        price,
        discountPercentage,
      },
    });

    return NextResponse.json(
      { message: "Item added to wishlist", item },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

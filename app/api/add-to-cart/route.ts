import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
// import { exit } from "process";

export const POST = async (req: NextRequest) => {
  try {
    const {
      productId,
      quantity = 1,
      title,
      rating,
      brand,
      category,
      price,
      discountPercentage,
      description,
      stock,
    } = await req.json();

    if (!productId || !title || price === undefined) {
      return NextResponse.json(
        {
          error: "Missing required product fields",
          message: "Product ID is not found",
        },
        { status: 400 }
      );
    }
    // const prisma = new PrismaClient();

    //todo   <----check if item already exits in cart---->
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        productId,
      },
    });
    // console.log(existingItem);

    if (existingItem) {
      const updateItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
      });
      return NextResponse.json(
        { message: "Cart updated", item: updateItem },
        { status: 200 }
      );
    }

    //todo   <----Create a new cart item with full product data----->
    const newItem = await prisma.cartItem.create({
      data: {
        productId,
        title,
        rating,
        brand,
        category,
        price,
        discountPercentage,
        description,
        stock,
        quantity,
      },
    });
    return NextResponse.json(
      { message: "Item added to cart" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

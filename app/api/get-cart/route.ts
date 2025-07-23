import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { success } from "zod";

export const GET = async (req: NextRequest) => {
  try {
    const cartItem = await prisma.cartItem.findMany({});

    return NextResponse.json(
      { success: true, data: cartItem, count: cartItem.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Fetching cart items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart items" },
      { status: 404 }
    );
  }
};

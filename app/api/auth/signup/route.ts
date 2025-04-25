import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/connectToDB";
export const POST = async (req: NextRequest) => {
  if (
    req.headers.get("authorization")?.split(" ")[1] !==
    process.env.NEXT_PUBLIC_API_KEY
  ) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { name, email, password } = await req.json();

  try {
    await connectToDB();
    const salt = bcrypt.genSaltSync(8);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: newUser._id },
      process.env.NEXT_PUBLIC_API_KEY!
    );
    delete newUser.password;
    const res = NextResponse.json(
      { message: `User ${newUser.name} created successfully`, user: newUser },
      { status: 201 }
    );
    res.cookies.set("token", token);
    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

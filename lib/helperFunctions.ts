import { jwtVerify } from "jose";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
export const verifyToken = async (token: string) => {
  console.log("🚀 ~ verifyToken ~ token:", token);
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_API_KEY!);
    const { payload } = await jwtVerify(token, secret);
    console.log("🚀 ~ verifyToken ~ payload:", payload.id);

    return {
      id: payload.id as string,
    };
  } catch (error) {
    return false;
  }
};

export function serializeMongoId(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

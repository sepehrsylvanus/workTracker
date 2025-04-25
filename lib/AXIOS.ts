import axios from "axios";
export const WORK_API = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
  },
});

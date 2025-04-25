"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WorkCalendar } from "@/components/work-calendar";
import { WORK_API } from "@/lib/AXIOS";
import { verifyToken } from "@/lib/helperFunctions";
import { TUser } from "@/models/user.model";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<TUser>();
  const handleLogout = () => {
    Cookies.remove("token");
    router.refresh();
  };
  useEffect(() => {
    const func = async () => {
      const token = Cookies.get("token");
      const tokenPayload = (await verifyToken(token!)) as { id: string };

      const res = await WORK_API.get(`/user/${tokenPayload.id}`);
      setUser(res.data.safeUser);
    };
    func();
  }, []);

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between px-7">
        <h1 className="text-3xl font-bold mb-6">Work Schedule Tracker</h1>
        <Popover>
          <PopoverTrigger>
            <p className="text-gray-600 text-2xl">{user?.name}</p>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <Button variant={"destructive"} onClick={() => handleLogout()}>
              Logout
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <WorkCalendar />
    </main>
  );
}

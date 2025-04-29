import { getUser } from "@/actions/user.action";
import { WORK_API } from "@/lib/AXIOS";
import { verifyToken } from "@/lib/helperFunctions";
import { TUser } from "@/models/user.model";
import { useQuery } from "@tanstack/react-query";
export const useGetUser = () => {
  return useQuery<TUser>({
    queryKey: ["getUser"],
    queryFn: async () => {
      const user = await getUser();
      return user;
    },
  });
};

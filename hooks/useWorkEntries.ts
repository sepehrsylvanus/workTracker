import {
  AddEntries,
  deleteAllEntries,
  deleteEntry,
  getWorkEntries,
  updateEntry,
} from "@/actions/workEntries.action";
import { TWorkEntry } from "@/models/workEntries.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export const useGetEntries = () => {
  return useQuery({
    queryKey: ["getEntries"],
    queryFn: async () => {
      const entries = await getWorkEntries();
      return entries;
    },
  });
};

export const useAddEntries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workEntry: Omit<TWorkEntry, "user">) => {
      await AddEntries(workEntry);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getUser"],
      });
    },
  });
};

export const useUpdateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      entry: Omit<TWorkEntry, "user">;
    }) => {
      await updateEntry(data);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getUser"],
      });
    },
  });
};

export const useDeleteEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteEntry(id);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getUser"],
      });
    },
  });
};

export const useDeleteAllEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await deleteAllEntries();
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getUser"],
      });
    },
  });
};

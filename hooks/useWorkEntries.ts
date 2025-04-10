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
    mutationFn: async (workEntry: TWorkEntry) => {
      await AddEntries(workEntry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getEntries"],
      });
    },
  });
};

export const useUpdateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; entry: TWorkEntry }) => {
      await updateEntry(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getEntries"],
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
      queryClient.invalidateQueries({
        queryKey: ["getEntries"],
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
      queryClient.invalidateQueries({
        queryKey: ["getEntries"],
      });
    },
  });
};

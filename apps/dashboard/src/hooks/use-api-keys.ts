import type { ApiKey } from "@repo/db/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiKeysV1Client } from "@/lib/api-clients";

export function useApiKeys() {
  const {
    data: apiKeys = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: async (): Promise<ApiKey[]> => {
      const response = await apiKeysV1Client.index.$get();
      if (!response.ok) {
        console.error("API Key fetch failed");
        return [];
      }
      return response.json();
    },
  });

  return {
    apiKeys,
    isLoading,
    refetch,
  };
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const response = await apiKeysV1Client.index.$post({
        json: { name },
      });

      if (!response.ok) {
        throw new Error("Failed to create API key");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiKeysV1Client[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to revoke API key");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}

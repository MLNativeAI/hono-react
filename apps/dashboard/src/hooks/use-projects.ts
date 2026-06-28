import type { Project } from "@repo/db/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsV1Client } from "@/lib/api-clients";

export function useProjects() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const response = await projectsV1Client.index.$get();
      if (!response.ok) {
        console.error("Projects fetch failed");
        return [];
      }
      return response.json();
    },
  });

  return { projects, isLoading };
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      const response = await projectsV1Client.index.$post({
        json: input,
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await projectsV1Client[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

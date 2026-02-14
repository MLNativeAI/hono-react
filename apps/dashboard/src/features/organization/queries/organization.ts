import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const organizationQueries = {
  all: () => ["organization"],

  current: () =>
    queryOptions({
      queryKey: ["organization", "current"],

      queryFn: async () => {
        const { data, error } = await authClient.organization.getFullOrganization();

        if (error) {
          throw error;
        }

        return data;
      },
    }),

  activeMember: () =>
    queryOptions({
      queryKey: ["organization", "activeMember"],
      queryFn: async () => {
        const { data, error } = await authClient.organization.getActiveMember();

        if (error) {
          throw error;
        }

        return data;
      },
    }),
};

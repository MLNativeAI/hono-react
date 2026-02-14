import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const organizationQueries = {
  // A root key helper (useful for invalidating all org data at once)
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

  // // (Optional) You can easily extend this later for other lists
  // members: () =>
  //   queryOptions({
  //     queryKey: ["organization", "members"],
  //     queryFn: async () => {
  //       const { data, error } = await authClient.organization.getMembers();
  //       if (error) throw error;
  //       return data;
  //     },
  //   }),
};

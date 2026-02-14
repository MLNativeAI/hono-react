import { useQuery } from "@tanstack/react-query";
import { organizationQueries } from "@/features/organization/queries/organization";

export function useRole() {
  const { data: member, isLoading } = useQuery(organizationQueries.activeMember());
  return { member, isLoading };
}

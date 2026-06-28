import { Skeleton } from "@repo/ui/components/skeleton";
import { ApiKeysList } from "@/components/api-keys-list";
import { useApiKeys } from "@/hooks/use-api-keys";

export default function ApiKeysPage() {
  const { apiKeys, isLoading, refetch } = useApiKeys();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <ApiKeysList apiKeys={apiKeys} onRefresh={refetch} />;
}

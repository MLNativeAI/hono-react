import { DataTable } from "@/components/data-table";
import { getAllFilesQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
    const { data } = useQuery(getAllFilesQueryOptions);

    return (
        <div className="container mx-auto py-4">
            <DataTable data={data ?? []} />
        </div>
    );
}

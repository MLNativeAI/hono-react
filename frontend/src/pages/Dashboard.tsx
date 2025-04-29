import { DataTable } from "@/components/data-table";
import { getAllFilesQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const mockFiles = [
    {
        id: "1",
        filename: "package.json",
        path: "/",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
    },
    {
        id: "2",
        filename: "README.md",
        path: "/",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-10"),
    },
    {
        id: "3",
        filename: "tsconfig.json",
        path: "/",
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-12"),
    },
    {
        id: "4",
        filename: "index.tsx",
        path: "/src",
        createdAt: new Date("2024-01-04"),
        updatedAt: new Date("2024-01-14"),
    },
    {
        id: "5",
        filename: "styles.css",
        path: "/src/styles",
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-13"),
    },
];

export default function Dashboard() {
    const { data } = useQuery(getAllFilesQueryOptions);

    return (
        <div className="container mx-auto py-4">
            <h1 className="text-2xl font-bold mb-4">Files</h1>
            <DataTable data={data} />
        </div>
    );
}

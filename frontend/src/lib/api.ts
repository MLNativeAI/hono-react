import { hc } from "hono/client";
import { type ApiRoutes } from "@backend/index";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoutes>("/");

export const api = client.api;


export async function getAllFiles() {
    const res = await api.files.$get();
    console.log(res);
    if (!res.ok) {
        throw new Error("server error");
    }
    const data = await res.json();
    console.log(data);
    return data;
}

export const getAllFilesQueryOptions = queryOptions({
    queryKey: ["get-all-files"],
    queryFn: getAllFiles,
    staleTime: 1000 * 60 * 5,
});
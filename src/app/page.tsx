import { QueryBuilder } from "@/components/query-builder";
import { queryString } from "@/query-builder/playground";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <QueryBuilder />
      {queryString}
    </main>
  );
}

import { PageRouter } from "@/components/PageRouter/PageRouter";

export const revalidate = 60; // revalidate this segment every 60 seconds

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PageRouter />
    </main>
  );
}

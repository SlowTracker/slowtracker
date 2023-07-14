import {MyNeeds} from "../components/MyNeeds/MyNeeds";

export const revalidate = 60 // revalidate this segment every 60 seconds

export default async function Home() {
    const needs = await fetch("http://localhost:3000/api/needs").then((res) => res.json());

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center">Moje potrzeby</h1>

        <MyNeeds needs={needs} />
    </main>
  )
}

import { notFound } from "next/navigation";
import Image from "next/image";
import { Vessel } from "../lib/types";

async function getData() {
  const res = await fetch("http://localhost:3000/api/vessels", {
    cache: "no-store",
  });
  return res.json();
}

export default async function VesselPage({
  params,
}: {
  params: { id: string };
}) {
  const vessels: Vessel[] = await getData();
  const vessel = vessels.find((v: Vessel) => v.id == params.id);

  if (!vessel) return notFound();

  return (
    <div className="p-10">
      <Image 
        src={vessel.image} 
        alt={vessel.name || "Vessel Details"}
        width={800}
        height={400}
        className="w-full h-[400px] object-cover" 
        unoptimized
      />

      <h1 className="text-3xl font-bold mt-4">{vessel.name}</h1>
      <p className="text-xl text-blue-600">{vessel.price}</p>

      <p className="mt-4">{vessel.description}</p>
    </div>
  );
}
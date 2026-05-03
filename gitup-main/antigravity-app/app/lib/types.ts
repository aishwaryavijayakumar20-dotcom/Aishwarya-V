export interface RawVessel {
  id: number | string;
  name: string;
  source: string;
  price?: string;
  location?: string;
  image?: string;
  images?: string[];
  detailUrl?: string;
  auctionInfo?: string;
  description?: string;
  length?: string;
  beam?: string;
  hull?: string;
  engine?: string;
}

export interface Vessel {
  id: number | string;
  name: string;
  price: string;
  location: string;
  image: string;
  images: string[];
  status: string;
  description: string;
  year?: string;
  type?: string;
  length?: string;
  beam?: string;
  hull?: string;
  engine?: string;
  source?: string;
  detailUrl?: string;
  auctionInfo?: string;
}

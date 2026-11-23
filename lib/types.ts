export type Platform = "PC" | "iOS" | "Android";

export interface Game {
  id: string;
  title: string;
  slug: string;
  platforms: Platform[];
  price: number;
  originalPrice?: number;
  rating: number;
  genre: string;
  cover: string;
  banner?: string;
  tagline: string;
  description: string;
  featured?: boolean;
  releaseDate: string;
  developer: string;
  publisher: string;
  tags: string[];
}

export interface Accessory {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: "Controller" | "Headset" | "Keyboard" | "Mouse" | "Mousepad" | "Chair" | "Streaming";
  image: string;
  description: string;
  tags: string[];
}

export type Sellable = (Game & { kind: "game" }) | (Accessory & { kind: "accessory" });

export interface CartItem {
  id: string;
  kind: "game" | "accessory";
  title: string;
  price: number;
  image: string;
  quantity: number;
  meta?: string;
}

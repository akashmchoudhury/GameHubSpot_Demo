import type { Accessory } from "./types";

export const ACCESSORIES: Accessory[] = [
  {
    id: "a-ctrl-omega",
    slug: "omega-controller",
    title: "Omega Elite Controller",
    price: 89.0,
    category: "Controller",
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&q=70&auto=format",
    description: "Low-latency wireless controller with magnetic hall-effect sticks and swappable d-pad.",
    tags: ["Wireless", "Hall-effect", "PC/Mobile"]
  },
  {
    id: "a-hdset-reaper",
    slug: "reaper-headset",
    title: "Reaper 7.1 Headset",
    price: 129.0,
    category: "Headset",
    image: "https://images.unsplash.com/photo-1518443855757-dfadac7101ae?w=800&q=70&auto=format",
    description: "7.1 surround headset with detachable broadcast-grade mic and memory-foam cups.",
    tags: ["7.1 Surround", "Detachable mic", "USB-C"]
  },
  {
    id: "a-kbd-mantis",
    slug: "mantis-keyboard",
    title: "Mantis TKL Mechanical",
    price: 149.0,
    category: "Keyboard",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=70&auto=format",
    description: "Tenkeyless hot-swappable mechanical board with per-key RGB and gasket mount.",
    tags: ["Hot-swap", "RGB", "Gasket-mount"]
  },
  {
    id: "a-mouse-vex",
    slug: "vex-mouse",
    title: "Vex Lightweight Mouse",
    price: 69.0,
    category: "Mouse",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=70&auto=format",
    description: "58g honeycomb shell, 26,000 DPI optical sensor, PTFE skates.",
    tags: ["58g", "26K DPI", "Wireless"]
  },
  {
    id: "a-pad-expanse",
    slug: "expanse-mousepad",
    title: "Expanse XXL Mousepad",
    price: 29.0,
    category: "Mousepad",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=70&auto=format",
    description: "900x400mm cloth pad with stitched edges and a neon-etched hub logo.",
    tags: ["XXL", "Stitched", "Non-slip"]
  },
  {
    id: "a-chair-throne",
    slug: "throne-chair",
    title: "Throne Ergo Chair",
    price: 399.0,
    category: "Chair",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=70&auto=format",
    description: "4D armrests, lumbar support, and breathable mesh back for 10-hour sessions.",
    tags: ["4D arms", "Mesh", "Ergo"]
  },
  {
    id: "a-cam-streamer",
    slug: "streamer-cam",
    title: "Streamer 4K Capture Cam",
    price: 189.0,
    category: "Streaming",
    image: "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&q=70&auto=format",
    description: "4K60 webcam with built-in key-light and privacy shutter.",
    tags: ["4K60", "Key-light", "USB-C"]
  },
  {
    id: "a-kbd-sprite",
    slug: "sprite-keyboard",
    title: "Sprite 60% Mini",
    price: 99.0,
    category: "Keyboard",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=70&auto=format",
    description: "60% compact board, Bluetooth + USB-C, perfect for mobile gaming setups.",
    tags: ["60%", "Bluetooth", "Compact"]
  }
];

export function getAccessoryBySlug(slug: string): Accessory | undefined {
  return ACCESSORIES.find((a) => a.slug === slug);
}

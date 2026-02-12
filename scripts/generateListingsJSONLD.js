// scripts/generateListingsJSONLD.js
import fs from "fs";
import path from "path";
import axios from "axios"; // <-- use axios directly

function formatDistance(meters) {
  const m = Number(meters);
  if (!Number.isFinite(m) || m < 0) return null;
  if (m < 1000) return `${Math.round(m)} m`;
  const km = m / 1000;
  return `${km.toFixed(2).replace(/\.?0+$/, "")} km`;
}

async function main() {
  try {
    // Use default coordinates or your campus location
    const coordinates = { latitude: 0, longitude: 0 };

    // Direct API request instead of ApiSocket
    const response = await axios.post(
      "https://campushub4293.pythonanywhere.com/comrade/get_listings",
      { coordinates }
    );

    const listings = response.data.listings || [];
    console.log("API response:", response.data);


    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": listings.map((l, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://campushub-website.vercel.app/room/${l.listing_id}`,
        "item": {
          "@type": "Product",
          "name": l.listing_name,
          "image": l.images?.[0] || "/placeholder.jpg",
          "description": `Verified ${l.listing_type || "room"} near campus at ${l.location?.address || "Unknown"}`,
          "offers": {
            "@type": "Offer",
            "price": Number(l.price),
            "priceCurrency": "KES",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    };

    const filePath = path.join(process.cwd(), "public", "listings.json");
    fs.writeFileSync(filePath, JSON.stringify(itemList, null, 2));
    console.log("✅ JSON-LD file generated at /public/listings.json");
  } catch (err) {
    console.error("❌ Failed to generate JSON-LD:", err);
  }
}

main();

/**
 * Transforms a Cloudinary URL to include optimization parameters.
 * e.g., inserts f_auto,q_auto and optional resizing/cropping parameters.
 */
export function getOptimizedCloudinaryUrl(url: string, width?: number): string {
  if (!url) return "";
  if (!url.includes("cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  try {
    const parts = url.split("/upload/");
    if (parts.length === 2) {
      // Build transformation string
      let transform = "f_auto,q_auto";
      if (width) {
        transform += `,w_${width},c_limit`;
      }
      return `${parts[0]}/upload/${transform}/${parts[1]}`;
    }
  } catch (e) {
    console.error("Error optimizing Cloudinary URL:", e);
  }

  return url;
}

/**
 * Normalizes different gallery storage structures into a single consistent format:
 * Array of { imageUrl: string; publicId: string }
 */
export function normalizeGallery(gallery: any): { imageUrl: string; publicId: string }[] {
  if (!gallery) return [];
  let arr = gallery;
  if (typeof gallery === "string") {
    try {
      arr = JSON.parse(gallery);
    } catch (e) {
      return [];
    }
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .map((item: any, idx: number) => {
      if (!item) return null;
      if (typeof item === "string") {
        return { imageUrl: item, publicId: `gallery_${idx}` };
      }
      if (typeof item === "object") {
        const imageUrl = item.secureUrl || item.secure_url || item.imageUrl || item.url || "";
        const publicId = item.publicId || item.public_id || `gallery_${idx}`;
        if (!imageUrl) return null;
        return { imageUrl, publicId };
      }
      return null;
    })
    .filter(Boolean) as { imageUrl: string; publicId: string }[];
}

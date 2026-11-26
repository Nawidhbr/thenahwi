/**
 * The photos of the site, in colour: Arabic inscriptions in tile, stucco, paint, wood and stone (decisions 2026-11-26;
 * public/photos/<slug>-<width>.webp and .avif). Chosen by the owner; the photographers' names are taken from the
 * Unsplash file names.
 * All from Unsplash (Unsplash License: free to use; credit is appreciated, not required). The site shows no credit
 * (the owner's choice); `photographer` and `url` (the photo's Unsplash page) are kept here for the record.
 * `place` is only what the picture clearly shows; leave it out where unsure. Alt texts are in `alt`.
 */
export interface Photo {
  slug: string;
  /** Landscape or portrait, for cropping. */
  shape: "portrait" | "landscape";
  /** What it shows, for screen readers (English; the site is built English-first). */
  alt: string;
  /** Where it was taken, as far as certain (shown in captions). */
  place?: string;
  photographer?: string;
  url?: string;
}

export const PHOTOS: Photo[] = [
  // None says where it was taken, so no photo has a place and no caption is shown.
  { slug: "painted-arch-allah-kafi", alt: "A painted arch with Allāh kāfī in gold on blue, among floral panels in red, yellow and green", shape: "landscape", photographer: "Sultan Ali", url: "https://unsplash.com/photos/tKjP-y8LrCY" },
  { slug: "zellij-star-inscription", alt: "Black interlacing zellij bands around an eight-pointed star tile inscribed wa-lā ghāliba illā Allāh", shape: "landscape", photographer: "Abdullah Habib", url: "https://unsplash.com/photos/-744gdjPhEY" },
  { slug: "stucco-medallion-blue", alt: "A carved stucco medallion of Arabic verse on a blue ground, framed by star and leaf patterns", shape: "landscape", photographer: "Abdullah Habib", url: "https://unsplash.com/photos/IRt-IePyqiA" },
  { slug: "tile-niche-inscription", alt: "A tiled niche with an Arabic inscription in blue on white, framed by bands of orange and blue tile mosaic", shape: "portrait", photographer: "Adeel Shabir", url: "https://unsplash.com/photos/P5rcqcz7bUc" },
  { slug: "gilded-wall-inscriptions", alt: "A gilded wall with bands of Arabic inscriptions in blue and turquoise enamel", shape: "portrait", photographer: "Ahmed Al-Ghabban", url: "https://unsplash.com/photos/HSkRsB-wQTU" },
  { slug: "painted-arches-red-blue", alt: "Painted arches and a cornice in red, blue and gold, with gilded Arabic inscriptions", shape: "portrait", photographer: "Ahmet Olcum", url: "https://unsplash.com/photos/GaSeKzaDP3c" },
  { slug: "painted-chamber-gold-script", alt: "A painted wall of gold Arabic script on blue and red, above a green cloth embroidered with calligraphy", shape: "portrait", photographer: "Ahmet Olcum", url: "https://unsplash.com/photos/ZVTKsfjhZTY" },
  { slug: "zellij-glazed-inscription", alt: "A band of glazed tile inscription between carved stucco and zellij in brown, blue, green and black", shape: "landscape", photographer: "Bernd Dittrich", url: "https://unsplash.com/photos/TMUwecUAv5E" },
  { slug: "carved-stucco-stars", alt: "Carved stucco in warm clay: star patterns enclosing the name of God, beside a band of inscription", shape: "landscape", photographer: "Dani Zapater", url: "https://unsplash.com/photos/fG3pog5TQaU" },
  { slug: "stucco-script-interlace", alt: "A carved stucco inscription over a frieze of stepped tiles and an interlace of glazed tile", shape: "landscape", photographer: "Eleni Afiontzi", url: "https://unsplash.com/photos/P29rJBbsync" },
  { slug: "blue-mosaic-inscription", alt: "A blue tile-mosaic inscription in white under a pattern of stars and flowers", shape: "landscape", photographer: "Far Chinberdiev", url: "https://unsplash.com/photos/ctSqoBiO8HY" },
  { slug: "stucco-script-zellij", alt: "A carved stucco inscription above green, black and amber tilework", shape: "portrait", photographer: "Jimmy Hu", url: "https://unsplash.com/photos/iRtZwbo5iRc" },
  { slug: "shahada-over-door", alt: "The shahāda in gold above a doorway, in a room lined with blue and green tiles", shape: "landscape", photographer: "Le Mucky", url: "https://unsplash.com/photos/mlrvFH9VNZk" },
  { slug: "tiled-portal-verse", alt: "A tiled portal with a Qurʾānic verse in white on blue, with pigeons on the ledge", shape: "landscape", photographer: "mhrezaa", url: "https://unsplash.com/photos/he4qjM1cJ_Y" },
  { slug: "painted-arch-panel", alt: "A painted arched panel in a carved wooden frame, inscribed rabbi ishraḥ lī ṣadrī", shape: "portrait", photographer: "Mohammad O. Siddiqui", url: "https://unsplash.com/photos/q_TIfqetmZI" },
  { slug: "stone-inscription", alt: "A carved stone inscription panel dated 1184", shape: "landscape", photographer: "Talal Elmountassir", url: "https://unsplash.com/photos/yjT5IQ__bpg" },
  { slug: "painted-inscription-blue-gold", alt: "A painted inscription in white on blue, framed by gold star and leaf patterns", shape: "landscape", photographer: "Youssef Swelim", url: "https://unsplash.com/photos/qWWgh_jL1j4" },
];

/** The widths every photo is made in (scripts/make-photos.cjs), each as WebP and AVIF; components/Photo.astro offers them. */
export const PHOTO_WIDTHS = [160, 320, 480, 800, 1600] as const;
export const photoSrc = (slug: string, w: (typeof PHOTO_WIDTHS)[number] = 1600, ext: "webp" | "avif" = "webp") => `/photos/${slug}-${w}.${ext}`;

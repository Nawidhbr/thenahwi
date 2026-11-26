/**
 * The black-and-white architecture photos of the knowledge base (public/photos/<slug>-800.webp and -1600.webp).
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
  { slug: "istanbul-dome", alt: "Domes and finials of an Ottoman mosque under a grey sky", shape: "portrait", place: "Istanbul" },
  { slug: "istanbul-portico", alt: "A portico of granite columns and striped arches in an Ottoman mosque courtyard", shape: "portrait", place: "Istanbul" },
  { slug: "shiraz-columns", alt: "Twisted stone columns and tiled vaults in a prayer hall", shape: "portrait", place: "Nasir al-Mulk Mosque, Shiraz" },
  { slug: "morocco-carved-arch", alt: "Carved stucco and cedar around an arch in a Moroccan madrasa", shape: "portrait" },
  { slug: "morocco-keyhole-window", alt: "A horseshoe-arched window opening on a courtyard, with a pigeon on the ledge", shape: "portrait" },
  { slug: "persian-tiled-dome", alt: "A Persian dome covered in geometric brick-and-tile patterns", shape: "portrait" },
  { slug: "taj-minaret", alt: "A minaret of the Taj Mahal seen from below", shape: "portrait", place: "Taj Mahal, Agra" },
  { slug: "isfahan-muqarnas", alt: "The muqarnas vault of a mosque portal, densely tiled", shape: "landscape", place: "Isfahan" },
  { slug: "agra-domes", alt: "Marble domes rising above trees, with birds in the sky", shape: "portrait", place: "Agra" },
  { slug: "mughal-half-dome", alt: "A half-dome filled with rows of carved stucco cells", shape: "landscape" },
  { slug: "seville-arch", alt: "A lobed arch framing an arcaded courtyard", shape: "portrait", place: "Alcázar, Seville" },
  { slug: "lahore-badshahi", alt: "A minaret and onion domes of a Mughal mosque against clouds", shape: "portrait", place: "Badshahi Mosque, Lahore" },
  { slug: "delhi-safdarjung", alt: "A Mughal façade with a corner tower and a carved half-dome", shape: "landscape", place: "Delhi" },
  { slug: "delhi-jali-window", alt: "A carved stone window with a star-patterned lattice and Arabic inscriptions", shape: "portrait", place: "Delhi" },
  // Added 5 November 2026.
  { slug: "dome-crescent-moon", alt: "A tiled dome with a crescent finial and the moon in a pale sky", shape: "landscape" },
  { slug: "carved-capital", alt: "A carved capital of ivy and lilies under two stone arches", shape: "portrait" },
  { slug: "alhambra-door", alt: "A wooden door under a carved stucco frame with Arabic inscriptions", shape: "portrait", place: "Alhambra, Granada" },
  { slug: "muscat-courtyard", alt: "A marble courtyard with pointed arches and a minaret", shape: "landscape", place: "Sultan Qaboos Grand Mosque, Muscat" },
  { slug: "taj-through-arch", alt: "The Taj Mahal seen through a dark gateway arch", shape: "portrait", place: "Taj Mahal, Agra" },
  { slug: "jali-hexagons", alt: "A marble window screen of hexagonal lattice under a cusped arch", shape: "portrait" },
  { slug: "fort-pavilion", alt: "A domed pavilion rising above weathered fort walls", shape: "portrait" },
  { slug: "mirror-ceiling", alt: "A ceiling of inlaid mirror-work and carved floral panels", shape: "landscape" },
  { slug: "taj-dome", alt: "The marble dome of the Taj Mahal above an inscribed arch", shape: "portrait", place: "Taj Mahal, Agra" },
  { slug: "painted-vaults", alt: "Ribbed vaults painted with stars and interlace springing from a column", shape: "portrait" },
  { slug: "palace-balconies", alt: "Stone balconies and scalloped arches around a palace courtyard", shape: "portrait" },
  { slug: "mihrab-inscription", alt: "A curved marble band of Arabic inscription between bands of geometric inlay", shape: "landscape" },
  { slug: "grey-dome-finial", alt: "A plain dome with a crescent finial above a pierced balustrade", shape: "portrait" },
  { slug: "tomb-in-trees", alt: "A domed tomb with corner pavilions rising above trees", shape: "portrait" },
  { slug: "arcade-light", alt: "A stone arcade with a pool of light on the floor", shape: "portrait" },
  { slug: "arch-corridor", alt: "A long corridor of pointed arches", shape: "portrait" },
  { slug: "marble-dome-facade", alt: "A white marble dome over a banded stone façade with a cusped arch", shape: "portrait" },
  { slug: "jali-niche", alt: "A pointed niche filled with a geometric stone lattice", shape: "portrait" },
  { slug: "arch-balconies", alt: "A great pointed arch with lattice balconies", shape: "portrait" },
  { slug: "zigzag-dome", alt: "A metal dome with a zigzag band and a crescent-and-star finial", shape: "landscape" },
  { slug: "marrakesh-madrasa", alt: "A carved stucco courtyard wall seen through a scalloped window", shape: "portrait", place: "Ben Youssef Madrasa, Marrakesh" },
  { slug: "abu-dhabi-domes", alt: "White marble domes with crescent finials", shape: "portrait", place: "Sheikh Zayed Grand Mosque, Abu Dhabi" },
  { slug: "istanbul-sultan-ahmed", alt: "Domes and minarets of an Ottoman mosque, with gulls", shape: "portrait", place: "Sultan Ahmed Mosque, Istanbul" },
  { slug: "brick-dome-minaret", alt: "A brick dome and a tiled minaret against a clear sky", shape: "portrait" },
  { slug: "twin-minarets-dark", alt: "Two tiled minarets above a mud-brick wall", shape: "portrait" },
  { slug: "calligraphy-dome", alt: "A tiled dome and minaret wrapped in calligraphy", shape: "landscape" },
  { slug: "istanbul-waterfront", alt: "A waterfront mosque with two slender minarets", shape: "portrait", place: "Dolmabahçe Mosque, Istanbul" },
  { slug: "islamabad-faisal", alt: "The tent-like roof and pencil minarets of a modern mosque", shape: "landscape", place: "Faisal Mosque, Islamabad" },
  { slug: "isfahan-lotfollah", alt: "A tiled dome and portal on a city square", shape: "portrait", place: "Sheikh Lotfollah Mosque, Isfahan" },
  { slug: "jerusalem-dome-of-the-rock", alt: "An octagonal shrine with a gilded dome and tiled walls", shape: "landscape", place: "Dome of the Rock, Jerusalem" },
  { slug: "yazd-amir-chakhmaq", alt: "A tiered façade with twin minarets behind fountains", shape: "portrait", place: "Amir Chakhmaq Complex, Yazd" },
  { slug: "yazd-jameh-portal", alt: "A tiled portal with muqarnas and twin minarets, seen from below", shape: "portrait", place: "Jameh Mosque, Yazd" },
  { slug: "minaret-birds", alt: "A tiled minaret with a wooden balcony and two birds", shape: "portrait" },
  { slug: "minaret-wires", alt: "A tiled minaret and dome behind overhead wires", shape: "portrait" },
  { slug: "abu-dhabi-dome", alt: "Two white domes in hard light", shape: "portrait", place: "Sheikh Zayed Grand Mosque, Abu Dhabi" },
  { slug: "taj-from-below", alt: "The marble façade of the Taj Mahal seen from below", shape: "portrait", place: "Taj Mahal, Agra" },
  { slug: "jerusalem-al-aqsa", alt: "A ribbed dome above stone walls", shape: "landscape", place: "al-Aqsa Mosque, Jerusalem" },
];

/** The widths every photo is made in (scripts/make-photos.cjs), each as WebP and AVIF; components/Photo.astro offers them. */
export const PHOTO_WIDTHS = [160, 320, 480, 800, 1600] as const;
export const photoSrc = (slug: string, w: (typeof PHOTO_WIDTHS)[number] = 1600, ext: "webp" | "avif" = "webp") => `/photos/${slug}-${w}.${ext}`;

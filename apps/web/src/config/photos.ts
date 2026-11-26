/**
 * The tile photos of the site, in colour (decisions 2026-11-26; public/photos/<slug>-<width>.webp and .avif). Chosen by
 * the owner; the photographers' names are taken from the Unsplash file names.
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
  // None shows where it was taken, so no photo has a place and no caption is shown.
  { slug: "painted-tiles-blue-ochre", alt: "Painted tiles in blue and black on white, one at the centre with ochre leaves", shape: "landscape", photographer: "Ashkan Forouzani", url: "https://unsplash.com/photos/oVrkcrvAO3s" },
  { slug: "zellij-stars", alt: "Zellij of cut glazed pieces in blue, brown, green, black and white, set in eight-pointed stars", shape: "landscape", photographer: "Bernd Dittrich", url: "https://unsplash.com/photos/KXy4bNsCUkw" },
  { slug: "cement-tiles-orange", alt: "Orange and cream tiles with a dark blue interlace running through them", shape: "portrait", photographer: "Charles Robert", url: "https://unsplash.com/photos/9Qq0B17wGLE" },
  { slug: "glazed-hexagons-green", alt: "Green glazed hexagonal tiles framed in amber, each with a flower in relief", shape: "landscape", photographer: "Eric Prouzet", url: "https://unsplash.com/photos/bRlCr6Dj0F4" },
  { slug: "mosaic-floor-pink", alt: "A worn mosaic floor of white, pink and dark blue pieces in rosettes", shape: "landscape", photographer: "Francesca Pieleanu", url: "https://unsplash.com/photos/IwazwDz_wj0" },
  { slug: "zellij-diamonds", alt: "Zellij of turquoise, green, yellow and amber pieces in a pattern of diamonds", shape: "landscape", photographer: "Haydn", url: "https://unsplash.com/photos/nh5HUs8aN6c" },
  { slug: "star-rosette-tiles", alt: "Tiles patterned with star rosettes in blue, rust, green and black on white", shape: "landscape", photographer: "Haydn", url: "https://unsplash.com/photos/wHnqnas3jt4" },
  { slug: "stone-inlay-star", alt: "Stone inlay: white marble bands, amber and grey stones and flowers around an eight-pointed star", shape: "landscape", photographer: "Jan Dommerholt", url: "https://unsplash.com/photos/YExkox2vFUA" },
  { slug: "painted-tiles-navy", alt: "Dark blue tiles with white floral patterns", shape: "landscape", photographer: "Jonas Schone", url: "https://unsplash.com/photos/Y2uvkg3lll4" },
  { slug: "patterned-tiles-wall", alt: "A wall of small patterned tiles in brown, blue-grey, black and cream", shape: "portrait", photographer: "Kelly Sikkema", url: "https://unsplash.com/photos/hLjGn1h9f2k" },
  { slug: "stone-inlay-hexagons", alt: "Stone inlay of white marble with yellow and grey stones, six-pointed stars and flowers", shape: "landscape", photographer: "Koushik Chowdavarapu", url: "https://unsplash.com/photos/aWBPk_GBaCk" },
  { slug: "painted-tiles-stars", alt: "Hand-painted tiles with white eight-pointed stars amid blue, yellow and lilac", shape: "portrait", photographer: "Lilit Barfyan", url: "https://unsplash.com/photos/-HUWRMysJw0" },
  { slug: "zellij-interlace", alt: "Zellij of white interlacing bands with blue, amber, black and green stars", shape: "landscape", photographer: "Matthias Franze", url: "https://unsplash.com/photos/64Uh34dnCPI" },
  { slug: "tiles-orange-patchwork", alt: "A wall of patterned tiles in orange, black, grey and cream", shape: "landscape", photographer: "Patrick Hendry", url: "https://unsplash.com/photos/hezNrE5QEa8" },
  { slug: "tiles-orange-closeup", alt: "Patterned tiles in orange, black and cream, close up", shape: "landscape", photographer: "Patrick Hendry", url: "https://unsplash.com/photos/oaaRPhOz5Dg" },
  { slug: "interlace-teal-orange", alt: "White interlacing bands outlined in orange on dark teal glazed tiles", shape: "landscape", photographer: "Raimond Klavins", url: "https://unsplash.com/photos/x8fj0smFXAE" },
  { slug: "azulejos-blue-orange", alt: "Painted tiles in blue, orange and brown, each with its own pattern", shape: "landscape", photographer: "Richard Bell", url: "https://unsplash.com/photos/3FcuoXvkCUs" },
  { slug: "zellij-curved", alt: "Zellij of curved pieces in blue, green, amber and black around six-pointed stars and hexagons", shape: "landscape", photographer: "Tom TVR", url: "https://unsplash.com/photos/Ym0ps0XqgPY" },
];

/** The widths every photo is made in (scripts/make-photos.cjs), each as WebP and AVIF; components/Photo.astro offers them. */
export const PHOTO_WIDTHS = [160, 320, 480, 800, 1600] as const;
export const photoSrc = (slug: string, w: (typeof PHOTO_WIDTHS)[number] = 1600, ext: "webp" | "avif" = "webp") => `/photos/${slug}-${w}.${ext}`;

# seic.com media audit (2026-11-04)

Every page in the www.seic.com sitemap was fetched (**2,575 pages**: en-us 1,453 · en-gb 657 · en-ca 249 · fr-ca 216; none failed). Each image, document, video and audio item found on those pages was measured: file size from the server (HEAD / ranged request), image pixel size read from the file header, video length, resolution and MP4 size from SEI's Brightcove account, podcast file size from Megaphone.

## Totals

| Type | Unique items | Total size | Notes |
|---|---|---|---|
| Images | 1,516 | 498.6 MB | JPEG 1058, PNG 216, SVG 198, WebP 42; hosted on Frontify (1,037), media.ffycdn.net (392), www.seic.com (86) |
| Documents (SEI-hosted) | 789 | 426.8 MB | PDF 777, XLS 7, XLSX 4, ZIP 1; on www.seic.com, apps.seic.com (fund documents), images.insight.seic.com |
| Documents (third-party links) | 33 | — | sec.gov, EY, Capgemini etc. |
| Video (Brightcove) | 172 | 23.3 GB (best MP4s) | 17.3 hours; 1080p 104, 720p 61, square 1080×1080 6; 117 have captions |
| Video (YouTube embeds/links) | 7 | — | mostly third-party interviews about SEI; 2 no longer public |
| Audio (Megaphone podcasts) | 49 | 1.67 GB | MP3; ≈30 hours (estimated at 128 kbps) |
| Audio (Podbean) | 9 | — | ETF Revolution series and older episodes (Podbean player) |
| Audio (Brightcove, audio only) | 2 | — | Sphere cyber-security podcasts |

No SoundCloud, Vimeo, HTML5 `<video>`/`<audio>` files or direct .mp3/.mp4 links were found.

## Findings

- **Very heavy images.** 90 images are over 1 MB and 208 over 500 KB; 269 are wider than 2,500 px. The largest are 2880×1296 PNG hero images of 9–11 MB (mostly en-gb institutional pages) — the Frontify URLs serve the original file, not a web-sized version.
- **Broken document links.** 38 SEI-hosted documents return an error (mostly 404), mainly Canadian fund documents on apps.seic.com and GrowthLink toolkit PDFs on images.insight.seic.com; 16 third-party documents are also gone. See the `HTTP status` column in documents.csv.
- **Alt text.** 62 of 1,348 `<img>` images have an empty alt the first time they appear (often decorative, but worth reviewing).
- **One broken image** (Frontify asset 27152) and **2 YouTube videos** that are private or removed.
- **Captions.** 55 of 172 Brightcove videos have no caption track.

## Largest images

| Size | Pixels | Format | Pages | Example page |
|---|---|---|---|---|
| 10.8 MB | 2880×1296 | PNG | 3 | /en-gb/institutional-investors/our-insights/15-years-investment-excellence-case-study |
| 10.2 MB | 2880×1296 | PNG | 1 | /financial-advisors/taking-pulse-lets-talk-vital/generating-income-how-far-can-your-income-take-you |
| 10.1 MB | 2880×1296 | PNG | 4 | /en-gb/institutional-investors/our-insights/our-holistic-approach-risk-management-case-study |
| 10.1 MB | 2880×1296 | PNG | 1 | /en-gb/institutional-investors/our-insights/navigating-cost-living-crisis-sei-glidepath |
| 9.3 MB | 2880×1296 | PNG | 3 | /en-gb/institutional-investors/our-insights/our-holistic-approach-risk-management-case-study |
| 9.1 MB | 3840×1280 | PNG | 3 | /en-ca/financial-advisors/stability |
| 9.0 MB | 2880×1296 | PNG | 3 | /en-gb/about-sei/our-insights/navigating-cost-living-crisis |
| 8.6 MB | 2880×1296 | PNG | 1 | /en-gb/asset-managers/our-insights/evolving-distribution-models-alternative-investments |
| 8.2 MB | 2880×1296 | PNG | 1 | /financial-advisors/taking-pulse-lets-talk-vital/managing-taxes-keep-more-what-you-earn |
| 7.8 MB | 2880×1296 | PNG | 1 | /financial-advisors/taking-pulse-lets-talk-vital/vital-materials |

## Files

| File | One row per | Key columns |
|---|---|---|
| images.csv | unique image URL | host, format, width/height px, file size KB, HTTP status, alt text, how used (img, srcset, CSS background, social share), number of pages, locales, example page |
| documents.csv | unique document link | type, file size KB, HTTP status, pages linking to it, locales, example page |
| video.csv | video | platform, ID, name, length, best MP4 resolution and size, renditions, captions, published date, page paths |
| audio.csv | episode | platform (Megaphone, Podbean, Brightcove), ID, page title, format, file size MB, estimated length, page paths |
| pages.csv | sitemap page | locale, title, counts of images / documents / videos / podcasts on the page |

Notes: sizes are what the servers report for the exact URL used on the page; Frontify/ffycdn image URLs may be resized variants of the same asset, so one picture can appear as several rows. Megaphone lengths are estimated from file size at 128 kbps. Pages behind sign-in, search results and content loaded only after user interaction are not included.

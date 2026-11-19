# The World in One Day — Thursday 19 November 2026

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/diablosan19/news-image-20261119/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/diablosan19/news-image-20261119/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

A one-page newspaper front page that sums up the world news of **Thursday
19 November 2026** in a single 1024×1024 image (`entry.png`). A reader who
missed the day should be able to reconstruct it from this page alone: the
date is the biggest thing on the page after the title, the lead story
dominates, and six more stories fill a grid — each with a small illustration,
a short headline and a one-line caption. A ticker along the bottom carries
three further stories that would not fit the grid.

## The stories

- **Lead — Trump, Xi and Putin: a first trilateral summit.** The three
  leaders met for 90 minutes in Shenzhen, on the APEC sidelines, and issued
  a four-point "Declaration Toward Peace": UN reform, more refined fuel,
  limits on the ICC, and a pledge that a nuclear war "cannot be won and must
  never be fought". No binding deal was announced, and Ukraine and Iran
  were not named in the text. The illustration shows the Shenzhen skyline at
  dusk with the American, Chinese and Russian flags flying side by side.
- **Ukraine — Kerch Bridge hit for a third time in a week.** Neptune
  missiles struck the bridge's rail section on Thursday and train traffic
  stopped; the road span has been shut since Tuesday's strike brought a
  section down.
- **Middle East — Missile hits Riyadh's PIF Tower.** A suspected Houthi
  missile blew out windows across seven to eight floors of Saudi Arabia's
  sovereign wealth fund tower — the second strike on the capital's financial
  district in eleven days.
- **Justice — ICJ: Myanmar committed genocide of the Rohingya.** By 9 votes
  to 6, the world court found Myanmar responsible for genocide in 2017 —
  the first such ruling against a state — and ordered safe return and
  compensation for survivors.
- **Markets — Anthropic: the biggest IPO in history.** The Claude maker
  raised a record $81.3bn at $83 a share, valuing it at about $1.5tn on a
  fully diluted basis; its shares start trading on the Nasdaq on Thursday
  under the ticker ANT.
- **Nuclear — North Korea expands Yongbyon enrichment.** The IAEA says
  Pyongyang built an extension to its original uranium enrichment plant,
  externally complete by late October, and calls the programme a cause for
  serious concern.
- **Arctic — Denmark ratifies Greenland deal, 109–0.** Copenhagen
  unanimously approved the US security agreement for Greenland, expanding
  America's military role — including a Golden Dome missile shield — while
  keeping Danish sovereignty.

**Also today (ticker):** Europe's Coalition of the Willing meets in Berlin
on Ukraine security guarantees; Cyclone Akvan: Odisha evacuates 80,000+
people before a Friday landfall; Israel ends its central Gaza tank raid, the
first ground operation beyond the Yellow Line since the October 2025 truce.

Stories were chosen for breadth: great-power diplomacy, two wars, a
landmark court ruling, the biggest IPO on record, a nuclear warning and an
Arctic security deal. Every story on the page was checked against at least
two independent reports before it was printed — see `SOURCES.md` for the
story-by-story notes. Claims that only one side asserted (battlefield
damage assessments, the precise origin of the Riyadh missile) are stated as
claims, not as established fact.

## Sources

The day's reporting as carried by Reuters, the Associated Press and AFP;
The Guardian and the BBC on the ICJ ruling; Xinhua and the Kremlin for the
declaration text; the India Meteorological Department on Cyclone Akvan; and
the day's digests from Particle News and Open Chronicle.
Full per-story verification notes are in `SOURCES.md`.

## How it is made

The page is hand-built HTML/CSS with inline SVG illustrations — no
downloaded images, no stock art. `render.mjs` rasterises `page.html` at
exactly 1024×1024 with headless Chromium into `entry.png`. The contest
program itself is `main.ts`: it verifies the bundled image against the
contest caps (PNG or JPEG, at most 1024×1024 pixels, at most 1 MiB) by
reading the dimensions from the file header, then copies the verified
bytes to the output directory. It runs offline and writes identical bytes
on every run.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This writes the verified front page to `out/entry.png`.

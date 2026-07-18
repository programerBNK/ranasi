#!/usr/bin/env python3
"""Resize generated sources into Chrome Web Store exact pixel sizes (RGB, no alpha)."""

from pathlib import Path

from PIL import Image

ASSETS = Path(
    "/Users/natharuch/.cursor/projects/Users-natharuch-Desktop-auto-flow/assets"
)
OUT = Path(__file__).resolve().parent
BG = (26, 31, 28)

SOURCES = {
    "store-icon-128.png": (ASSETS / "ranasi-store-icon-source.png", (128, 128), "fit"),
    "screenshot-1-1280x800.png": (
        ASSETS / "ranasi-screenshot-1-source.png",
        (1280, 800),
        "cover",
    ),
    "screenshot-2-1280x800.png": (
        ASSETS / "ranasi-screenshot-2-source.png",
        (1280, 800),
        "cover",
    ),
    "promo-small-440x280.png": (
        ASSETS / "ranasi-promo-small-source.png",
        (440, 280),
        "cover",
    ),
    "promo-marquee-1400x560.png": (
        ASSETS / "ranasi-marquee-source.png",
        (1400, 560),
        "cover",
    ),
}


def cover(img: Image.Image, size: tuple[int, int]) -> Image.Image:
    img = img.convert("RGBA")
    tw, th = size
    sw, sh = img.size
    scale = max(tw / sw, th / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    img = img.crop((left, top, left + tw, top + th))
    base = Image.new("RGB", size, BG)
    base.paste(img, mask=img.split()[-1])
    return base


def fit(img: Image.Image, size: tuple[int, int]) -> Image.Image:
    img = img.convert("RGBA")
    tw, th = size
    sw, sh = img.size
    scale = min(tw / sw, th / sh)
    nw, nh = max(1, int(sw * scale)), max(1, int(sh * scale))
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    base = Image.new("RGB", size, BG)
    base.paste(img, ((tw - nw) // 2, (th - nh) // 2), img.split()[-1])
    return base


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    src_dir = OUT / "sources"
    src_dir.mkdir(exist_ok=True)

    for name, (src, size, mode) in SOURCES.items():
        if not src.exists():
            raise SystemExit(f"Missing source: {src}")
        raw = Image.open(src)
        raw.save(src_dir / src.name)
        out = fit(raw, size) if mode == "fit" else cover(raw, size)
        dest = OUT / name
        out.save(dest, format="PNG")
        check = Image.open(dest)
        assert check.size == size, (name, check.size)
        assert check.mode == "RGB", (name, check.mode)
        print(f"OK {name} {check.size} {check.mode}")


if __name__ == "__main__":
    main()

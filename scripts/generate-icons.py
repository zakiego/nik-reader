"""Generate the nik-reader icon set from the navbar logo mark.

The mark is the one rendered in components/Navbar.tsx: a rounded square filled
with the primary gradient (#0E1111 -> #27272A, to-br) holding a white heroicons
IdentificationIcon (24 solid).

The 16px .ico layer does NOT downscale the full glyph — at that size the head,
shoulders and three detail lines collapse into a grey smudge. It gets a
pixel-snapped simplified mark instead (photo box + two data lines), which is
what actually reads in a browser tab. 32px and up use the real glyph.
"""

import pathlib
import subprocess

OUT = pathlib.Path(__file__).resolve().parent.parent / "public"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# heroicons/react 24/solid IdentificationIcon, viewBox 0 0 24 24
GLYPH = (
    "M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 "
    "2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 "
    "7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 "
    "1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 "
    "01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z"
)

PRIMARY = "#0E1111"        # --color-primary
PRIMARY_HOVER = "#27272A"  # --color-primary-hover (zinc-800)

GRADIENT = (
    '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
    f'<stop offset="0" stop-color="{PRIMARY}"/>'
    f'<stop offset="1" stop-color="{PRIMARY_HOVER}"/>'
    "</linearGradient></defs>"
)


def full_mark(size: int, radius_ratio: float, glyph_ratio: float) -> str:
    """The real heroicons glyph on the gradient plate. Legible from 32px up."""
    r = size * radius_ratio
    g = size * glyph_ratio
    off = (size - g) / 2
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
        f'viewBox="0 0 {size} {size}">{GRADIENT}'
        f'<rect width="{size}" height="{size}" rx="{r}" ry="{r}" fill="url(#bg)"/>'
        f'<g transform="translate({off} {off}) scale({g / 24})">'
        f'<path fill="#FFFFFF" fill-rule="evenodd" clip-rule="evenodd" d="{GLYPH}"/>'
        "</g></svg>"
    )


def small_mark(size: int) -> str:
    """Simplified mark on a 16-unit grid so edges land on pixel boundaries.

    The person becomes a single photo dot and the three detail lines become
    two — the fewest shapes that still read as an ID card at 16px.
    """
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
        f'viewBox="0 0 16 16">{GRADIENT}'
        '<rect width="16" height="16" rx="3.2" ry="3.2" fill="url(#bg)"/>'
        '<rect x="2.4" y="4" width="11.2" height="8" rx="1.5" ry="1.5" fill="#FFFFFF"/>'
        f'<circle cx="5.9" cy="8" r="1.85" fill="{PRIMARY}"/>'
        f'<rect x="9" y="6.6" width="3.7" height="1.2" rx="0.6" fill="{PRIMARY}"/>'
        f'<rect x="9" y="9.2" width="3.7" height="1.2" rx="0.6" fill="{PRIMARY}"/>'
        "</svg>"
    )


def render(svg_text: str, png_path: pathlib.Path, size: int) -> None:
    """Rasterize with headless Chrome — the same engine that renders the site.
    ImageMagick's built-in SVG renderer mangles these paths."""
    src = png_path.with_suffix(".src.svg")
    src.write_text(svg_text)
    subprocess.run(
        [CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
         "--default-background-color=00000000",
         f"--screenshot={png_path}", f"--window-size={size},{size}",
         "--force-device-scale-factor=1", src.as_uri()],
        check=True, capture_output=True,
    )
    src.unlink()


# favicon.svg — scalable, matches the navbar radius (rounded-xl = 12/40 = 0.30)
favicon_svg = full_mark(512, radius_ratio=0.30, glyph_ratio=0.60)
(OUT / "favicon.svg").write_text(favicon_svg)

# .ico layers, each drawn at its target size rather than downscaled.
# The intermediate layer-*.png files are scratch; they are removed below.
render(small_mark(16), OUT / "layer-16.png", 16)
render(full_mark(32, radius_ratio=0.22, glyph_ratio=0.66), OUT / "layer-32.png", 32)
render(full_mark(48, radius_ratio=0.24, glyph_ratio=0.64), OUT / "layer-48.png", 48)

# apple-touch-icon — square and opaque, iOS applies its own rounding
render(full_mark(180, radius_ratio=0.0, glyph_ratio=0.54), OUT / "apple-touch-icon.png", 180)

# assemble the multi-size .ico (ImageMagick keeps each layer as given;
# Pillow's ICO writer would downscale one source for every size)
subprocess.run(
    ["magick", str(OUT / "layer-16.png"), str(OUT / "layer-32.png"),
     str(OUT / "layer-48.png"), str(OUT / "favicon.ico")],
    check=True, cwd=OUT,
)

# the per-size layers only exist to feed the .ico
for layer in (16, 32, 48):
    (OUT / f"layer-{layer}.png").unlink(missing_ok=True)

print("built: favicon.ico, favicon.svg, apple-touch-icon.png")

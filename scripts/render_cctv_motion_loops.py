#!/usr/bin/env python3
from __future__ import annotations

import math
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
GRAPHICS_DIR = ROOT / "public" / "graphics" / "cctv-motion"
ANIMATIONS_DIR = ROOT / "public" / "animations"
BASE_IMAGE = GRAPHICS_DIR / "cctv-scene-base.png"
WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION = 6
FRAMES = FPS * DURATION


def fit_cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    scale = max(target_w / image.width, target_h / image.height)
    resized = image.resize(
        (math.ceil(image.width * scale), math.ceil(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def rounded_rectangle_layer(
    xy: tuple[int, int, int, int],
    radius: int,
    fill: tuple[int, int, int, int],
    outline: tuple[int, int, int, int] | None = None,
    width: int = 1,
) -> Image.Image:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)
    return layer


def make_scan_beam() -> Image.Image:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    polygon = [(260, 190), (1060, 255), (1130, 650), (235, 590)]
    draw.polygon(polygon, fill=(45, 114, 210, 42))
    draw.line([polygon[0], polygon[1]], fill=(80, 150, 255, 86), width=3)
    draw.line([polygon[3], polygon[2]], fill=(80, 150, 255, 58), width=2)
    for y in range(255, 635, 34):
        draw.line([(390, y), (1085, y + 26)], fill=(120, 180, 255, 28), width=1)
    return layer.filter(ImageFilter.GaussianBlur(0.35))


def make_sweep() -> Image.Image:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for i in range(90):
        alpha = max(0, 120 - abs(i - 45) * 3)
        draw.line([(i, 150), (i + 48, 650)], fill=(80, 165, 255, alpha), width=1)
    return layer.filter(ImageFilter.GaussianBlur(7))


def make_lens_glow() -> Image.Image:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = 342, 265
    for r in range(130, 0, -3):
        alpha = int(42 * (1 - r / 130) ** 1.3)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(70, 145, 255, alpha))
    return layer.filter(ImageFilter.GaussianBlur(10))


def make_patch() -> Image.Image:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    box = (756, 365, 820, 429)
    draw.rounded_rectangle(box, radius=5, fill=(205, 66, 70, 205), outline=(255, 130, 135, 230), width=3)
    for offset in range(-64, 80, 12):
        draw.line([(box[0] + offset, box[1]), (box[0] + offset + 64, box[3])], fill=(255, 255, 255, 95), width=2)
        draw.line([(box[0] + offset + 64, box[1]), (box[0] + offset, box[3])], fill=(20, 24, 30, 90), width=2)
    return layer


def make_person_mask() -> Image.Image:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse((742, 247, 808, 315), fill=(12, 16, 20, 72))
    draw.rounded_rectangle((710, 318, 845, 548), radius=28, fill=(12, 16, 20, 72))
    draw.polygon([(725, 548), (765, 548), (758, 650), (716, 650)], fill=(12, 16, 20, 72))
    draw.polygon([(790, 548), (832, 548), (850, 650), (806, 650)], fill=(12, 16, 20, 72))
    return layer.filter(ImageFilter.GaussianBlur(5))


def make_noise_texture() -> Image.Image:
    texture = Image.effect_noise((WIDTH, HEIGHT), 18).convert("L")
    alpha = ImageEnhance.Contrast(texture).enhance(0.8)
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (255, 255, 255, 0))
    layer.putalpha(alpha.point(lambda p: int(p * 0.05)))
    return layer


def make_vignette() -> Image.Image:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for i in range(220):
        alpha = int((i / 220) ** 2.2 * 135)
        draw.rectangle((i, i, WIDTH - i, HEIGHT - i), outline=(0, 0, 0, max(0, 135 - alpha)), width=1)
    return layer.filter(ImageFilter.GaussianBlur(22))


def draw_detection_overlay(frame: Image.Image, kind: str, t: float) -> None:
    draw = ImageDraw.Draw(frame)
    jitter_x = int(math.sin(t * math.tau * 1.4) * (7 if kind == "altering" else 3))
    jitter_y = int(math.cos(t * math.tau * 1.2) * (5 if kind == "altering" else 2))
    bbox = (674 + jitter_x, 225 + jitter_y, 905 + jitter_x, 642 + jitter_y)

    if kind != "hiding":
        color = (15, 153, 96, 235) if kind != "altering" else (255, 178, 102, 235)
        x1, y1, x2, y2 = bbox
        seg = 54
        for a, b in [
            ((x1, y1), (x1 + seg, y1)),
            ((x1, y1), (x1, y1 + seg)),
            ((x2, y1), (x2 - seg, y1)),
            ((x2, y1), (x2, y1 + seg)),
            ((x1, y2), (x1 + seg, y2)),
            ((x1, y2), (x1, y2 - seg)),
            ((x2, y2), (x2 - seg, y2)),
            ((x2, y2), (x2, y2 - seg)),
        ]:
            draw.line([a, b], fill=color, width=5)
        draw.rectangle(bbox, outline=(color[0], color[1], color[2], 84), width=2)

    if kind == "creating":
        pulse = 0.45 + 0.55 * max(0, math.sin(t * math.tau * 1.15))
        ghost_color = (205, 66, 70, int(235 * pulse))
        g = (955, 245, 1110, 560)
        draw.rectangle(g, outline=ghost_color, width=4)
        draw.rectangle((955, 210, 1095, 242), fill=(205, 66, 70, int(210 * pulse)))

    if kind == "hiding":
        alpha = 190 + int(45 * math.sin(t * math.tau * 2.2))
        draw.rounded_rectangle((655, 338, 900, 402), radius=7, fill=(205, 66, 70, alpha))


def save_alpha_assets() -> None:
    make_scan_beam().save(GRAPHICS_DIR / "scan-beam.png")
    make_sweep().save(GRAPHICS_DIR / "scan-sweep.png")
    make_lens_glow().save(GRAPHICS_DIR / "lens-glow.png")
    make_patch().save(GRAPHICS_DIR / "adversarial-patch.png")
    make_person_mask().save(GRAPHICS_DIR / "person-hiding-mask.png")


def render_loop(kind: str) -> None:
    base = fit_cover(Image.open(BASE_IMAGE).convert("RGB"), (WIDTH, HEIGHT))
    base = ImageEnhance.Color(base).enhance(1.08)
    base = ImageEnhance.Contrast(base).enhance(1.06)

    scan_beam = make_scan_beam()
    sweep = make_sweep()
    lens_glow = make_lens_glow()
    patch = make_patch()
    person_mask = make_person_mask()
    noise = make_noise_texture()
    vignette = make_vignette()

    with tempfile.TemporaryDirectory(prefix=f"cctv-{kind}-") as tmp:
        frame_dir = Path(tmp)
        for i in range(FRAMES):
            t = i / FRAMES
            phase = math.sin(t * math.tau)
            zoom = 1.012 + 0.006 * math.sin(t * math.tau)
            crop_w = int(WIDTH / zoom)
            crop_h = int(HEIGHT / zoom)
            left = (WIDTH - crop_w) // 2 + int(phase * 3)
            top = (HEIGHT - crop_h) // 2 + int(math.cos(t * math.tau) * 2)
            frame = base.crop((left, top, left + crop_w, top + crop_h)).resize((WIDTH, HEIGHT), Image.Resampling.BICUBIC).convert("RGBA")

            frame.alpha_composite(ImageChops.offset(noise, int(t * 120), int(t * 45)))
            frame.alpha_composite(ImageEnhance.Brightness(lens_glow).enhance(0.82 + 0.34 * max(0, phase)))
            frame.alpha_composite(scan_beam)
            frame.alpha_composite(ImageChops.offset(sweep, int(t * (WIDTH + 220)) - 160, 0))

            if kind in {"hiding", "altering", "creating"}:
                frame.alpha_composite(ImageEnhance.Brightness(patch).enhance(0.72 + 0.5 * max(0, math.sin(t * math.tau * 5))))
            if kind == "hiding":
                frame.alpha_composite(ImageEnhance.Brightness(person_mask).enhance(0.55 + 0.25 * max(0, phase)))
            if kind == "altering":
                glitch = frame.crop((650, 210, 930, 640))
                glitch = ImageChops.offset(glitch, int(math.sin(t * math.tau * 7) * 12), 0)
                frame.alpha_composite(glitch, (650, 210))

            draw_detection_overlay(frame, kind, t)
            frame.alpha_composite(vignette)
            frame.convert("RGB").save(frame_dir / f"frame_{i:04d}.png", quality=95)

        mp4 = ANIMATIONS_DIR / f"cctv-detection-{kind}.mp4"
        webm = ANIMATIONS_DIR / f"cctv-detection-{kind}.webm"
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-framerate",
                str(FPS),
                "-i",
                str(frame_dir / "frame_%04d.png"),
                "-an",
                "-c:v",
                "libx264",
                "-preset",
                "medium",
                "-crf",
                "23",
                "-pix_fmt",
                "yuv420p",
                "-movflags",
                "+faststart",
                str(mp4),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(mp4),
                "-an",
                "-c:v",
                "libvpx-vp9",
                "-b:v",
                "0",
                "-crf",
                "34",
                str(webm),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


def main() -> None:
    if not BASE_IMAGE.exists():
        raise SystemExit(f"Missing base image: {BASE_IMAGE}")
    if not shutil.which("ffmpeg"):
        raise SystemExit("ffmpeg is required")
    GRAPHICS_DIR.mkdir(parents=True, exist_ok=True)
    ANIMATIONS_DIR.mkdir(parents=True, exist_ok=True)
    save_alpha_assets()
    for kind in ("idle", "hiding", "altering", "creating"):
        render_loop(kind)


if __name__ == "__main__":
    main()

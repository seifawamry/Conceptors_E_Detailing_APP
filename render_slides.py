#!/usr/bin/env python3
"""
Convert PDF slides to WebP images at 2x resolution (1920x1080).
Uses PyMuPDF (fitz) for PDF rendering and Pillow for WebP encoding.
"""

import argparse
import sys
from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image


def render_pdf_to_webp(
    pdf_path: Path,
    output_dir: Path,
    scale: float = 2.0,
    quality: int = 85,
) -> None:
    """Render each page of a PDF document as a WebP image."""
    if not pdf_path.exists():
        raise FileNotFoundError(f"Input PDF not found: {pdf_path}")

    output_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    print(f"Loaded '{pdf_path}' with {total_pages} page(s).")
    print(f"Rendering at {scale}x resolution with WebP quality={quality}...")

    matrix = fitz.Matrix(scale, scale)

    for page_index in range(total_pages):
        page_num = page_index + 1
        page = doc[page_index]
        pix = page.get_pixmap(matrix=matrix, alpha=False)

        # Convert PyMuPDF pixmap to PIL Image
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

        # Save directly as WebP
        output_path = output_dir / f"slide-{page_num}.webp"
        img.save(output_path, format="WEBP", quality=quality)

        print(
            f"  [{page_num}/{total_pages}] Saved {output_path.name} "
            f"({pix.width}x{pix.height}, {output_path.stat().st_size / 1024:.1f} KB)"
        )

    doc.close()
    print(f"Successfully rendered all {total_pages} slide(s) to '{output_dir}'.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Render PDF presentation slides to WebP images at 2x resolution."
    )
    parser.add_argument(
        "--input",
        "-i",
        type=Path,
        default=Path("raw_slides/presentation.pdf"),
        help="Path to input PDF file (default: raw_slides/presentation.pdf)",
    )
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        default=Path("public/slides"),
        help="Path to output slides directory (default: public/slides)",
    )
    parser.add_argument(
        "--scale",
        "-s",
        type=float,
        default=2.0,
        help="Rendering scale multiplier (default: 2.0 -> 1920x1080 for 960x540 pages)",
    )
    parser.add_argument(
        "--quality",
        "-q",
        type=int,
        default=85,
        help="WebP compression quality 1-100 (default: 85)",
    )

    args = parser.parse_args()

    try:
        render_pdf_to_webp(
            pdf_path=args.input,
            output_dir=args.output,
            scale=args.scale,
            quality=args.quality,
        )
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

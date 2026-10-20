$code = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

public class FullBleedIconGenerator {
    public static Bitmap GenerateMaster(string srcPath, float zoomFactor) {
        using (Bitmap src = new Bitmap(srcPath)) {
            int w = src.Width;
            int h = src.Height;

            int minY = 115;
            int maxY = 955;
            int minX = 104;
            int maxX = 920;

            Bitmap extended = new Bitmap(w, h, PixelFormat.Format32bppArgb);
            using (Graphics g = Graphics.FromImage(extended)) {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.SmoothingMode = SmoothingMode.HighQuality;

                // Rich emerald green gradient on top / sides
                using (var brush = new LinearGradientBrush(
                    new Point(0, 0), new Point(w, 0),
                    Color.FromArgb(255, 14, 145, 70),
                    Color.FromArgb(255, 2, 60, 26))) {
                    g.FillRectangle(brush, 0, 0, w, 760);
                }

                // Crisp white banner on bottom
                using (var whiteBrush = new SolidBrush(Color.FromArgb(255, 240, 243, 242))) {
                    g.FillRectangle(whiteBrush, 0, 740, w, h - 740);
                }
            }

            BitmapData srcData = src.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            BitmapData extData = extended.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);

            int bytes = Math.Abs(srcData.Stride) * h;
            byte[] rgbSrc = new byte[bytes];
            byte[] rgbExt = new byte[bytes];

            Marshal.Copy(srcData.Scan0, rgbSrc, 0, bytes);
            Marshal.Copy(extData.Scan0, rgbExt, 0, bytes);

            for (int y = 0; y < h; y++) {
                for (int x = 0; x < w; x++) {
                    int idx = y * srcData.Stride + x * 4;
                    byte b = rgbSrc[idx];
                    byte g = rgbSrc[idx + 1];
                    byte r = rgbSrc[idx + 2];
                    int brightness = r + g + b;

                    // Blend threshold to eliminate any anti-aliased dark fringe:
                    // Pixels with brightness > 65 are solid artwork
                    if (brightness > 65) {
                        rgbExt[idx] = b;
                        rgbExt[idx + 1] = g;
                        rgbExt[idx + 2] = r;
                        rgbExt[idx + 3] = 255;
                    } else {
                        // Pixel is outside the squircle: keep the extended background
                        rgbExt[idx + 3] = 255;
                    }
                }
            }

            Marshal.Copy(rgbExt, 0, extData.Scan0, bytes);

            src.UnlockBits(srcData);
            extended.UnlockBits(extData);

            // Scale centered on the content
            Bitmap master = new Bitmap(1024, 1024, PixelFormat.Format32bppArgb);
            using (Graphics g = Graphics.FromImage(master)) {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.SmoothingMode = SmoothingMode.HighQuality;

                float targetW = w / zoomFactor;
                float targetH = h / zoomFactor;
                float srcCenterX = (minX + maxX) / 2.0f;
                float srcCenterY = (minY + maxY) / 2.0f;

                float srcX = srcCenterX - targetW / 2.0f;
                float srcY = srcCenterY - targetH / 2.0f;

                g.DrawImage(extended, 
                    new Rectangle(0, 0, 1024, 1024), 
                    srcX, srcY, targetW, targetH, 
                    GraphicsUnit.Pixel);
            }

            extended.Dispose();
            return master;
        }
    }

    public static void ResizeAndSavePng(Bitmap master, int size, string outPath) {
        using (Bitmap resized = new Bitmap(size, size, PixelFormat.Format32bppArgb)) {
            using (Graphics g = Graphics.FromImage(resized)) {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.DrawImage(master, 0, 0, size, size);
            }
            resized.Save(outPath, ImageFormat.Png);
            Console.WriteLine("Saved PNG (" + size + "x" + size + "): " + outPath);
        }
    }

    public static void SaveIco(Bitmap master, string outPath) {
        using (Bitmap iconBmp = new Bitmap(32, 32, PixelFormat.Format32bppArgb)) {
            using (Graphics g = Graphics.FromImage(iconBmp)) {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.DrawImage(master, 0, 0, 32, 32);
            }
            IntPtr hIcon = iconBmp.GetHicon();
            using (Icon icon = Icon.FromHandle(hIcon)) {
                using (FileStream fs = new FileStream(outPath, FileMode.Create)) {
                    icon.Save(fs);
                }
            }
            Console.WriteLine("Saved ICO: " + outPath);
        }
    }

    public static void SaveJpg(Bitmap master, string outPath, long quality) {
        ImageCodecInfo jpgEncoder = null;
        ImageCodecInfo[] codecs = ImageCodecInfo.GetImageEncoders();
        foreach (ImageCodecInfo codec in codecs) {
            if (codec.FormatID == ImageFormat.Jpeg.Guid) {
                jpgEncoder = codec;
                break;
            }
        }
        if (jpgEncoder != null) {
            EncoderParameters myEncoderParameters = new EncoderParameters(1);
            myEncoderParameters.Param[0] = new EncoderParameter(Encoder.Quality, quality);
            master.Save(outPath, jpgEncoder, myEncoderParameters);
            Console.WriteLine("Saved JPG: " + outPath);
        }
    }
}
"@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

$srcImgPath = "C:\Users\seif.elawamry\.gemini\antigravity\brain\8ba88717-1c1b-4e1c-9ac4-0738575322c2\.user_uploaded\media_1792501577997_4ad93027.jpg"
$publicDir   = "C:\Users\seif.elawamry\.gemini\antigravity\scratch\public"

# Zoom factor 1.12 fills 94% of dimensions with full bleed background extending edge-to-edge
$master = [FullBleedIconGenerator]::GenerateMaster($srcImgPath, 1.12)

# Save Master Icons
$master.Save("$publicDir\app-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
[FullBleedIconGenerator]::SaveJpg($master, "$publicDir\app-icon.jpg", 95)

# Apple Touch Icons (iOS iPad & iPhone)
[FullBleedIconGenerator]::ResizeAndSavePng($master, 180, "$publicDir\apple-touch-icon.png")
[FullBleedIconGenerator]::ResizeAndSavePng($master, 180, "$publicDir\apple-touch-icon-180x180.png")
[FullBleedIconGenerator]::ResizeAndSavePng($master, 167, "$publicDir\apple-touch-icon-167x167.png")
[FullBleedIconGenerator]::ResizeAndSavePng($master, 152, "$publicDir\apple-touch-icon-152x152.png")

# PWA Icons (Android & Windows PWA)
[FullBleedIconGenerator]::ResizeAndSavePng($master, 512, "$publicDir\pwa-512x512.png")
[FullBleedIconGenerator]::ResizeAndSavePng($master, 512, "$publicDir\pwa-maskable-512x512.png")
[FullBleedIconGenerator]::ResizeAndSavePng($master, 192, "$publicDir\pwa-192x192.png")

# Browser Favicons
[FullBleedIconGenerator]::ResizeAndSavePng($master, 64, "$publicDir\favicon-64x64.png")
[FullBleedIconGenerator]::ResizeAndSavePng($master, 32, "$publicDir\favicon.png")
[FullBleedIconGenerator]::SaveIco($master, "$publicDir\favicon.ico")

$master.Dispose()

Write-Host "All icons generated successfully!"

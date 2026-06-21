Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$output = Join-Path $PSScriptRoot '..\public\og-cover.png'
$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([System.Drawing.Color]::FromArgb(5, 5, 6))

function Add-RadialGlow {
  param($Graphics, $X, $Y, $Size, $Color, $Opacity)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddEllipse($X, $Y, $Size, $Size)
  $brush = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
  $brush.CenterPoint = New-Object System.Drawing.PointF(($X + $Size * 0.5), ($Y + $Size * 0.5))
  $brush.CenterColor = [System.Drawing.Color]::FromArgb($Opacity, $Color)
  $brush.SurroundColors = [System.Drawing.Color[]]@([System.Drawing.Color]::FromArgb(0, $Color))
  $Graphics.FillEllipse($brush, $X, $Y, $Size, $Size)
  $brush.Dispose()
  $path.Dispose()
}

$blue = [System.Drawing.Color]::FromArgb(41, 151, 255)
$white = [System.Drawing.Color]::FromArgb(245, 245, 247)
$muted = [System.Drawing.Color]::FromArgb(161, 161, 166)
$faint = [System.Drawing.Color]::FromArgb(134, 134, 139)

Add-RadialGlow $graphics -260 260 850 $blue 82
Add-RadialGlow $graphics 680 -270 780 ([System.Drawing.Color]::FromArgb(213, 139, 66)) 58

$ringPenOuter = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(28, $blue), 1)
$ringPenInner = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(34, $blue), 1)
$graphics.DrawEllipse($ringPenOuter, 870, -48, 476, 476)
$graphics.DrawEllipse($ringPenInner, 932, 14, 352, 352)

$fontBrand = New-Object System.Drawing.Font('Segoe UI', 30, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fontEyebrow = New-Object System.Drawing.Font('Segoe UI', 14, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fontTitle = New-Object System.Drawing.Font('Segoe UI', 72, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fontBody = New-Object System.Drawing.Font('Segoe UI', 23, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fontDomain = New-Object System.Drawing.Font('Segoe UI', 18, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fontLabel = New-Object System.Drawing.Font('Segoe UI', 13, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$whiteBrush = New-Object System.Drawing.SolidBrush($white)
$blueBrush = New-Object System.Drawing.SolidBrush($blue)
$mutedBrush = New-Object System.Drawing.SolidBrush($muted)
$faintBrush = New-Object System.Drawing.SolidBrush($faint)

$graphics.DrawString('MR', $fontBrand, $whiteBrush, 76, 52)
$brandWidth = $graphics.MeasureString('MR', $fontBrand).Width
$graphics.DrawString('.', $fontBrand, $blueBrush, (76 + $brandWidth - 6), 52)
$graphics.DrawString('SOFTWARE DEVELOPER  /  MADRID', $fontEyebrow, $faintBrush, 76, 133)
$name = 'Mikael Rodr' + [char]0x00ED + 'guez'
$graphics.DrawString($name, $fontTitle, $whiteBrush, 70, 194)
$graphics.DrawString('Software', $fontTitle, $whiteBrush, 70, 278)
$softwareWidth = $graphics.MeasureString('Software', $fontTitle).Width
$graphics.DrawString('Developer.', $fontTitle, $blueBrush, (70 + $softwareWidth - 7), 278)
$tagline = 'Construyo software que convierte lo complejo en ' + [char]0x00FA + 'til.'
$graphics.DrawString($tagline, $fontBody, $mutedBrush, 76, 409)

$lineBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  (New-Object System.Drawing.Point(76, 496)),
  (New-Object System.Drawing.Point(416, 496)),
  $blue,
  [System.Drawing.Color]::FromArgb(0, $blue)
)
$graphics.FillRectangle($lineBrush, 76, 495, 340, 2)
$graphics.DrawString('mikaelrodriguez.com', $fontDomain, $whiteBrush, 76, 531)
$graphics.DrawString('PORTFOLIO', $fontLabel, $faintBrush, 1027, 539)

$bitmap.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)

$lineBrush.Dispose()
$ringPenOuter.Dispose()
$ringPenInner.Dispose()
$whiteBrush.Dispose()
$blueBrush.Dispose()
$mutedBrush.Dispose()
$faintBrush.Dispose()
$fontBrand.Dispose()
$fontEyebrow.Dispose()
$fontTitle.Dispose()
$fontBody.Dispose()
$fontDomain.Dispose()
$fontLabel.Dispose()
$graphics.Dispose()
$bitmap.Dispose()

Write-Output $output

/**
 * Detects if we're on desktop Chrome/Firefox emulating mobile via DevTools.
 * WebGL reports the host GPU; DevTools does not override it.
 * Returns true if desktop/emulation detected (use Canvas), false if real mobile (use SVG).
 *
 * Real mobile GPUs are allowlisted first. Desktop is detected only with **positive**
 * desktop renderer signals. Unknown GPUs default to **not** emulation so phones with
 * unlisted chips still get SVG (Canvas wall tint often fails on real mobile).
 */
const MOBILE_GPU_PATTERNS = [
  'qualcomm',
  'adreno', // Qualcomm mobile
  'mali', // ARM mobile
  'powervr', // Imagination mobile
  'videocore', // Broadcom (Raspberry Pi, some mobile)
];

/** Apple Silicon Mac reports "Apple M1/M2/M3" etc.; iPhone reports "Apple GPU" only. */
const MAC_APPLE_SILICON_PATTERNS = ['apple m1', 'apple m2', 'apple m3', 'apple m4'];

function isKnownMobileGpu(combined: string): boolean {
  if (MOBILE_GPU_PATTERNS.some((p) => combined.includes(p))) return true;
  // iPhone: "Apple GPU" without M1/M2/M3/M4
  if (combined.includes('apple gpu') && !MAC_APPLE_SILICON_PATTERNS.some((p) => combined.includes(p))) {
    return true;
  }
  return false;
}

/** Strong signals the WebGL stack is a desktop / VM host (DevTools mobile UA still gets Canvas). */
function isLikelyDesktopWebGLRenderer(combined: string): boolean {
  return (
    /\bnvidia\b|\bgeforce\b|\brtx\b|\bgtx\b|\bquadro\b|\btitan\b|\bradeon\b|\brx\s?\d{3,4}\b|\brdna\b|\bintel\b|\buhd graphics\b|\bhd graphics\b|\biris\b|\bllvmpipe\b|\bswiftshader\b|\bmicrosoft basic render\b|\bvmware\b|\bvirtualbox\b/i.test(
      combined
    )
  );
}

export function detectDesktopEmulation(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;
    const ext = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (!ext) return false;
    const vendor = (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_VENDOR_WEBGL) || '';
    const renderer = (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_RENDERER_WEBGL) || '';
    const combined = `${vendor} ${renderer}`.toLowerCase();
    if (isKnownMobileGpu(combined)) return false;
    if (isLikelyDesktopWebGLRenderer(combined)) return true;
    // Unknown GPU: do not force Canvas — trust middleware mobile/tablet cookie (SVG).
    return false;
  } catch {
    return false;
  }
}

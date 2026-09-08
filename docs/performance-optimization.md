# Performance Optimization Guide

## Overview

This document outlines the performance optimization work done to reduce media loading times on FC Filmwerks.

## Three-Level Optimization Strategy

### Level 1: Image Optimization (✅ Implemented)

**Status**: Complete

#### What was done:

1. **Next.js Image Configuration** (`next.config.ts`)
   - Automatic format conversion to modern codecs (AVIF, WebP)
   - 30-day cache TTL for optimized images
   - Efficient sizing and responsive image handling

2. **Component-Level Lazy Loading**
   - All Image components use `loading="lazy"` where not above-the-fold
   - Above-the-fold images (hero sections) use `priority` for eager loading
   - Proper `sizes` attribute on responsive images for correct srcset generation

3. **Impact**
   - Reduced image payload without code changes (browser handles format negotiation)
   - Prevents off-screen images from loading until visible
   - Typical reduction: 20-40% smaller downloads via modern formats

**Current Image Sizes** (before optimization):

- audio-solutions.jpg: 1.9MB
- music-label.jpg: 1.3MB
- podcast-production.jpg: 1.1MB
- photography.jpg: 1.1MB
- Gautham-FCF.jpg: 776KB
- Mini-FCF.jpg: 647KB

These are automatically optimized by Next.js Image component on request.

---

### Level 2: Video Format Alternatives & Lazy Loading (✅ Implemented)

**Status**: Complete

#### What was done:

1. **BackgroundVideo Component Updates** (`src/components/ui/BackgroundVideo.tsx`)
   - Added support for multiple video formats via `sources` prop
   - Added lazy loading via Intersection Observer with `lazy` prop
   - Dynamic preload strategy: `preload="none"` until visible, then `preload="auto"`
   - Proper cleanup on unmount

2. **Implementation Details**

   ```tsx
   // Before: Single MP4 only, always preloads
   <BackgroundVideo src="/videos/banner-video.mp4" />

   // After: Multiple formats, lazy loading for below-fold videos
   <BackgroundVideo
     src="/videos/banner-video.mp4"
     sources={[
       { src: '/videos/banner-video.webm', type: 'video/webm' }
     ]}
     lazy={true}  // Only for below-fold sections
   />
   ```

3. **Applied To**:
   - `CtaSection.tsx`: Enabled lazy loading (video loads only when section becomes visible)
   - `AboutMasthead.tsx`: Enabled lazy loading (not on homepage)
   - `Hero.tsx`: No lazy loading (above-the-fold, critical content)
   - `ContactHero.tsx`: No lazy loading (hero of contact page)

4. **Benefits**
   - Lazy-loaded CTA video (12MB) delays loading until user scrolls to it
   - Saves ~12MB on initial page load for users who don't scroll to CTA
   - WebM format can be 25-35% smaller than H.264 MP4
   - Graceful fallback for browsers that don't support WebM

**Current Video Sizes**:

| Video            | Size   | Priority | Lazy? |
| ---------------- | ------ | -------- | ----- |
| banner-video.mp4 | 30MB   | Critical | ❌    |
| cta-video-1.mp4  | 12MB   | Medium   | ✅    |
| cta-video-2.mp4  | 11MB   | Medium   | ✅    |
| Portfolio videos | 590MB+ | Low      | ✅    |

---

### Level 3: Video Compression (🔧 Ready to Use)

**Status**: Script provided, ready for execution

#### Files:

- `scripts/compress-videos.sh` - Automated compression script

#### Video Compression Strategy:

**Codec Comparison**:

- **H.264 (Current)**: Standard, broad browser support
  - 30MB banner video
- **H.265/HEVC**: 40-50% smaller, modern browsers
  - Estimated 30MB → 15-18MB
- **VP9/WebM**: 25-35% smaller than H.265, excellent for web
  - Estimated 30MB → 8-12MB

#### How to Use:

1. **Prerequisites**:

   ```bash
   # macOS
   brew install ffmpeg

   # Ubuntu/Debian
   sudo apt-get install ffmpeg
   ```

2. **Run Compression**:

   ```bash
   chmod +x scripts/compress-videos.sh
   ./scripts/compress-videos.sh
   ```

   This will:
   - Back up original videos to `public/videos/backups/`
   - Create H.265 versions (40-50% reduction)
   - Create WebM/VP9 versions (25-35% reduction)
   - Report compression ratios

3. **Verify Results**:

   ```bash
   # Check file sizes
   du -sh public/videos/*.mp4
   du -sh public/videos/*.webm

   # Test in browser before deleting originals
   ```

4. **Deploy Compressed Videos**:
   ```bash
   # After verification, you can replace originals
   # Browsers will use WebM (smaller), fall back to MP4
   ```

#### Expected Results:

**Banner Video (30MB)**:

- H.265 MP4: ~15-18MB (40-50% reduction)
- WebM/VP9: ~5-8MB (75-80% reduction)

**CTA Videos (12MB + 11MB)**:

- Combined reduction: ~15MB → ~5MB

**Portfolio Videos (590MB total)**:

- Compressed: ~200-300MB (60% reduction)

**Total Homepage Impact**:

- Before: ~30MB (banner) + 12MB (CTA-1) = 42MB on initial load
- After WebM: ~5-8MB (banner) + 3-5MB (CTA-1) = ~8-13MB on initial load
- **Savings: 70% reduction in video bandwidth on homepage**

---

## Implementation Checklist

### Already Done ✅

- [x] BackgroundVideo supports multiple video formats
- [x] Lazy loading implemented for below-fold videos
- [x] Image optimization via Next.js (automatic)
- [x] All Image components use loading="lazy" or priority
- [x] Intersection Observer for video visibility tracking
- [x] Compression script created

### Next Steps (For User):

- [ ] Run `./scripts/compress-videos.sh` to generate compressed files
- [ ] Test compressed videos in multiple browsers
- [ ] Verify playback works correctly
- [ ] Update component code to reference WebM sources
- [ ] Delete original large video files once verified
- [ ] Deploy and monitor performance metrics

---

## Performance Monitoring

### Metrics to Track:

1. **Page Load Time**: Monitor with Lighthouse/WebPageTest
2. **First Contentful Paint (FCP)**: Should improve with lazy loading
3. **Cumulative Layout Shift (CLS)**: Ensure poster images match video dimensions
4. **Video Playback**: Test in Chrome, Firefox, Safari, mobile browsers

### Tools:

- Chrome DevTools > Network tab: Monitor video downloads
- Lighthouse: Full performance audit
- WebPageTest: Detailed waterfall analysis
- Google PageSpeed Insights: Real user metrics

---

## Format Support Matrix

| Format     | Chrome | Firefox | Safari | Edge | Size |
| ---------- | ------ | ------- | ------ | ---- | ---- |
| MP4 H.264  | ✅     | ✅      | ✅     | ✅   | 100% |
| H.265/HEVC | ✅     | ❌      | ✅*    | ✅   | 50%  |
| WebM/VP9   | ✅     | ✅      | ❌     | ✅   | 25%  |

*Safari 13+, macOS 10.15+

**Recommendation**: Serve WebM as primary (modern browsers), MP4 as fallback (universal support).

---

## Code Examples

### Using Multiple Formats:

```tsx
// In a component
<BackgroundVideo
  src="/videos/banner-video.mp4"
  sources={[
    { src: '/videos/banner-video.webm', type: 'video/webm' }
  ]}
  poster="/images/banner-poster.jpg"
  lazy={false}  // Above the fold
/>

// For below-fold videos
<BackgroundVideo
  src="/videos/cta-video.mp4"
  sources={[
    { src: '/videos/cta-video.webm', type: 'video/webm' }
  ]}
  lazy={true}  // Lazy load
/>
```

### Image Optimization:

```tsx
// Best practice: Image with lazy loading
<Image
  src="/images/service.jpg"
  alt="Service description"
  width={800}
  height={600}
  loading="lazy"
  sizes="(min-width: 1024px) 50vw, 100vw"
/>

// Above-the-fold: Use priority
<Image
  src="/images/hero.jpg"
  alt="Hero image"
  fill
  priority
  sizes="100vw"
/>
```

---

## File Locations

- **Scripts**: `scripts/compress-videos.sh`
- **Components**:
  - `src/components/ui/BackgroundVideo.tsx`
  - `src/components/sections/CtaSection.tsx`
  - `src/components/sections/about/AboutMasthead.tsx`
- **Config**: `next.config.ts`
- **Backup Videos**: `public/videos/backups/`

---

## References

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web Video Best Practices](https://web.dev/video/)
- [MDN: HTML5 Video Format Support](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#supported_video_formats)
- [HEVC/H.265 Browser Support](https://caniuse.com/hevc)
- [WebM/VP9 Browser Support](https://caniuse.com/webm)

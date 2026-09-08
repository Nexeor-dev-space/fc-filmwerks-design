#!/bin/bash
# Video compression script for FC Filmwerks
# Converts large MP4 videos to highly compressed formats for web delivery
#
# Prerequisites: Install FFmpeg
#   brew install ffmpeg (macOS)
#   apt-get install ffmpeg (Ubuntu)
#
# Usage: ./scripts/compress-videos.sh

set -e

VIDEOS_DIR="public/videos"
BACKUP_DIR="public/videos/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "=== FC Filmwerks Video Compression ==="
echo "This script will compress large video files for web delivery."
echo "Original files will be backed up to: $BACKUP_DIR"
echo ""

compress_video() {
  local input="$1"
  local output="$2"
  local preset="${3:-medium}"  # fast, medium, slow (quality vs speed)

  if [ ! -f "$input" ]; then
    echo "⚠️  File not found: $input"
    return 1
  fi

  local input_size=$(du -sh "$input" | cut -f1)
  echo "Compressing: $input ($input_size)"

  # H.265/HEVC codec: 40-50% smaller than H.264 with same quality
  ffmpeg -i "$input" \
    -c:v libx265 \
    -preset "$preset" \
    -crf 23 \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    "$output" \
    2>&1 | grep -E "frame=|time="

  if [ -f "$output" ]; then
    local output_size=$(du -sh "$output" | cut -f1)
    local original_bytes=$(stat -f%z "$input" 2>/dev/null || stat -c%s "$input")
    local compressed_bytes=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output")
    local reduction=$((100 - (compressed_bytes * 100 / original_bytes)))

    echo "✓ Compressed: $input_size → $output_size ($reduction% reduction)"
    echo ""
  fi
}

# Backup and compress banner video (30MB → ~3-4MB)
if [ -f "$VIDEOS_DIR/banner-video.mp4" ]; then
  cp "$VIDEOS_DIR/banner-video.mp4" "$BACKUP_DIR/banner-video_backup_$TIMESTAMP.mp4"
  compress_video "$VIDEOS_DIR/banner-video.mp4" "$VIDEOS_DIR/banner-video-h265.mp4" "medium"
fi

# Backup and compress CTA videos
for cta_video in "$VIDEOS_DIR"/cta-video-*.mp4; do
  if [ -f "$cta_video" ]; then
    basename=$(basename "$cta_video" .mp4)
    cp "$cta_video" "$BACKUP_DIR/${basename}_backup_$TIMESTAMP.mp4"
    compress_video "$cta_video" "$VIDEOS_DIR/${basename}-h265.mp4" "medium"
  fi
done

# Backup and compress portfolio videos (these are large, use preset "fast" for speed)
for portfolio_video in "$VIDEOS_DIR/portfolio"/*.mp4; do
  if [ -f "$portfolio_video" ]; then
    basename=$(basename "$portfolio_video" .mp4)
    cp "$portfolio_video" "$BACKUP_DIR/${basename}_backup_$TIMESTAMP.mp4"
    compress_video "$portfolio_video" "$VIDEOS_DIR/portfolio/${basename}-h265.mp4" "fast"
  fi
done

# Also create WebM versions for even better compression (25-35% smaller than H.265)
create_webm() {
  local input="$1"
  local output="$2"

  if [ ! -f "$input" ]; then
    echo "⚠️  File not found: $input"
    return 1
  fi

  local input_size=$(du -sh "$input" | cut -f1)
  echo "Creating WebM (VP9): $input ($input_size)"

  ffmpeg -i "$input" \
    -c:v libvpx-vp9 \
    -b:v 0 \
    -crf 30 \
    -c:a libopus \
    -b:a 128k \
    "$output" \
    2>&1 | grep -E "frame=|time="

  if [ -f "$output" ]; then
    local output_size=$(du -sh "$output" | cut -f1)
    echo "✓ WebM created: $input_size → $output_size"
    echo ""
  fi
}

echo ""
echo "=== Creating WebM versions ==="
# Note: WebM creation takes longer; only run for key videos
if [ -f "$VIDEOS_DIR/banner-video.mp4" ]; then
  create_webm "$VIDEOS_DIR/banner-video.mp4" "$VIDEOS_DIR/banner-video.webm"
fi

if [ -f "$VIDEOS_DIR/cta-video-1.mp4" ]; then
  create_webm "$VIDEOS_DIR/cta-video-1.mp4" "$VIDEOS_DIR/cta-video-1.webm"
fi

echo ""
echo "=== Compression Complete ==="
echo "Backups saved to: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Test videos in browser to ensure playback works"
echo "2. Once verified, delete original large files: rm $VIDEOS_DIR/*.mp4"
echo "3. Rename compressed files: mv $VIDEOS_DIR/*-h265.mp4 $VIDEOS_DIR/*.mp4"
echo "4. Update component code to use new file sizes"
echo ""
echo "To use WebM with fallback MP4:"
echo "  <BackgroundVideo"
echo "    src=\"/videos/banner-video.mp4\""
echo "    sources={["
echo "      { src: '/videos/banner-video.webm', type: 'video/webm' }"
echo "    ]}"
echo "  />"

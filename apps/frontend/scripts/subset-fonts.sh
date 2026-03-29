#!/usr/bin/env bash
set -euo pipefail

FONT_DIR="src/fonts"
UVX_FROM="fonttools[woff,pathops]"

COMMON_UNICODES="U+0000-00FF,U+0100-024F,U+0300-036F,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-21FF,U+2212,U+FEFF,U+FFFD"
MONO_UNICODES="${COMMON_UNICODES},U+2200-22FF,U+2300-23FF,U+2500-257F,U+2580-259F,U+25A0-25FF,U+2700-27BF,U+E000-F8FF,U+FE00-FE0F,U+FB00-FB06"

INTER_FEATURES="kern,liga,calt,ccmp,locl,mark,mkmk,tnum,lnum,onum,pnum,frac,sups,subs,case,cpsp,zero,ordn,ss01,ss02,cv01,cv02,cv03,cv04,cv05"
MONO_FEATURES="kern,liga,calt,ccmp,locl,mark,mkmk,ss01,ss02,ss03,ss04,ss05,ss06,ss07,ss08,dlig,cv01,cv02"

echo "=== Before ==="
wc -c "$FONT_DIR/Inter.subset.var.woff2"
wc -c "$FONT_DIR/Monaspace-Neon.subset.var.woff2"
echo ""

# --- Inter: restrict wght ---
uvx --from "$UVX_FROM" fonttools varLib.instancer \
  "$FONT_DIR/Inter.var.woff2" \
  wght=400:700 \
  -o /tmp/inter-trimmed.woff2

uvx --from "$UVX_FROM" pyftsubset /tmp/inter-trimmed.woff2 \
  --output-file="$FONT_DIR/Inter.subset.var.woff2" \
  --flavor=woff2 \
  --unicodes="$COMMON_UNICODES" \
  --layout-features="$INTER_FEATURES" \
  --no-hinting \
  --desubroutinize

# --- Monaspace Neon: restrict wght, pin wdth + slnt ---
uvx --from "$UVX_FROM" fonttools varLib.instancer \
  "$FONT_DIR/Monaspace-Neon.var.woff2" \
  wght=400:500 \
  wdth=100 \
  slnt=0 \
  -o /tmp/mono-trimmed.woff2

uvx --from "$UVX_FROM" pyftsubset /tmp/mono-trimmed.woff2 \
  --output-file="$FONT_DIR/Monaspace-Neon.subset.var.woff2" \
  --flavor=woff2 \
  --unicodes="$MONO_UNICODES" \
  --layout-features="$MONO_FEATURES" \
  --no-hinting \
  --desubroutinize

rm -f /tmp/inter-trimmed.woff2 /tmp/mono-trimmed.woff2

echo "=== After ==="
wc -c "$FONT_DIR/Inter.subset.var.woff2"
wc -c "$FONT_DIR/Monaspace-Neon.subset.var.woff2"

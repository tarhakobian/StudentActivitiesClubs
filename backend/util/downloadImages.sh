#!/usr/bin/env bash

mkdir -p ./images/

# Read lines from images.txt and download them
while IFS= read -r line; do
  wget -P ./images/ "$line"
done < images.txt

# Compress images with Squoosh
cd images/ || exit
for f in *; do
  npx @squoosh/cli --mozjpeg '{quality:50}' "$f"
done
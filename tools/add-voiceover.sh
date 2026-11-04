#!/usr/bin/env bash
# Mix a voice-over (and optional music) into the brand film.
# Usage: tools/add-voiceover.sh voice.wav [music.mp3]
#   voice: the read of docs/brand-film-voiceover.md, about 30 s (wav, mp3 or m4a)
#   music: optional bed; it is lowered automatically whenever the voice speaks
set -euo pipefail
VOICE="${1:?Usage: tools/add-voiceover.sh voice.wav [music.mp3]}"; MUSIC="${2:-}"
SRC="public/assets/video/cognexa-brand-reel.mp4"; OUT="public/assets/video/cognexa-brand-reel.vo.mp4"
if [ -n "$MUSIC" ]; then
  ffmpeg -y -loglevel error -i "$SRC" -i "$VOICE" -i "$MUSIC" -filter_complex \
   "[1:a]loudnorm=I=-16:TP=-1.5:LRA=11,apad,asplit=2[vo1][vo2];[2:a]volume=0.5,afade=t=out:st=28:d=2[m];[m][vo1]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[md];[md][vo2]amix=inputs=2:duration=first:normalize=0[a]" \
   -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -t 30 -movflags +faststart "$OUT"
else
  ffmpeg -y -loglevel error -i "$SRC" -i "$VOICE" -filter_complex "[1:a]loudnorm=I=-16:TP=-1.5:LRA=11,apad[a]" \
   -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -t 30 -movflags +faststart "$OUT"
fi
mv "$OUT" "$SRC"
echo "Done: $SRC now has the voice-over. Rebuild with: node src/build.mjs"

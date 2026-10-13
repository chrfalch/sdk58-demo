#!/bin/sh
# folds or unfolds the booted iphone duo simulator.
# usage: bun run duo fold|half|unfold|<angle from 0 to 180>
# it uses serve-sim, which comes with expo-device-hub. xcode 27.1's device hub has the same control.
set -e

if [ -z "$1" ]; then
  echo "usage: bun run duo fold|half|unfold|<angle from 0 to 180>" >&2
  exit 1
fi

cli=node_modules/expo-device-hub/vendor/serve-sim/dist/serve-sim.js
udid=$(xcrun simctl list devices booted | sed -n 's/.*iPhone Duo (\([0-9A-F-]*\)) (Booted).*/\1/p' | sed -n 1p)

if [ -z "$udid" ]; then
  echo "boot the iPhone Duo simulator first (it needs Xcode 27.1)" >&2
  exit 1
fi

# the hinge command talks to a serve-sim helper for the device. this starts one, or reuses it.
node "$cli" --detach --no-preview "$udid" > /dev/null
node "$cli" hinge "$1" -d "$udid"

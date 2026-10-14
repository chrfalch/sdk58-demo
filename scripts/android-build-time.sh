#!/bin/sh
# times a clean android debug build for all four abis, the build the sdk 58 changelog measures.
# usage: bun run android:build-time [--from-source]
# in sdk 58, expo-modules-core ships its c++ libraries prebuilt for android. --from-source compiles
# them instead (the `expo.core.buildFromSource` gradle property), as every build did before, so the
# two times show what the prebuilt libraries save on this machine.
set -e

case "$1" in
  "") from_source=false ;;
  --from-source) from_source=true ;;
  *)
    echo "usage: bun run android:build-time [--from-source]" >&2
    exit 1
    ;;
esac

if [ ! -x android/gradlew ]; then
  echo "create the android folder first: bunx expo prebuild --platform android" >&2
  exit 1
fi

cd android

# clean: the build folders of the app and of every module in it, and their native (.cxx) build
# folders, which `clean` leaves behind. the gradle build cache is off below, so nothing comes back.
./gradlew clean --quiet
find app ../node_modules ../modules -maxdepth 5 -type d -name .cxx -path '*android/.cxx' -prune \
  -exec rm -rf {} + 2>/dev/null || true
rm -rf app/.cxx

start=$(date +%s)
./gradlew assembleDebug --no-build-cache \
  -PreactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64 \
  -Pexpo.core.buildFromSource=$from_source
seconds=$(($(date +%s) - start))

if [ "$from_source" = true ]; then
  core="expo-modules-core compiled from source"
else
  core="prebuilt expo-modules-core"
fi
echo
echo "clean debug build, all four ABIs, $core: $seconds s"

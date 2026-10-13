// the weight columns are copied from expo's native-component-list (mit), src/screens/FontScreen.tsx
// (VariableFontSection) at c35f5fe7c8a. RobotoFlex.ttf is assets/fonts/RobotoFlex.ttf from the
// same commit, under the sil open font license (OFL.txt). our edits: the font loads with
// useFonts on this screen, react native 0.88's fontVariationSettings sets the axes, and a slider
// moves the weight axis live.
import { Host } from '@expo/ui';
import { Slider } from '@expo/ui/swift-ui';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import { PlatformColor, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// One file, loaded under one name, carrying a `wght` axis from 100 to 1000 and a `slnt` axis
// from 0 to -10 for the italics. fontVariationSettings sets each axis, so every weight below
// comes from the same file.
const VARIABLE_FONT_FAMILY = 'RobotoFlex-variable';
const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const ITALIC_SLANT = -10;

export default function VariableFontsScreen() {
  const [loaded, error] = useFonts({ [VARIABLE_FONT_FAMILY]: require('./RobotoFlex.ttf') });
  const [weight, setWeight] = useState(400);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
      // on the duo, the tab bar is a rail at the right edge, inside the safe area.
      contentContainerStyle={[
        styles.content,
        { paddingLeft: 20 + insets.left, paddingRight: 20 + insets.right },
      ]}>
      <Text style={styles.caption}>
        One Roboto Flex file, loaded once with useFonts. fontVariationSettings picks a point on its
        weight and slant axes.
      </Text>
      {loaded ? (
        <>
          <View style={styles.live}>
            <Text
              style={[
                styles.liveSample,
                { fontFamily: VARIABLE_FONT_FAMILY, fontVariationSettings: { wght: weight } },
              ]}>
              Hamburg
            </Text>
            <Text style={styles.caption}>{`wght ${weight}`}</Text>
            <Host matchContents={{ vertical: true }} style={styles.slider}>
              <Slider
                value={weight}
                min={100}
                max={1000}
                step={10}
                onValueChange={(value) => setWeight(Math.round(value))}
              />
            </Host>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              {WEIGHTS.map((wght) => (
                <Text
                  key={wght}
                  style={[
                    styles.sample,
                    { fontFamily: VARIABLE_FONT_FAMILY, fontVariationSettings: { wght } },
                  ]}>
                  {wght} Hamburg
                </Text>
              ))}
            </View>
            <View style={styles.column}>
              {WEIGHTS.map((wght) => (
                <Text
                  key={wght}
                  style={[
                    styles.sample,
                    {
                      fontFamily: VARIABLE_FONT_FAMILY,
                      fontVariationSettings: { wght, slnt: ITALIC_SLANT },
                    },
                  ]}>
                  {wght} Hamburg
                </Text>
              ))}
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.caption}>{error ? error.message : 'Loading the font'}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PlatformColor('systemBackground') },
  content: { paddingVertical: 20, gap: 24 },
  caption: { fontSize: 15, lineHeight: 20, color: PlatformColor('secondaryLabel') },
  live: { alignItems: 'center', gap: 8 },
  liveSample: { fontSize: 64, color: PlatformColor('label') },
  slider: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', columnGap: 12 },
  column: { flex: 1, gap: 6 },
  sample: { fontSize: 24, color: PlatformColor('label') },
});

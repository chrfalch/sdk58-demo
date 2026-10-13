// the house example is copied from expo's native-component-list (mit),
// src/screens/Image/ImageSvgVariablesScreen.tsx ("multi-color house") at c35f5fe7c8a, with
// house.svg from assets/images/ at the same commit. our edits: a segmented picker replaces the
// "change roof color" button, and the colors have names.
import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSystemColors } from '@/hooks/use-system-colors';

import { RoofPicker } from './roof-picker';

// Declares --roof, --wall, --door, --window, --frame, --frame-width, --sun and --sun-opacity.
// Every property except --sun-opacity has a fallback.
const HOUSE = require('./house.svg');

const ROOF_COLORS = [
  { name: 'Red', value: '#ee3333' },
  { name: 'Blue', value: '#3399ff' },
  { name: 'Green', value: '#22aa55' },
  { name: 'Gray', value: '#888888' },
];

export default function SvgVariablesScreen() {
  const [roof, setRoof] = useState(ROOF_COLORS[0].value);
  const insets = useSafeAreaInsets();
  const colors = useSystemColors();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.screen, { backgroundColor: colors.background }]}
      // on the duo, the tab bar is a rail at the right edge, inside the safe area.
      contentContainerStyle={[
        styles.content,
        { paddingLeft: 20 + insets.left, paddingRight: 20 + insets.right },
      ]}>
      <Text style={[styles.caption, { color: colors.secondaryLabel }]}>
        One SVG file. svgVariables fills in its CSS variables, so the roof changes color and the
        image stays a vector.
      </Text>
      {/* Large render: edges should stay crisp because the SVG is not rasterized. */}
      <Image
        style={styles.house}
        source={HOUSE}
        contentFit="contain"
        svgVariables={{ '--roof': roof, '--wall': '#e8e8e8' }}
      />
      <RoofPicker
        colors={ROOF_COLORS}
        selection={roof}
        onSelectionChange={setRoof}
        style={styles.picker}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingVertical: 20, gap: 20, alignItems: 'center' },
  caption: {
    alignSelf: 'stretch',
    fontSize: 15,
    lineHeight: 20,
  },
  // a fixed size: with a percent width, aspectRatio takes the height before maxWidth clamps
  // the width, and the unfolded duo gets a tall empty box.
  house: { width: 320, height: 320 },
  picker: { width: '100%', maxWidth: 400 },
});

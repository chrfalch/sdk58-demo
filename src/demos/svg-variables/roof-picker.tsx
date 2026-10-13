import { Host } from '@expo/ui';
import { Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import type { StyleProp, ViewStyle } from 'react-native';

export type RoofPickerProps = {
  colors: { name: string; value: string }[];
  selection: string;
  onSelectionChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
};

/** a swiftui segmented picker. android uses a compose segmented button row instead. */
export function RoofPicker({ colors, selection, onSelectionChange, style }: RoofPickerProps) {
  return (
    <Host matchContents={{ vertical: true }} style={style}>
      <Picker
        label="Roof color"
        selection={selection}
        onSelectionChange={onSelectionChange}
        modifiers={[pickerStyle('segmented')]}>
        {colors.map((color) => (
          <Text key={color.value} modifiers={[tag(color.value)]}>
            {color.name}
          </Text>
        ))}
      </Picker>
    </Host>
  );
}

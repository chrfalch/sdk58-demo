import {
  Host,
  SegmentedButton,
  SingleChoiceSegmentedButtonRow,
  Text,
} from '@expo/ui/jetpack-compose';
import { fillMaxWidth } from '@expo/ui/jetpack-compose/modifiers';

import type { RoofPickerProps } from './roof-picker';

/** a material 3 single-choice segmented button row, the android counterpart of roof-picker.tsx. */
export function RoofPicker({ colors, selection, onSelectionChange, style }: RoofPickerProps) {
  return (
    <Host matchContents={{ vertical: true }} style={style}>
      <SingleChoiceSegmentedButtonRow modifiers={[fillMaxWidth()]}>
        {colors.map((color) => (
          <SegmentedButton
            key={color.value}
            selected={color.value === selection}
            onClick={() => onSelectionChange(color.value)}>
            <SegmentedButton.Label>
              <Text>{color.name}</Text>
            </SegmentedButton.Label>
          </SegmentedButton>
        ))}
      </SingleChoiceSegmentedButtonRow>
    </Host>
  );
}

// three jetpack compose components that are new in sdk 58's expo ui, each in a small real use.
// the component code is from expo's native-component-list (mit) at c35f5fe7c8a:
// src/screens/UI/DateRangePickerScreen.android.tsx (the inline picker, the dialog, and the date
// format) and src/screens/UI/SliderScreen.android.tsx (VerticalSlider). our edits: the "time
// off" and "volume" framing, and the layout. the volume sliders only move: they set no volume.
import AlarmIcon from '@expo/material-symbols/alarm.xml';
import CallIcon from '@expo/material-symbols/call.xml';
import DateRangeIcon from '@expo/material-symbols/date_range.xml';
import MusicNoteIcon from '@expo/material-symbols/music_note.xml';
import NotificationsIcon from '@expo/material-symbols/notifications.xml';
import {
  Card,
  Column,
  DateRangePicker,
  DateRangePickerDialog,
  FilledTonalButton,
  Host,
  Icon,
  Row,
  Surface,
  Text,
  useMaterialColors,
  VerticalSlider,
  type DateRangeSelection,
  type MaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxHeight,
  fillMaxSize,
  fillMaxWidth,
  height,
  padding,
  paddingAll,
  verticalScroll,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';
import { type ImageSourcePropType, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAY = 24 * 60 * 60 * 1000;

// material 3 counts the selected days in utc, so a range date is utc midnight of a local calendar
// day. otherwise, in the evening west of utc, "today" would already be tomorrow.
function daysFromToday(days: number) {
  const today = new Date();
  return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + days));
}
// selectableDates are local dates: expo ui takes their local calendar day.
const SELECTABLE = { start: new Date(), end: new Date(Date.now() + 365 * DAY) };

const STREAMS: { name: string; icon: ImageSourcePropType; initial: number }[] = [
  { name: 'Media', icon: MusicNoteIcon, initial: 0.7 },
  { name: 'Calls', icon: CallIcon, initial: 0.5 },
  { name: 'Ring', icon: NotificationsIcon, initial: 0.35 },
  { name: 'Alarm', icon: AlarmIcon, initial: 0.85 },
];

// the picker reports utc midnight, so the calendar day is in the utc fields.
function formatSelectedDate(date: Date): string {
  const localDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return localDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function describe(range: DateRangeSelection) {
  if (!range.start) return 'Pick your first day off';
  if (!range.end) return `From ${formatSelectedDate(range.start)}: pick your last day`;
  const days = Math.round((range.end.getTime() - range.start.getTime()) / DAY) + 1;
  return `Away ${formatSelectedDate(range.start)} – ${formatSelectedDate(range.end)}, ${days} ${days === 1 ? 'day' : 'days'}`;
}

export default function ComposeComponentsScreen() {
  const colors = useMaterialColors();
  const insets = useSafeAreaInsets();
  const wide = useWindowDimensions().width >= 600;

  // the state lives here: a fold swaps the row for a column, which remounts the cards.
  const [range, setRange] = useState<DateRangeSelection>({
    start: daysFromToday(7),
    end: daysFromToday(11),
  });
  const [levels, setLevels] = useState(STREAMS.map((stream) => stream.initial));

  const timeOff = <TimeOffCard colors={colors} wide={wide} range={range} onChange={setRange} />;
  const volume = <VolumeCard colors={colors} levels={levels} onChange={setLevels} />;

  return (
    <Host style={{ flex: 1 }}>
      <Surface color={colors.background} modifiers={[fillMaxSize()]}>
        {wide ? (
          <Row
            horizontalArrangement={{ spacedBy: 16 }}
            modifiers={[fillMaxSize(), padding(16, 8, 16, 16 + insets.bottom)]}>
            <Column modifiers={[weight(0.6), fillMaxHeight()]}>{timeOff}</Column>
            <Column modifiers={[weight(0.4), fillMaxHeight()]}>{volume}</Column>
          </Row>
        ) : (
          <Column
            verticalArrangement={{ spacedBy: 16 }}
            modifiers={[fillMaxSize(), verticalScroll(), padding(16, 8, 16, 16 + insets.bottom)]}>
            {timeOff}
            {volume}
          </Column>
        )}
      </Surface>
    </Host>
  );
}

function CardTitle({ name, detail, colors }: { name: string; detail: string; colors: MaterialColors }) {
  return (
    <Column verticalArrangement={{ spacedBy: 2 }}>
      <Text color={colors.primary} style={{ typography: 'labelLarge' }}>
        {name}
      </Text>
      <Text color={colors.onSurface} style={{ typography: 'titleLarge' }}>
        {detail}
      </Text>
    </Column>
  );
}

function TimeOffCard({
  colors,
  wide,
  range,
  onChange,
}: {
  colors: MaterialColors;
  wide: boolean;
  range: DateRangeSelection;
  onChange: (range: DateRangeSelection) => void;
}) {
  const [showDialog, setShowDialog] = useState(false);
  // a range from the dialog remounts the inline picker, so it also scrolls to the new range.
  const [pickerKey, setPickerKey] = useState(0);

  return (
    <Card
      colors={{ containerColor: colors.surfaceContainerLow }}
      modifiers={wide ? [fillMaxSize()] : [fillMaxWidth()]}>
      <Column verticalArrangement={{ spacedBy: 12 }} modifiers={[paddingAll(16)]}>
        <CardTitle name="DateRangePicker" detail={describe(range)} colors={colors} />
        <DateRangePicker
          key={pickerKey}
          initialStartDate={range.start?.toISOString()}
          initialEndDate={range.end?.toISOString()}
          selectableDates={SELECTABLE}
          // the card title already shows the range, and the picker sits on the card's color.
          showTitle={false}
          showHeadline={false}
          showVariantToggle={false}
          elementColors={{ containerColor: colors.surfaceContainerLow }}
          onDateRangeSelected={onChange}
          modifiers={wide ? [fillMaxWidth(), weight(1)] : [fillMaxWidth(), height(420)]}
        />
        <FilledTonalButton onClick={() => setShowDialog(true)}>
          <Icon source={DateRangeIcon} size={18} />
          <Text modifiers={[padding(8, 0, 0, 0)]}>DateRangePickerDialog</Text>
        </FilledTonalButton>
      </Column>
      {showDialog ? (
        <DateRangePickerDialog
          initialStartDate={range.start?.toISOString()}
          initialEndDate={range.end?.toISOString()}
          selectableDates={SELECTABLE}
          confirmButtonLabel="Save"
          dismissButtonLabel="Cancel"
          onDateRangeSelected={(selected) => {
            onChange(selected);
            setPickerKey((key) => key + 1);
            setShowDialog(false);
          }}
          onDismissRequest={() => setShowDialog(false)}
        />
      ) : null}
    </Card>
  );
}

function VolumeCard({
  colors,
  levels,
  onChange,
}: {
  colors: MaterialColors;
  levels: number[];
  onChange: (update: (levels: number[]) => number[]) => void;
}) {
  return (
    <Card colors={{ containerColor: colors.surfaceContainerLow }} modifiers={[fillMaxWidth()]}>
      <Column verticalArrangement={{ spacedBy: 16 }} modifiers={[paddingAll(16)]}>
        <CardTitle name="VerticalSlider" detail="Volume" colors={colors} />
        <Row horizontalArrangement={{ spacedBy: 8 }} modifiers={[fillMaxWidth()]}>
          {STREAMS.map((stream, index) => (
            <Column
              key={stream.name}
              horizontalAlignment="center"
              verticalArrangement={{ spacedBy: 8 }}
              modifiers={[weight(1)]}>
              <Text color={colors.onSurfaceVariant} style={{ typography: 'labelMedium' }}>
                {`${Math.round(levels[index] * 100)}%`}
              </Text>
              {/* a volume grows upward, so the direction is reversed. */}
              <VerticalSlider
                value={levels[index]}
                reverseDirection
                onValueChange={(value) =>
                  onChange((all) => all.map((level, i) => (i === index ? value : level)))
                }
                modifiers={[height(200)]}
              />
              <Icon source={stream.icon} size={20} tint={colors.onSurfaceVariant} />
              <Text color={colors.onSurfaceVariant} style={{ typography: 'labelMedium' }}>
                {stream.name}
              </Text>
            </Column>
          ))}
        </Row>
      </Column>
    </Card>
  );
}

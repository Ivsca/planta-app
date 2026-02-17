import React, { useMemo, useState } from "react";
import { Text, Pressable, StyleSheet, View } from "react-native";

type Props = {
  text: string;
  collapsedChars?: number; // MVP: colapsar por caracteres (más confiable que medir líneas en RN)
};

export default function ExpandableText({ text, collapsedChars = 220 }: Props) {
  const [expanded, setExpanded] = useState(false);

  const { shortText, needsToggle } = useMemo(() => {
    if (text.length <= collapsedChars) {
      return { shortText: text, needsToggle: false };
    }
    return { shortText: text.slice(0, collapsedChars).trimEnd() + "…", needsToggle: true };
  }, [text, collapsedChars]);

  return (
    <View>
      <Text style={styles.body}>{expanded ? text : shortText}</Text>

      {needsToggle && (
        <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={10}>
          <Text style={styles.toggle}>{expanded ? "Leer menos" : "Leer más"}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 14.5,
    lineHeight: 21,
    marginTop: 6,
  },
  toggle: {
    marginTop: 10,
    color: "#13EC5B",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});

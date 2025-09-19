import React from "react";
import { View, Text } from "react-native";

type GradeScreenProps = {
  darkMode: boolean;
  fontSize: number;
};

export function GradeScreen({ darkMode, fontSize }: GradeScreenProps) {
  const textColor = darkMode ? "text-white" : "text-black";
  const bgColor = darkMode ? "bg-neutral-900" : "bg-white";

  return (
    <View className={`flex-1 justify-center items-center ${bgColor}`}>
      <Text
        className={`font-bold text-blue-500`}
        style={{ fontSize: fontSize + 4 }}
      >
        Notas
      </Text>
      <Text className={`mt-2 ${textColor}`} style={{ fontSize }}>
        Aqui ficará o gráfico de desempenho.
      </Text>
    </View>
  );
}

import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";

type ConfigScreenProps = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  fontSize: number;
  setFontSize: (value: number | ((prev: number) => number)) => void;
};

export function ConfigScreen({
  darkMode,
  setDarkMode,
  fontSize,
  setFontSize,
}: ConfigScreenProps) {
  const textColor = darkMode ? "text-white" : "text-black";
  const bgColor = darkMode ? "bg-neutral-900" : "bg-white";

  return (
    <View className={`flex-1 p-5 ${bgColor}`}>
      <Text
        className={`pt-16 px-4 text-center ${textColor}`}
        style={{ fontSize: fontSize + 4, fontWeight: "bold" }}
      >
        Configurações
      </Text>

      {/* Modo escuro */}
      <View className="flex-row justify-between items-center my-2">
        <Text className={`${textColor}`} style={{ fontSize }}>
          Modo Escuro
        </Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      {/* Tamanho da fonte */}
      <View className="flex-row justify-between items-center my-2">
        <Text className={`${textColor}`} style={{ fontSize }}>
          Tamanho da Fonte
        </Text>
        <View className="flex-row space-x-2">
          <TouchableOpacity
            className="px-3 py-1 border rounded"
            onPress={() => setFontSize((prev) => Math.max(12, prev - 2))}
          >
            <Text className={textColor}>A-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-3 py-1 border rounded"
            onPress={() => setFontSize((prev) => Math.min(30, prev + 2))}
          >
            <Text className={textColor}>A+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

import "./global.css";
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useDatabase } from "./src/hooks/useDatabase";
import TabBar from "./src/components/manual/TabBar";
import { useState } from "react";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { GradeScreen } from "./src/screens/GradeScreen";
import { ConfigScreen } from "./src/screens/ConfigScreen";

export default function App() {
  const { isReady, error } = useDatabase();
  const [activeTab, setActiveTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-800 px-4">
        <Text className="text-lg text-red-600 text-center mb-2">
          Erro ao inicializar banco de dados
        </Text>
        <Text className="text-sm text-white text-center">{error.message}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-800">
        <ActivityIndicator size="large" color="#4630eb" />
        <Text className="mt-4 text-base text-white">
          Inicializando Hocus Focus...
        </Text>
      </View>
    );
  }

  // Renderização condicional das telas conforme a aba selecionada
  let ScreenComponent;
  if (activeTab === 0)
    ScreenComponent = () => (
      <HomeScreen darkMode={darkMode} fontSize={fontSize} />
    );
  else if (activeTab === 1)
    ScreenComponent = () => (
      <CalendarScreen darkMode={darkMode} fontSize={fontSize} />
    );
  else if (activeTab === 2)
    ScreenComponent = () => (
      <GradeScreen darkMode={darkMode} fontSize={fontSize} />
    );
  else if (activeTab === 3)
    ScreenComponent = () => (
      <ConfigScreen
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
    );
  else ScreenComponent = HomeScreen;

  return (
    <View className={`flex-1 ${darkMode ? "bg-neutral-900" : "bg-slate-100"}`}>
      <View className="flex-1">
        <ScreenComponent />
      </View>
      <TabBar activeIndex={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

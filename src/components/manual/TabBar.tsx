import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabBarProps = {
  activeIndex: number;
  onTabPress: (index: number) => void;
  darkMode?: boolean;
};

const icons = [
  <MaterialIcons name="home" size={24} />, // Home
  <MaterialIcons name="calendar-today" size={24} />, // Calendário
  <FontAwesome5 name="chart-bar" size={22} />, // Gráfico
  <FontAwesome5 name="clock" size={23} />, //Relógio 
  <Feather name="settings" size={24} />, // Engrenagem
];

const labels = ["Home", "Calendário", "Notas", "Relógio", "Config"];

const TabBar: React.FC<TabBarProps> = ({ activeIndex, onTabPress, darkMode = true }) => {
  // Animated values for each tab
  const scales = useRef(icons.map(() => new Animated.Value(1))).current;

  // Cores baseadas no tema
  const bgColor = darkMode ? "bg-slate-800" : "bg-white";
  const borderColor = darkMode ? "border-slate-700" : "border-gray-200";
  const activeIconColor = "#3b82f6"; // azul sempre
  const inactiveIconColor = darkMode ? "#94a3b8" : "#6b7280";
  const activeLabelColor = "text-blue-500";
  const inactiveLabelColor = darkMode ? "text-slate-200" : "text-gray-600";

  useEffect(() => {
    scales.forEach((scale, idx) => {
      Animated.spring(scale, {
        toValue: activeIndex === idx ? 1.2 : 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    });
  }, [activeIndex, scales]);

  return (
    <SafeAreaView edges={["bottom"]} className={bgColor}>
      <View className={`flex-row border-t ${borderColor}`}>
        {icons.map((icon, idx) => (
          <Pressable
            key={labels[idx]}
            className={`flex-1 py-2 items-center ${activeIndex === idx ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => onTabPress(idx)}
          >
            <Animated.View style={{ transform: [{ scale: scales[idx] }] }}>
              {React.cloneElement(icon, {
                color: activeIndex === idx ? activeIconColor : inactiveIconColor,
              })}
            </Animated.View>
            <Text className={`${activeIndex === idx ? `${activeLabelColor} font-bold` : inactiveLabelColor} text-xs mt-1`}>
              {labels[idx]}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default TabBar;

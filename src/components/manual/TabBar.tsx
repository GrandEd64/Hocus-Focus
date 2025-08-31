import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabBarProps = {
  activeIndex: number;
  onTabPress: (index: number) => void;
};

const icons = [
  <MaterialIcons name="home" size={24} />, // Home
  <MaterialIcons name="calendar-today" size={24} />, // Calendário
  <FontAwesome5 name="chart-bar" size={22} />, // Gráfico
  <Feather name="settings" size={24} /> // Engrenagem
];

const labels = ["Home", "Calendário", "Gráfico", "Config"];

const TabBar: React.FC<TabBarProps> = ({ activeIndex, onTabPress }) => {
  // Animated values for each tab
  const scales = useRef(icons.map(() => new Animated.Value(1))).current;

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
    <SafeAreaView edges={["bottom"]} className="bg-white">
      <View className="flex-row border-t border-gray-200">
        {icons.map((icon, idx) => (
          <Pressable
            key={labels[idx]}
            className={`flex-1 py-2 items-center ${activeIndex === idx ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => onTabPress(idx)}
          >
            <Animated.View style={{ transform: [{ scale: scales[idx] }] }}>
              {React.cloneElement(icon, {
                color: activeIndex === idx ? '#3b82f6' : '#6b7280',
              })}
            </Animated.View>
            <Text className={activeIndex === idx ? 'text-blue-500 font-bold text-xs mt-1' : 'text-gray-500 text-xs mt-1'}>
              {labels[idx]}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default TabBar;

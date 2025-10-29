import React, { useRef, useState } from "react";
import { View, Text, Animated, PanResponder, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { AnotacaoEntity } from "../types/entities";
import { getNotaColor } from "../Nota/getNotaColor";

interface AnotacaoItemProps {
  item: AnotacaoEntity;
  todasTarefas: AnotacaoEntity[];
  onPress: () => void;
  onLongPress: () => void;
  onEdit: () => void;
  onDropAnotacao: (newY: number) => void;
  onLayout: (event: any) => void;
  darkMode?: boolean;
}

export function AnotacaoItem({
  item,
  onPress,
  onLongPress,
  onEdit,
  onDropAnotacao,
  onLayout,
  darkMode = true
}: AnotacaoItemProps) {
  const { descricao, concluido, prioridade, id } = item;
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false, // Não capturar inicial
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Só ativar se houver movimento significativo (drag)
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(_, gestureState);
      },
      onPanResponderRelease: async (_, gestureState) => {
        setIsDragging(false);
        onDropAnotacao(gestureState.dy);

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5,
        }).start();
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5,
        }).start();
      },
    })
  ).current;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: concluido === 1 
        ? (darkMode ? "#064e3b" : "#d5f4e6") 
        : (darkMode ? "#374151" : "#fff"),
      borderColor: concluido === 1 ? "#27ae60" : (darkMode ? "#4b5563" : "#e1e8ed"),
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginBottom: 8,
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: darkMode ? 0.1 : 0.05,
      shadowRadius: 2,
    },
    text: {
      color: concluido === 1 
        ? "#27ae60" 
        : (darkMode ? "#f3f4f6" : "#2c3e50"),
      fontSize: 16,
      textDecorationLine:
        concluido === 1 ? ("line-through" as const) : ("none" as const),
    },
  });

  return (
    <Animated.View
      onLayout={onLayout}
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          zIndex: isDragging ? 999 : 1,
          elevation: isDragging ? 5 : 1,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity 
          onPress={onPress}
          onLongPress={onLongPress}
          activeOpacity={0.7}
          style={{ flex: 1 }}
        >
          <Text style={styles.text}>
            {descricao}
          </Text>
        </TouchableOpacity>

        {item.nota && (
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-4"
            style={{ backgroundColor: getNotaColor(item.nota) }}>
            <Text className="text-white font-bold" style={{ fontSize: styles.text.fontSize }}>
              {item.nota.toFixed(1)}
            </Text>
          </View>
        )}
        
        <TouchableOpacity
          onPress={onEdit}
          style={{
            padding: 8,
            marginLeft: 8,
          }}
          activeOpacity={0.6}
        >
          <Feather 
            name="edit-2" 
            size={16} 
            color={concluido === 1 
              ? "#27ae60" 
              : (darkMode ? "#9ca3af" : "#6b7280")
            }
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

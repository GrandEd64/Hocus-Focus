import React, { useRef, useState } from 'react';
import { View, Text, Animated, PanResponder, StyleSheet } from 'react-native';
import { AnotacaoEntity } from '../types/entities';

interface AnotacaoItemProps {
  item: AnotacaoEntity;
  todasTarefas: AnotacaoEntity[];
  onPress: () => void;
  onLongPress: () => void;
  onDropAnotacao: (newY: number) => void;
  ref: 
}

export function AnotacaoItem({ item, onPress, onLongPress, onDropAnotacao, ref}: AnotacaoItemProps) {
  const { descricao, concluido, prioridade, id } = item;
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);

  const viewRef = useRef<View>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { useNativeDriver: false }
        )(_, gestureState);
      },
      onPanResponderRelease: async (_, gestureState) => {
        setIsDragging(false);

        if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
          onPress();
          return;
        };

        onDropAnotacao(gestureState.dy);

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5
        }).start();
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5
        }).start();
      }
    })
  ).current;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: concluido === 1 ? '#d5f4e6' : '#fff',
      borderColor: concluido === 1 ? '#27ae60' : '#e1e8ed',
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginBottom: 8,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    text: {
      color: concluido === 1 ? '#27ae60' : '#2c3e50',
      fontSize: 16,
      textDecorationLine: concluido === 1 ? 'line-through' as const : 'none' as const
    }
  });

  return (
    <Animated.View ref={viewRef}
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y }
          ],
          zIndex: isDragging ? 999 : 1,
          elevation: isDragging ? 5 : 1,
        }
      ]}
    >
      <Text style={styles.text} onLongPress={onLongPress}>
        {descricao}
      </Text>
    </Animated.View>
  );
}

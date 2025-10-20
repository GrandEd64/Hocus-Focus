import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PainelEntity } from '../../types/entities';
import { usePaineis } from '../../hooks/useDatabase';
import { AntDesign } from '@expo/vector-icons';
type Props = {
  visible: boolean;
  onClose: () => void;
  painel?: PainelEntity | null;
  onSaved?: () => void;
};

const presetColors = ['#4630eb', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#374151'];

export default function EditarPainelModal({ visible, onClose, painel, onSaved }: Props) {
  const { atualizarPainel } = usePaineis();
  const [name, setName] = React.useState(painel?.nome ?? '');
  const [color, setColor] = React.useState(painel?.cor ?? '#4630eb');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setName(painel?.nome ?? '');
    setColor(painel?.cor ?? '#4630eb');
  }, [painel, visible]);

  if (!painel) return null;

  const handleSave = async () => {
    if (!name || name.trim().length === 0) return;
    try {
      setSaving(true);
      await atualizarPainel(painel.id, { nome: name.trim(), cor: color });
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error('Erro ao atualizar painel:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">Editar Painel</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-blue-500">Fechar</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="mb-2 font-medium">Nome</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nome do painel"
              className="border border-gray-300 rounded-lg h-12 px-4 text-base bg-white"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 font-medium">Cor</Text>
            <View className="flex-row flex-wrap justify-center">
              {presetColors.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setColor(c)}
                  className={`mr-3 mb-3`}
                  style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c, borderWidth: color === c ? 2 : 0, borderColor: '#000', alignItems: 'center', justifyContent: 'center' }}
                >
                  {color === c && (
                    <AntDesign name="check" size={18} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex-row justify-end">
            <TouchableOpacity onPress={onClose} className="px-4 py-2 mr-2">
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} className="px-4 py-2 bg-blue-600 rounded">
              {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white">Salvar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

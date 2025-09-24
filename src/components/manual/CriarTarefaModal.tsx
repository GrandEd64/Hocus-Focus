import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

type CriarTarefaModalProps = {
  visible: boolean;
  onClose: () => void;
  onCriarTarefa: (tarefa: {
    descricao: string;
    prioridade: number;
    data_vencimento?: string;
    painel_id?: number;
  }) => void;
  darkMode?: boolean;
  fontSize?: number;
  painelId?: number;
  tarefaParaEditar?: any;
};

export default function CriarTarefaModal({
  visible,
  onClose,
  onCriarTarefa,
  darkMode = true,
  fontSize = 16,
  painelId,
  tarefaParaEditar
}: CriarTarefaModalProps) {
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState(1);
  const [dataVencimento, setDataVencimento] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Preencher campos quando estiver editando
  React.useEffect(() => {
    if (tarefaParaEditar) {
      setDescricao(tarefaParaEditar.descricao || '');
      setPrioridade(tarefaParaEditar.prioridade || 1);
      const vencimento = tarefaParaEditar.data_vencimento?.slice(0, 10) || '';
      setDataVencimento(vencimento);
      if (vencimento) {
        setSelectedDate(new Date(vencimento));
      }
    } else {
      // Limpar campos quando for criar nova tarefa
      setDescricao('');
      setPrioridade(1);
      setDataVencimento('');
      setSelectedDate(new Date());
    }
  }, [tarefaParaEditar, visible]);

  // Cores baseadas no tema
  const textColor = darkMode ? "text-white" : "text-black";
  const bgColor = darkMode ? "bg-neutral-900" : "bg-white";
  const cardBg = darkMode ? "bg-neutral-800" : "bg-slate-100";
  const placeholderColor = darkMode ? "#aaa" : "#666";

  const handleCriar = () => {
    if (!descricao.trim()) {
      Alert.alert('Erro', 'Por favor, digite uma descrição para a tarefa.');
      return;
    }

    onCriarTarefa({
      descricao: descricao.trim(),
      prioridade,
      data_vencimento: dataVencimento || undefined,
      painel_id: painelId
    });

    // Limpar campos
    setDescricao('');
    setPrioridade(1);
    setDataVencimento('');
    setSelectedDate(new Date());
    setShowDatePicker(false);
    onClose();
  };

  const getPrioridadeColor = (prio: number) => {
    if (prio >= 3) return 'bg-red-500';
    if (prio >= 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPrioridadeText = (prio: number) => {
    if (prio >= 3) return 'Alta';
    if (prio >= 2) return 'Média';
    return 'Baixa';
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDataVencimento(formattedDate);
    }
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const clearDate = () => {
    setDataVencimento('');
    setSelectedDate(new Date());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className={`rounded-t-3xl p-6 ${bgColor}`}>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`font-bold ${textColor}`} style={{ fontSize: fontSize + 4 }}>
              {tarefaParaEditar ? 'Editar Tarefa' : 'Nova Tarefa'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign 
                name="close" 
                size={24} 
                color={darkMode ? "#fff" : "#000"} 
              />
            </TouchableOpacity>
          </View>

          {/* Descrição */}
          <View className="mb-4">
            <Text className={`mb-2 font-medium ${textColor}`} style={{ fontSize }}>
              Descrição
            </Text>
            <TextInput
              className={`rounded-lg px-4 py-3 ${cardBg} ${textColor}`}
              placeholder="Digite a descrição da tarefa..."
              placeholderTextColor={placeholderColor}
              value={descricao}
              onChangeText={setDescricao}
              style={{ fontSize }}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Prioridade */}
          <View className="mb-4">
            <Text className={`mb-2 font-medium ${textColor}`} style={{ fontSize }}>
              Prioridade
            </Text>
            <View className="flex-row justify-between">
              {[1, 2, 3].map((prio) => (
                <TouchableOpacity
                  key={prio}
                  className={`flex-1 mx-1 p-3 rounded-lg border-2 ${
                    prioridade === prio 
                      ? `${getPrioridadeColor(prio)} border-transparent` 
                      : `${cardBg} ${darkMode ? 'border-neutral-700' : 'border-slate-300'}`
                  }`}
                  onPress={() => setPrioridade(prio)}
                >
                  <View className="items-center">
                    <View className={`w-3 h-3 rounded-full mb-1 ${getPrioridadeColor(prio)}`} />
                    <Text 
                      className={prioridade === prio ? 'text-white font-bold' : textColor}
                      style={{ fontSize: fontSize - 2 }}
                    >
                      {getPrioridadeText(prio)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Data de Vencimento */}
          <View className="mb-6">
            <Text className={`mb-2 font-medium ${textColor}`} style={{ fontSize }}>
              Data de Vencimento (opcional)
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className={`flex-1 rounded-lg px-4 py-3 ${cardBg} flex-row justify-between items-center`}
                onPress={() => setShowDatePicker(true)}
              >
                <Text 
                  className={dataVencimento ? textColor : ''}
                  style={{ 
                    fontSize, 
                    color: dataVencimento ? (darkMode ? "#fff" : "#000") : placeholderColor 
                  }}
                >
                  {dataVencimento ? formatDateDisplay(dataVencimento) : 'Selecionar data'}
                </Text>
                <AntDesign 
                  name="calendar" 
                  size={20} 
                  color={darkMode ? "#9ca3af" : "#6b7280"} 
                />
              </TouchableOpacity>
              {dataVencimento && (
                <TouchableOpacity
                  className="ml-2 p-2 rounded-lg"
                  onPress={clearDate}
                >
                  <AntDesign 
                    name="close" 
                    size={20} 
                    color={darkMode ? "#ef4444" : "#dc2626"} 
                  />
                </TouchableOpacity>
              )}
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
                locale="pt-BR"
              />
            )}
          </View>

          {/* Botões */}
          <View className="flex-row justify-end space-x-3">
            <TouchableOpacity
              className={`px-6 py-3 rounded-lg ${cardBg}`}
              onPress={onClose}
            >
              <Text className={textColor} style={{ fontSize }}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-6 py-3 rounded-lg bg-blue-600"
              onPress={handleCriar}
            >
              <Text className="text-white font-bold" style={{ fontSize }}>
                {tarefaParaEditar ? 'Salvar Alterações' : 'Criar Tarefa'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

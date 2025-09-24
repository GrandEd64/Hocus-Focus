import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert, Modal } from "react-native";
import { useDatabase } from "../hooks/useDatabase";
import { Nota } from "../database/models/Nota";
import NotaCard from "../components/manual/NotaCard";

type GradeScreenProps = {
  darkMode: boolean;
  fontSize: number;
};

export function GradeScreen({ darkMode, fontSize }: GradeScreenProps) {
  const { isReady, services } = useDatabase();
  const [notas, setNotas] = useState([]);
  const [nota, setNota] = useState("");
  const [materia, setMateria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editId, setEditId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Cores baseadas no tema
  const textColor = darkMode ? "text-white" : "text-black";
  const bgColor = darkMode ? "bg-neutral-900" : "bg-white";
  const cardBg = darkMode ? "bg-neutral-800" : "bg-slate-100";
  const placeholderColor = darkMode ? "#aaa" : "#666";

  async function carregarNotas() {
    console.log('📚 Iniciando carregarNotas...');
    console.log('📚 isReady:', isReady);
    console.log('📚 services?.nota:', !!services?.nota);
    
    if (!isReady || !services?.nota) {
      console.log('❌ Database não está pronto para carregar notas');
      return;
    }
    
    try {
      const result = await services.nota.findAll();
      console.log('📚 Notas encontradas:', result);
      console.log('📚 Quantidade de notas:', result.length);
      setNotas(result);
    } catch (error) {
      console.error('❌ Erro ao carregar notas:', error);
    }
  }

  useEffect(() => {
    carregarNotas();
  }, [isReady, services]);

  async function salvarNota() {
    console.log('🎯 Iniciando salvarNota...');
    console.log('🎯 isReady:', isReady);
    console.log('🎯 services?.nota:', !!services?.nota);
    console.log('🎯 Dados:', { nota, materia, descricao, editId });
    
    if (!isReady || !services?.nota) {
      console.log('❌ Database não está pronto ou serviço nota não existe');
      return;
    }
    
    if (!materia.trim()) {
      Alert.alert("Erro", "Por favor, digite uma matéria.");
      return;
    }
    
    if (!nota.trim()) {
      Alert.alert("Erro", "Por favor, digite uma nota.");
      return;
    }
    
    const notaNumero = Number(nota);
    if (isNaN(notaNumero)) {
      Alert.alert("Erro", "A nota deve ser um número válido.");
      return;
    }
    
    const novaNota = new Nota({
      nota: notaNumero,
      materia: materia.trim(),
      descricao: descricao.trim(),
      data_criacao: new Date().toISOString(),
      id: editId
    });
    
    console.log('🎯 Nova nota criada:', novaNota);
    
    if (!novaNota.isValid()) {
      Alert.alert("Nota inválida", "A nota deve ser entre 0 e 10.");
      return;
    }
    
    try {
      if (editId) {
        console.log('🎯 Atualizando nota existente...');
        await services.nota.update(editId, novaNota);
      } else {
        console.log('🎯 Criando nova nota...');
        const result = await services.nota.create(novaNota);
        console.log('🎯 Resultado da criação:', result);
      }
      
      setNota("");
      setMateria("");
      setDescricao("");
      setEditId(null);
      await carregarNotas();
      console.log('✅ Nota salva com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar nota:', error);
      Alert.alert("Erro", "Falha ao salvar a nota. Tente novamente.");
    }
  }

  function editarNota(n) {
    setNota(String(n.nota));
    setMateria(n.materia);
    setDescricao(n.descricao);
    setEditId(n.id);
  }

  async function removerNota(id) {
    if (!isReady || !services?.nota) return;
    await services.nota.delete(id);
    carregarNotas();
  }

  function abrirModalNova() {
    setNota("");
    setMateria("");
    setDescricao("");
    setEditId(null);
    setModalVisible(true);
  }

  function abrirModalEdicao(notaItem) {
    setNota(String(notaItem.nota));
    setMateria(notaItem.materia);
    setDescricao(notaItem.descricao);
    setEditId(notaItem.id);
    setModalVisible(true);
  }

  function fecharModal() {
    setModalVisible(false);
    setNota("");
    setMateria("");
    setDescricao("");
    setEditId(null);
  }

  async function salvarEFechar() {
    await salvarNota();
    fecharModal();
  }

  return (
    <View className={`flex-1 pt-16 ${bgColor}`}>
      <Text
        className={`text-center mb-6 ${textColor}`}
        style={{ fontSize: fontSize + 4, fontWeight: "bold" }}
      >
        Minhas Notas
      </Text>
      
      <NotaCard
        notas={notas}
        onAddNota={abrirModalNova}
        onNotaPress={abrirModalEdicao}
        onNotaLongPress={(nota) => {
          Alert.alert(
            'Remover Nota',
            `Deseja remover a nota de ${nota.materia}?`,
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Remover', style: 'destructive', onPress: () => removerNota(nota.id) }
            ]
          );
        }}
        darkMode={darkMode}
        fontSize={fontSize}
      />

      {/* Modal para adicionar/editar nota */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={fecharModal}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className={`rounded-t-3xl p-6 ${bgColor}`}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`font-bold ${textColor}`} style={{ fontSize: fontSize + 4 }}>
                {editId ? 'Editar Nota' : 'Nova Nota'}
              </Text>
              <TouchableOpacity onPress={fecharModal}>
                <Text className={`${textColor}`} style={{ fontSize: fontSize + 2 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className={`mb-2 font-medium ${textColor}`} style={{ fontSize }}>
                Matéria
              </Text>
              <TextInput
                className={`rounded-lg px-4 py-3 ${cardBg} ${textColor}`}
                placeholder="Ex: Matemática, História..."
                placeholderTextColor={placeholderColor}
                value={materia}
                onChangeText={setMateria}
                style={{ fontSize }}
              />
            </View>

            <View className="mb-4">
              <Text className={`mb-2 font-medium ${textColor}`} style={{ fontSize }}>
                Nota (0-10)
              </Text>
              <TextInput
                className={`rounded-lg px-4 py-3 ${cardBg} ${textColor}`}
                placeholder="Ex: 8.5"
                placeholderTextColor={placeholderColor}
                value={nota}
                onChangeText={setNota}
                keyboardType="numeric"
                style={{ fontSize }}
              />
            </View>

            <View className="mb-6">
              <Text className={`mb-2 font-medium ${textColor}`} style={{ fontSize }}>
                Descrição (opcional)
              </Text>
              <TextInput
                className={`rounded-lg px-4 py-3 ${cardBg} ${textColor}`}
                placeholder="Detalhes sobre a avaliação..."
                placeholderTextColor={placeholderColor}
                value={descricao}
                onChangeText={setDescricao}
                style={{ fontSize }}
                multiline
                numberOfLines={3}
              />
            </View>

            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                className={`px-6 py-3 rounded-lg ${cardBg}`}
                onPress={fecharModal}
              >
                <Text className={textColor} style={{ fontSize }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-6 py-3 rounded-lg bg-blue-600"
                onPress={salvarEFechar}
              >
                <Text className="text-white font-bold" style={{ fontSize }}>
                  {editId ? 'Salvar Alterações' : 'Adicionar Nota'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
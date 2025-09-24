import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert } from "react-native";
import { useDatabase } from "../hooks/useDatabase";
import { Nota } from "../database/models/Nota";

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

  // Cores baseadas no tema
  const textColor = darkMode ? "text-white" : "text-black";
  const bgColor = darkMode ? "bg-neutral-900" : "bg-white";
  const cardBg = darkMode ? "bg-neutral-800" : "bg-slate-100";
  const placeholderColor = darkMode ? "#aaa" : "#666";

  async function carregarNotas() {
    if (!isReady || !services?.nota) return;
    const result = await services.nota.findAll();
    setNotas(result);
  }

  useEffect(() => {
    carregarNotas();
  }, [isReady, services]);

  async function salvarNota() {
    if (!isReady || !services?.nota) return;
    const novaNota = new Nota({
      nota: Number(nota),
      materia,
      descricao,
      data_criacao: new Date().toISOString(),
      id: editId
    });
    if (!novaNota.isValid()) {
      Alert.alert("Nota inválida", "A nota deve ser entre 0 e 10.");
      return;
    }
    if (editId) {
      await services.nota.update(editId, novaNota);
    } else {
      await services.nota.create(novaNota);
    }
    setNota("");
    setMateria("");
    setDescricao("");
    setEditId(null);
    carregarNotas();
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

  return (
    <View className={`flex-1 p-5 ${bgColor}`}>
      <Text
        className={`pt-16 px-4 text-center ${textColor}`}
        style={{ fontSize: fontSize + 4, fontWeight: "bold" }}
      >
        Minhas Notas
      </Text>
      <View className="my-4">
        <TextInput
          className={`rounded px-3 py-2 mb-2 ${cardBg} ${textColor}`}
          placeholder="Matéria"
          placeholderTextColor={placeholderColor}
          value={materia}
          onChangeText={setMateria}
          style={{ fontSize }}
        />
        <TextInput
          className={`rounded px-3 py-2 mb-2 ${cardBg} ${textColor}`}
          placeholder="Nota (0-10)"
          placeholderTextColor={placeholderColor}
          value={nota}
          onChangeText={setNota}
          keyboardType="numeric"
          style={{ fontSize }}
        />
        <TextInput
          className={`rounded px-3 py-2 mb-2 ${cardBg} ${textColor}`}
          placeholder="Descrição"
          placeholderTextColor={placeholderColor}
          value={descricao}
          onChangeText={setDescricao}
          style={{ fontSize }}
        />
        <TouchableOpacity
          className="bg-blue-600 rounded px-4 py-2 self-end"
          onPress={salvarNota}
        >
          <Text className="text-white font-bold" style={{ fontSize }}>
            {editId ? "Salvar Alteração" : "Adicionar Nota"}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notas}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`mb-3 p-4 rounded ${cardBg}`}
            onPress={() => editarNota(item)}
            onLongPress={() => removerNota(item.id)}
          >
            <Text className={`${textColor} font-bold`} style={{ fontSize: fontSize + 2 }}>
              {item.materia} — {item.nota}
            </Text>
            <Text className={darkMode ? "text-slate-300" : "text-slate-600"} style={{ fontSize }}>
              {item.descricao}
            </Text>
            <Text className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Toque para editar, segure para remover
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className={`text-center mt-8 ${textColor}`} style={{ fontSize }}>
            Nenhuma nota ainda.
          </Text>
        }
      />
    </View>
  );
}
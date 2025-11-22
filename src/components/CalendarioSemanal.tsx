import { useEffect, useState } from "react";
import { useAnotacoes, useDatabase } from "../hooks/useDatabase";
import { Anotacao } from "../database/models";
import { FlatList, ScrollView, Text, View } from "react-native";
import { AnotacaoEntity } from "../types/entities";
import { MaterialIcons } from "@expo/vector-icons";
import { nomeDoDia, nomeDoMes } from "../Calendário/NomesDatas";
import { TouchableOpacity } from "react-native";

type dataEAtividades = {
    dia: Date;
    atividades: AnotacaoEntity[];
};

type anotacaoComDataParserizada = {
    data: Date;
    anotacao: AnotacaoEntity;
};

interface CalendarioSemanalProps {
    fontSize?: number;
    services;
    servicesIsReady;
    onAnotacaoTouched?: (anotacao : AnotacaoEntity) => void;
}

export default function CalendarioSemanal ({
    fontSize,
    services,
    servicesIsReady,
    onAnotacaoTouched
} : CalendarioSemanalProps) 
{
    const [atividadesDaSemana, setAtividadesDaSemana] = useState([] as dataEAtividades[]);

    const dataAtual = new Date();
    const diasDesdeDomingo = dataAtual.getDay();
    const diasAteSegunda = 7 - diasDesdeDomingo;

    const startDate = new Date(dataAtual);
    startDate.setDate(dataAtual.getDate() - diasDesdeDomingo);
    
    const endDate = new Date(dataAtual);
    endDate.setDate(dataAtual.getDate() + (diasAteSegunda - 1));

    const normalizeDate = (date : Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    const hojeFormatado = normalizeDate(dataAtual).getTime();

    const loadAnotacoesDaSemana = async () => {
        const allAnots : AnotacaoEntity[] = await services.anotacao.findAll();
        const anotsParserized : anotacaoComDataParserizada[] = allAnots.map(a => ({anotacao: a, data: new Date(Date.parse(a.data_vencimento))}));

        const anotsDessaSemana: anotacaoComDataParserizada[] = anotsParserized.filter(a => a.data >= normalizeDate(startDate) && a.data <= normalizeDate(endDate));
        const diasDaSemanaComAtividades: Date[] = Array.from(new Set(anotsDessaSemana.map(a => a.data.getTime()))).map(t => new Date(t));

        setAtividadesDaSemana(
            diasDaSemanaComAtividades.map(d => ({
                dia: d, 
                atividades: 
                    anotsDessaSemana.filter(an => an.data.getTime() === d.getTime()).map(an => an.anotacao)
                })).sort((a, b) => a.dia.getTime() - b.dia.getTime())
        );
    };

    useEffect(() => {loadAnotacoesDaSemana();}, [servicesIsReady]);

    useEffect(() => {
        if (!services?.anotacao) {console.log("Banco de dados não está pronto."); return}

        loadAnotacoesDaSemana();
    }, [])

    const renderAnotacao = ({ item }: { item: AnotacaoEntity }) => {
        const prioridadeColor = item.prioridade >= 3 ? "#ef4444" : 
                                item.prioridade >= 2 ? "#f59e0b" : "#10b981";
        const prioridadeTexto = item.prioridade >= 3 ? "Alta" : 
                                item.prioridade >= 2 ? "Média" : "Baixa";

        return (
            <TouchableOpacity onPress={() => onAnotacaoTouched(item)} className="p-3 rounded-lg border-l-4 bg-slate-100" style={{borderLeftColor: prioridadeColor}}>
                <Text style={{fontSize: fontSize + 1}}>
                    {item.descricao}
                </Text>
                <View className="flex-row items-center mt-1">
                    <View 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: prioridadeColor }}
                    />
                    <Text
                    style={{
                        color: "#64748b",
                        fontSize: fontSize - 2,
                    }}
                    >
                    {prioridadeTexto} prioridade
                    </Text>
                    {item.concluido === 1 && (
                    <Text
                        style={{
                        color: "#10b981",
                        fontSize: fontSize - 2,
                        marginLeft: 8,
                        fontWeight: "bold"
                        }}
                    >
                        ✓ Concluída
                    </Text>
                )}
                </View>
                {/* item.painel_id && (
                    <Text>
                        {services.paineis.findById(item.painel_id).descricao}
                    </Text>
                )*/}
            </TouchableOpacity>
        )
    };

    const formatarData = (data : Date) => {return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}`};
    return (
        <View className="bg-white flex-1 pt-10">
            <Text className="font-bold text-center mb-6" style={{fontSize: fontSize + 4}}>
                Calendário Semanal
            </Text>
            <Text className="px-4" style={{fontSize: fontSize + 2}}>
                {nomeDoMes(dataAtual.getMonth())} ({formatarData(startDate)} - {formatarData(endDate)})
            </Text>
            {atividadesDaSemana.length !== 0 ? 
                (
                    <ScrollView className="flex-1">
                    {atividadesDaSemana.map(as => (
                        <View key={as.dia.getDay()} className="p-5">
                            <View className="flex flex-row items-center">
                                <Text className="mb-2 font-bold">{nomeDoDia(as.dia.getDay())} ({formatarData(as.dia)})</Text>{as.dia.getTime() === hojeFormatado && (<Text className="p-2 mb-2 ml-2 rounded bg-red-500 text-white">HOJE</Text>)}
                            </View>
                            <FlatList
                            data={as.atividades}
                            renderItem={renderAnotacao}
                            keyExtractor={item => String(item.id)}
                            scrollEnabled={false}
                            contentContainerStyle={{backgroundColor:(as.dia.getTime() === hojeFormatado ? '#f0cece' : '#f9fafb'), borderRadius: 5, gap:8, paddingVertical: 5, paddingHorizontal: 6}}
                            />
                        </View>
                        ))}
                    </ScrollView>
                ) 
                : 
                (
                    <View className="flex-1 items-center justify-center py-12">
                        <MaterialIcons 
                            name="calendar-month" 
                            size={48} 
                            color={"#94a3b8"} 
                            />
                            <Text 
                            className={`mt-2 text-center text-slate-600`} 
                            style={{ fontSize }}
                            >
                                Nenhuma anotação para essa semana
                            </Text>
                    </View>
                )
            }
        </View>
    )
}
import { View, Text } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

export default function DataCard() {    
    return (
        <View>
            <View className="mt-4 mx-6 flex flex-row justify-between">
                <Text className="text-white text-2xl">
                    Atividades
                </Text>
                <AntDesign name="plus" size={24} color="#2c4c84" />

            </View>
            <View className="flex items-center flex-row mx-6 mt-8 max-w-96">
                <View className="bg-blue-400 p-4 items-center rounded-lg w-32 h-28">
                    <Text className="text-white text-5xl">10</Text>
                    <Text className="text-white">Janeiro</Text>
                </View>
                <View className="ml-6 rounded-lg ">
                    <View className="flex-row justify-between">
                        <Text className="text-lg text-white">Dia de fazer xixi na rua</Text>
                        <Feather className="text-white" color="#475569" name="more-vertical" size={24} />
                    </View>
                    <Text className="text-slate-500 mt-2 whitespace-">Preciso fazer xixi na rua pois é muito legal xD</Text>
                    <Text className="text-slate-600 mt-1">12:00 - 17:00</Text>
                </View>
            </View>
        </View>
    )
}
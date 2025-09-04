import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useDatabase } from '../hooks/useDatabase';
import DataCard from '../components/manual/DataCard';

/*a ideia é que ele seja um agrupamento, consegue enxergar no calendario 
os paineis que voce fez de acordo com a data*/
// Configuração de idioma para o calendário
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export function CalendarScreen() {
  const { isReady, services } = useDatabase();
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [painelPorData, setPainelPorData] = useState({});

  useEffect(() => {
    async function fetchPaineis() {
      if (!isReady || !services) return;
      const paineis = await services.painel.findAllActive();
      // Agrupa painéis por data de criação (formato yyyy-mm-dd)
      const marks = {};
      const painelDataMap = {};
      paineis.forEach(painel => {
        const date = painel.data_criacao?.slice(0, 10);
        if (date) {
          marks[date] = {
            marked: true,
            dotColor: painel.cor || '#4630eb',
          };
          if (!painelDataMap[date]) painelDataMap[date] = [];
          painelDataMap[date].push(painel);
        }
      });
      setMarkedDates(marks);
      setPainelPorData(painelDataMap);
    }
    fetchPaineis();
  }, [isReady, services]);

  return (
    <View className="flex-1 pt-16">
      <Text className="text-2xl font-bold text-blue-500 text-center mb-6">Calendário</Text>
      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#3b82f6', ...markedDates[selectedDate] } } : {})
        }}
        theme={{
          calendarBackground: 'transparent',
          textSectionTitleColor: '#94a3b8',
          dayTextColor: '#f1f5f9',
          monthTextColor: '#f1f5f9',
          selectedDayBackgroundColor: '#3b82f6',
          selectedDayTextColor: '#fff',
          todayTextColor: '#E8E8E8',
          dotColor: '#3b82f6',
          arrowColor: '#f1f5f9',
          textDayFontWeight: '500',
          textDisabledColor: '#64748b',

        }}
        onDayPress={day => setSelectedDate(day.dateString)}
        style={{
          backgroundColor: 'transparent',
        }}
      />
      {selectedDate && painelPorData[selectedDate] && (
        <View className="mt-4 px-4">
          <Text className="text-lg font-bold text-slate-700 mb-2">Painéis do dia:</Text>
          {painelPorData[selectedDate].map(painel => (
            <View key={painel.id} className="mb-2 p-2 rounded bg-slate-800 border-l-4" style={{ borderLeftColor: painel.cor }}>
              <Text className="text-base font-semibold" style={{ color: painel.cor }}>{painel.nome}</Text>
              <Text className="text-xs text-gray-500">Criado em: {painel.data_criacao?.slice(0, 10)}</Text>
            </View>
          ))}
        </View>
      )}
      <DataCard />
    </View>
  );
}

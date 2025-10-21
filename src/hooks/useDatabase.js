import { useState, useEffect, useCallback } from 'react';
import { dbManager } from '../database/index.js';
import { PainelDAO, AnotacaoDAO, NotaDAO } from '../database/queries.js';
import { Painel, Anotacao, Nota } from '../database/models/index.js';

/**
 * Hook customizado para gerenciar o banco de dados
 */
export function useDatabase() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState(null);

  useEffect(() => {
    async function initDatabase() {
      try {
        await dbManager.initialize();
        
        // Inicializar DAOs
        const painelDAO = new PainelDAO();
        const anotacaoDAO = new AnotacaoDAO();
        const notaDAO = new NotaDAO();
        
        setServices({
          painel: painelDAO,
          anotacao: anotacaoDAO,
          nota: notaDAO,
          db: dbManager.getDatabase()
        });
        
        setIsReady(true);
      } catch (err) {
        setError(err);
        console.error('Erro ao inicializar database:', err);
      }
    }

    initDatabase();
  }, []);

  return { isReady, error, services };
}

/**
 * Hook para gerenciar painéis
 */
export function usePaineis() {
  const { services, isReady } = useDatabase();
  const [paineis, setPaineis] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarPaineis = useCallback(async () => {
    if (!services) return;
    
    try {
      setLoading(true);
      const result = await services.painel.findAllActive();
      setPaineis(result);
    } catch (error) {
      console.error('Erro ao carregar painéis:', error);
    } finally {
      setLoading(false);
    }
  }, [services]);

  const criarPainel = useCallback(async (dadosPainel) => {
    if (!services) return;
    
    try {
      console.log('📝 Dados recebidos para criar painel:', dadosPainel);
      
      // Criar instância da classe Painel
      const painel = new Painel(dadosPainel);
      
      console.log('🔍 Painel criado:', painel);
      console.log('✅ Painel válido?', painel.isValid());
      console.log('🗃️ Dados para banco:', painel.toDatabase());
      
      await services.painel.create(painel);
      await carregarPaineis(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao criar painel:', error);
      throw error;
    }
  }, [services, carregarPaineis]);

  const excluirPainel = useCallback(async (id) => {
    if (!services) return;
    
    try {
      const anotacoes = await services.anotacao.findByPainel(id);
      await Promise.all(anotacoes.map(async (anotacao) => {
        const anotacaoAtualizada = new Anotacao({ ...anotacao });
        anotacaoAtualizada.painel_id = null;
        await services.anotacao.update(anotacaoAtualizada.id, anotacaoAtualizada);
      }));
      await services.painel.delete(id);
      await carregarPaineis();
    } catch (error) {
      console.error('Erro ao excluir painel:', error);
      throw error;
    }
  }, [services, carregarPaineis])

  const atualizarPainel = useCallback(async (id, camposAtualizados) => {
    if (!services) return;

    try {
      const existente = await services.painel.findById(id);
      if (!existente) throw new Error('Painel não encontrado');
      const novosDados = { ...existente, ...camposAtualizados };
      const painel = new Painel(novosDados);
      await services.painel.update(id, painel);
      await carregarPaineis();
    } catch (error) {
      console.error('Erro ao atualizar painel:', error);
      throw error;
    }
  }, [services, carregarPaineis]);

  useEffect(() => {
    if (isReady) {
      carregarPaineis();
    }
  }, [isReady, carregarPaineis]);

  return {
    paineis,
    loading,
    criarPainel,
    excluirPainel,
    atualizarPainel,
    recarregar: carregarPaineis
  };
}

/**
 * Hook para gerenciar anotações
 */
export function useAnotacoes(painelId = null) {
  const { services, isReady } = useDatabase();
  const [anotacoes, setAnotacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarAnotacoes = useCallback(async () => {
    if (!services) {
      console.log('🔍 Services não disponível ainda');
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 Carregando anotações para painel:', painelId);
      
      const result = painelId 
        ? await services.anotacao.findByPainel(painelId)
        : await services.anotacao.findAllwithNoPanel();
        
      console.log('🔍 Anotações encontradas:', result);
      console.log('🔍 Quantidade de anotações:', result.length);
      
      setAnotacoes(result);
    } catch (error) {
      console.error('❌ Erro ao carregar anotações:', error);
    } finally {
      setLoading(false);
    }
  }, [services, painelId]);

  const criarAnotacao = useCallback(async (dadosAnotacao) => {
    if (!services) return;
    
    try {
      console.log('📝 Dados recebidos para criar anotação:', dadosAnotacao);
      
      // Criar instância da classe Anotacao
      const anotacao = new Anotacao(dadosAnotacao);
      
      console.log('🔍 Anotação criada:', anotacao);
      console.log('✅ Anotação válida?', anotacao.isValid());
      
      await services.anotacao.create(anotacao);
      await carregarAnotacoes();
    } catch (error) {
      console.error('Erro ao criar anotação:', error);
      throw error;
    }
  }, [services, carregarAnotacoes]);

  const marcarConcluida = useCallback(async (id) => {
    if (!services) return;
    
    try {
      await services.anotacao.marcarConcluida(id);
      await carregarAnotacoes();
    } catch (error) {
      console.error('Erro ao marcar como concluída:', error);
      throw error;
    }
  }, [services, carregarAnotacoes]);

  const excluirAnotacao = useCallback(async (id) => {
    if (!services) return;
    
    try {
      await services.anotacao.delete(id);
      await carregarAnotacoes();
    } catch (error) {
      console.error('Erro ao excluir anotação:', error);
      throw error;
    }
  }, [services, carregarAnotacoes]);

  const atualizarAnotacao = useCallback(async (id, anotAtualizada) => {
    if (!services) return;

    try {
      await services.anotacao.update(id, anotAtualizada);
      await carregarAnotacoes();
    } catch (error) {
      console.error('Erro ao atualizar anotação:', error);
      throw error;
    }
  }, [services, carregarAnotacoes]);

  const atualizarAnotacaoSemCarregar = useCallback(async (id, anotAtualizada) => {
    if (!services) return;

    try {
      await services.anotacao.update(id, anotAtualizada);
      console.log("atualizado sem recarregar");
    } catch (error) {
      console.error('Erro ao atualizar anotação:', error);
      throw error;
    }
  }, [services]);

  useEffect(() => {
    console.log('🔍 useEffect useAnotacoes executado');
    console.log('🔍 isReady:', isReady);
    console.log('🔍 painelId:', painelId);
    
    if (isReady) {
      console.log('🔍 Chamando carregarAnotacoes...');
      carregarAnotacoes();
    }
  }, [isReady, carregarAnotacoes]);

  return {
    anotacoes,
    loading,
    criarAnotacao,
    marcarConcluida,
    excluirAnotacao,
    atualizarAnotacao,
    atualizarAnotacaoSemCarregar,
    recarregarAnotacoes: carregarAnotacoes
  };
}

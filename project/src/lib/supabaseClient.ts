import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e chave anônima são necessárias. Por favor, clique no botão "Connect to Supabase" no canto superior direito.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para testar a conexão
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao conectar com Supabase:', error);
    return false;
  }
}
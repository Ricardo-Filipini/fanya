/*
  # Criar tabelas para histórico de chat

  1. Novas Tabelas
    - `conversations`
      - `id` (uuid, chave primária)
      - `user_id` (uuid, referência ao usuário)
      - `title` (texto, título da conversa)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `messages`
      - `id` (uuid, chave primária)
      - `conversation_id` (uuid, referência à conversa)
      - `role` (texto, 'user' ou 'assistant')
      - `content` (texto, conteúdo da mensagem)
      - `created_at` (timestamp)

  2. Segurança
    - RLS habilitado em ambas as tabelas
    - Políticas para usuários autenticados
*/

CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ler suas próprias conversas"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias conversas"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem ler mensagens de suas conversas"
  ON messages
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_id
    AND conversations.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem inserir mensagens em suas conversas"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_id
    AND conversations.user_id = auth.uid()
  ));
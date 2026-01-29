# 🎬 Lifestyle Viral Planner

**Plataforma completa para planejamento e criação de conteúdo viral cinematográfico com banco de dados na nuvem.**

> 🚀 **Novidade**: Agora com integração Supabase! Seus dados sincronizam automaticamente entre dispositivos.

## 🚀 Funcionalidades

### ✅ Gestão de Vídeos
- **Grid View & Kanban Board** - Visualize seus vídeos em grid ou arraste entre status no Kanban
- **6 Status de Workflow** - Ideia → Roteirizando → Takes Gravados → Editando → Agendado → Publicado
- **Sistema de Cores Inteligente**:
  - 🟢 Verde: Publicado
  - 🟡 Amarelo: Em processo
  - 🔴 Vermelho: Atrasado (passou da data)
- **Sincronização em Tempo Real** - Mudanças aparecem instantaneamente em todos os dispositivos

### 🤖 Agent IA - Gerador de Prompts
- Gera **3 variações completas** de roteiro viral
- Formato "Strict Mode" otimizado para ChatGPT
- Saída inclui:
  - Tabela beat-by-beat (timing musical)
  - Checklist de takes necessários
  - Legendas e hashtags em camadas
  - Micro-arco narrativo completo

### 📊 Dashboard & Métricas
- Contador de vídeos totais, semanais, ideias e publicados
- Barra de progresso semanal com meta configurável
- Filtros avançados (status, gancho, estilo, semana)

### 📚 Guia do Criador Interativo
- **5 Seções Navegáveis**:
  1. 🏠 Início - Quick Start Guide
  2. 🎣 Ganchos - 6 tipos explicados com exemplos
  3. 🎨 Estilos Visuais - Estéticas cinematográficas
  4. 🎵 Vibe Musical - Como escolher a música certa
  5. 🤖 Agent IA - Como usar o gerador de prompts

## 🎨 Tecnologias

- **Frontend**: HTML5, TailwindCSS, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL)
- **Estética**: Glassmorphism, Dark Mode, Animações CSS
- **Hospedagem**: Netlify / Vercel
- **Tipografia**: Inter + Space Mono

## 📁 Estrutura de Arquivos

```
App - Lifestyle Viral/
├── index.html          # Estrutura principal
├── app.js              # Lógica da aplicação
├── style.css           # Estilos customizados
├── supabase_sdk.js     # SDK Supabase (cloud database)
├── config.js           # Configuração de credenciais
├── schema.sql          # Schema do banco de dados
├── package.json        # Dependências do projeto
├── netlify.toml        # Configuração Netlify
├── vercel.json         # Configuração Vercel
├── DEPLOYMENT.md       # Guia de deploy completo
└── README.md           # Este arquivo
```

## 🚀 Quick Start

### Opção 1: Usar Localmente (sem banco de dados)

1. Abra `index.html` no navegador
2. Os dados serão salvos apenas localmente (não sincronizam)

### Opção 2: Deploy com Supabase (Recomendado)

**Siga o guia completo em [`DEPLOYMENT.md`](./DEPLOYMENT.md)**

Resumo rápido:
1. Crie conta gratuita no [Supabase](https://supabase.com)
2. Crie novo projeto
3. Execute o `schema.sql` no SQL Editor
4. Copie suas credenciais (URL + anon key)
5. Atualize `config.js` com suas credenciais
6. Deploy no [Netlify](https://netlify.com) ou [Vercel](https://vercel.com)

**Tempo estimado**: 15-20 minutos

## 📖 Como Usar

1. **Crie um vídeo**: Clique em "+ NOVO VÍDEO"
2. **Preencha os campos**:
   - Informações básicas (título, data, status)
   - Estratégia viral (gancho, estilo, música)
   - Conceito criativo
3. **Gere o prompt**: Clique em "GERAR PROMPT (3 VARIAÇÕES)"
4. **Copie e cole no ChatGPT**: Use o botão "COPIAR"
5. **Gerencie no Kanban**: Arraste cards entre colunas
6. **Acesse de qualquer lugar**: Seus dados sincronizam automaticamente

## 🎯 Workflow Recomendado

1. **Ideia** - Capture insights do dia a dia
2. **Roteirizando** - Use o Agent IA para gerar 3 variações
3. **Takes Gravados** - Filme seguindo o checklist
4. **Editando** - Cortes na batida, textos curtos
5. **Agendado** - Pronto para publicar
6. **Publicado** - Analise resultados

## 🎨 Tipos de Gancho Disponíveis

- **Curiosidade** - Lacuna de conhecimento
- **Pattern Interrupt** - Quebra visual/sonora
- **Dor/Desejo** - Toca na frustração ou sonho
- **Visual Impactante** - Estética pura
- **Pergunta Direta** - Engajamento imediato
- **Afirmação Polêmica** - Polariza opiniões

## 🎬 Estilos Visuais

- Slow Living
- Cinematic Travel
- Urbano Dinâmico
- Golden Hour
- Minimalista
- Energético / Esportivo

## 🎵 Vibes Musicais

- Lo-fi / Calma
- Pop Inspirador
- Eletrônica Suave
- Épica / Orquestral
- Trend Viral

## 💡 Dicas de Uso

- **Meta Semanal**: Configure sua meta (padrão: 4 vídeos/semana)
- **Filtros**: Use "SÓ ESTA SEMANA" para focar no curto prazo
- **Drag & Drop**: Arraste cards no Kanban para mudar status rapidamente
- **Conceito Claro**: Quanto mais detalhado o conceito, melhor o prompt gerado
- **Multi-Dispositivo**: Acesse do celular, tablet ou computador - tudo sincroniza!

## 🔐 Segurança & Privacidade

- Seus dados são armazenados no Supabase (servidores seguros)
- Credenciais públicas (`anon key`) têm permissões limitadas
- Para uso pessoal, não precisa de autenticação
- Para uso multi-usuário, veja seção de autenticação em `DEPLOYMENT.md`

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar servidor local
npm run dev

# Abrir no navegador
# http://localhost:3000
```

## 🔮 Roadmap Futuro

- [x] Backend real (Supabase) ✅
- [x] Deploy em produção (Netlify/Vercel) ✅
- [ ] Sistema de autenticação multi-usuário
- [ ] Planos Free/Pro/Creator
- [ ] Integração com APIs do Instagram/TikTok
- [ ] Templates de roteiro pré-definidos
- [ ] Análise de performance de vídeos
- [ ] App mobile nativo (React Native)

## 📝 Notas de Desenvolvimento

**Versão Atual**: 2.0.0  
**Última Atualização**: 27/01/2026  
**Status**: Produção - Integração Supabase completa ✅

### Changelog

**v2.0.0** (27/01/2026)
- ✅ Integração completa com Supabase
- ✅ Sincronização em tempo real
- ✅ Deploy para Netlify/Vercel
- ✅ Guia de deployment completo

**v1.0.0** (22/01/2026)
- ✅ MVP completo com localStorage
- ✅ Agent IA gerador de prompts
- ✅ Kanban drag-and-drop
- ✅ Guia do Criador interativo

## 🆘 Suporte

- **Problemas de Deploy**: Veja [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- **Erros no App**: Abra o console do navegador (F12)
- **Dúvidas sobre Supabase**: [Documentação Supabase](https://supabase.com/docs)

---

**Desenvolvido para criadores de conteúdo que levam a sério a arte do viral cinematográfico.** 🎥✨

**Agora com banco de dados na nuvem - Acesse de qualquer lugar!** ☁️🚀


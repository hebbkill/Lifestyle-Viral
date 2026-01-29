# 🚀 Deploy Rápido na Vercel

Guia simplificado para fazer deploy do Lifestyle Viral Planner na Vercel.

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de que:

- [x] Seu código está no GitHub
- [x] Você tem uma conta na [Vercel](https://vercel.com) (gratuita)
- [x] Supabase está configurado (credenciais em `config.js`)

---

## 📦 Passo a Passo

### 1. Acesse a Vercel

1. Vá para [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"** ou **"Login"**
3. Escolha **"Continue with GitHub"** para conectar sua conta

### 2. Importe o Projeto

1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Você verá uma lista dos seus repositórios do GitHub
3. Encontre **"Lifestyle-Viral"** e clique em **"Import"**

### 3. Configure o Deploy

Na tela de configuração:

**Framework Preset:**
- Selecione: **"Other"** (é um site estático)

**Build Settings:**
- **Build Command**: `npm run build` (ou deixe vazio)
- **Output Directory**: `.` (ponto - diretório raiz)
- **Install Command**: `npm install`

**Root Directory:**
- Deixe em branco (usa a raiz do repositório)

> [!TIP]
> A Vercel detectará automaticamente o `vercel.json` e usará as configurações dele!

### 4. Deploy!

1. Clique em **"Deploy"**
2. Aguarde 1-2 minutos enquanto a Vercel:
   - Instala dependências
   - Faz build do projeto
   - Publica seu site

3. Quando aparecer 🎉 **"Congratulations!"**, seu site está no ar!

### 5. Acesse Seu App

1. Clique no botão **"Visit"** ou copie a URL
2. Sua URL será algo como: `https://lifestyle-viral-xxx.vercel.app`
3. Teste o app:
   - ✅ Criar um vídeo
   - ✅ Editar informações
   - ✅ Mudar status no Kanban
   - ✅ Verificar se salva no Supabase

---

## 🔧 Configurações Adicionais

### Domínio Personalizado (Opcional)

1. No dashboard do projeto, vá em **"Settings"** → **"Domains"**
2. Clique em **"Add"**
3. Digite seu domínio (ex: `meuapp.com`)
4. Siga as instruções para configurar DNS

### Variáveis de Ambiente (Não Necessário)

> [!NOTE]
> Como este é um site estático, as credenciais do Supabase já estão no `config.js`. Não é necessário configurar variáveis de ambiente na Vercel.

### Deploy Automático

A Vercel já configurou deploy automático! 🎉

- Toda vez que você fizer `git push` para a branch `main`
- A Vercel automaticamente faz um novo deploy
- Você receberá notificações por email

---

## ✅ Verificação

### Checklist Pós-Deploy

Teste estas funcionalidades no seu app publicado:

- [ ] App carrega sem erros
- [ ] Criar novo vídeo funciona
- [ ] Editar vídeo funciona
- [ ] Kanban drag-and-drop funciona
- [ ] Deletar vídeo funciona
- [ ] Configurações salvam
- [ ] Dados aparecem no Supabase Table Editor

### Teste Multi-Dispositivo

1. Abra o app no computador
2. Crie um vídeo
3. Abra o app no celular (mesma URL)
4. O vídeo deve aparecer automaticamente! ✨

---

## 🐛 Troubleshooting

### Deploy Falhou

**Erro**: Build failed

**Solução**:
1. Verifique os logs de build na Vercel
2. Certifique-se de que `package.json` está correto
3. Tente fazer build local: `npm install && npm run build`

### App Não Carrega

**Erro**: Página em branco ou erro 404

**Solução**:
1. Verifique se `vercel.json` está no repositório
2. Confirme que `index.html` está na raiz do projeto
3. Limpe cache do navegador (Ctrl+Shift+R)

### Dados Não Salvam

**Erro**: Vídeos não aparecem no Supabase

**Solução**:
1. Abra o Console do navegador (F12)
2. Procure por erros relacionados ao Supabase
3. Verifique se as credenciais em `config.js` estão corretas
4. Confirme que o schema SQL foi executado no Supabase

### CORS Error

**Erro**: `Access-Control-Allow-Origin` error

**Solução**:
1. Vá para Supabase Dashboard → Settings → API
2. Em **"API Settings"**, adicione sua URL da Vercel em **"Site URL"**
3. Exemplo: `https://lifestyle-viral-xxx.vercel.app`

---

## 🎯 Próximos Passos

Agora que seu app está no ar:

1. **Adicione ao Home Screen** (mobile):
   - No celular, abra o app
   - Toque em "Adicionar à Tela Inicial"
   - Funciona como um app nativo! 📱

2. **Compartilhe a URL**:
   - Envie para amigos/clientes
   - Adicione ao seu portfólio
   - Use em qualquer dispositivo

3. **Monitore Performance**:
   - Dashboard Vercel → Analytics
   - Veja quantas pessoas acessam
   - Monitore tempo de carregamento

---

## 📊 Recursos da Vercel

### Dashboard do Projeto

- **Deployments**: Histórico de todos os deploys
- **Analytics**: Estatísticas de uso (plano Pro)
- **Logs**: Logs em tempo real
- **Settings**: Configurações do projeto

### Plano Gratuito Inclui

- ✅ Deploy ilimitado
- ✅ 100GB de largura de banda/mês
- ✅ HTTPS automático
- ✅ Deploy automático do GitHub
- ✅ Preview de Pull Requests

---

## 💡 Dicas Pro

### Preview Deploys

Quando você criar uma Pull Request no GitHub:
- Vercel cria um deploy de preview automaticamente
- Você pode testar mudanças antes de fazer merge
- URL única para cada PR

### Rollback Rápido

Se algo der errado:
1. Vá em **"Deployments"**
2. Encontre o deploy anterior que funcionava
3. Clique nos três pontos → **"Promote to Production"**
4. Volta para a versão anterior instantaneamente!

### Logs em Tempo Real

Para debugar problemas:
1. Dashboard → **"Deployments"** → Clique no deploy
2. Veja **"Build Logs"** para erros de build
3. Veja **"Function Logs"** para erros em runtime

---

## 🎉 Pronto!

Seu Lifestyle Viral Planner está agora rodando na Vercel com:

- ✅ Deploy automático
- ✅ HTTPS seguro
- ✅ CDN global (carregamento rápido)
- ✅ Integração com Supabase
- ✅ Sincronização em tempo real

**Sua URL**: Copie da Vercel e salve!

Comece a planejar conteúdo viral! 🚀

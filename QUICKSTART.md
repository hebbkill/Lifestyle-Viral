# 🚀 Quick Start - Supabase Integration

## Para começar AGORA (5 minutos):

### 1️⃣ Criar Conta Supabase
- Acesse: https://supabase.com
- Clique em "Start your project"
- Faça login com GitHub (mais rápido)

### 2️⃣ Criar Projeto
- Nome: `lifestyle-viral`
- Senha: Escolha uma forte (salve!)
- Região: South America (São Paulo)
- Clique "Create new project"
- ⏳ Aguarde 2-3 minutos

### 3️⃣ Criar Tabelas
- Menu lateral → **SQL Editor**
- Clique "New query"
- Abra o arquivo `schema.sql` deste projeto
- Copie TUDO e cole no editor
- Clique **"Run"** (ou Ctrl+Enter)
- ✅ Deve aparecer: "Success. No rows returned"

### 4️⃣ Pegar Credenciais
- Menu lateral → **Settings** (engrenagem)
- Clique **"API"**
- Copie:
  - **Project URL** (https://xxxxx.supabase.co)
  - **anon public** key (eyJhbGci...)

### 5️⃣ Configurar App
- Abra `config.js` no seu projeto
- Cole suas credenciais:

```javascript
window.ENV = {
    SUPABASE_URL: 'cole_seu_url_aqui',
    SUPABASE_ANON_KEY: 'cole_sua_key_aqui'
};
```

- Salve o arquivo

### 6️⃣ Testar Localmente
```bash
npm install
npm run dev
```

- Abra: http://localhost:3000
- Crie um vídeo de teste
- Vá no Supabase → Table Editor → videos
- ✅ Seu vídeo deve aparecer lá!

---

## Deploy Rápido (Netlify)

### Arrastar e Soltar:
1. Vá em: https://app.netlify.com/drop
2. Arraste a pasta do projeto
3. Pronto! Seu site está no ar 🎉

### URL será algo como:
`https://random-name-123.netlify.app`

---

## ✅ Checklist de Verificação

- [ ] Conta Supabase criada
- [ ] Projeto criado e inicializado
- [ ] Schema SQL executado com sucesso
- [ ] Credenciais copiadas
- [ ] `config.js` atualizado
- [ ] Teste local funcionando
- [ ] Deploy realizado
- [ ] App acessível pela internet

---

## 🆘 Problemas Comuns

### "Supabase configuration missing"
→ Verifique se `config.js` tem suas credenciais reais (não os placeholders)

### "Failed to fetch"
→ Verifique se o schema SQL foi executado corretamente

### Videos não aparecem
→ Abra o console (F12) e veja se há erros

---

## 📚 Guia Completo
Para instruções detalhadas, veja: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---

**Tempo total: ~15 minutos** ⏱️

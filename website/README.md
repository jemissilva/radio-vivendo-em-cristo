# Website - Rádio Web Igreja Vivendo em Cristo

Frontend público oficial da rádio, consumindo a API REST existente do projeto.

## Executar

```bash
cd website
npm install
npm run dev
```

## Configuração

Por padrão, o frontend consome `http://localhost:3001/api/public`.

Se necessário, defina:

```bash
VITE_API_BASE_URL=http://localhost:3001/api/public
```

## Deploy na Vercel

Este frontend foi preparado para deploy na Vercel com:

- **Root Directory:** `website`
- **Framework Preset:** `Vite`
- **Output Directory:** `dist`

Defina a variável abaixo no projeto da Vercel:

```bash
VITE_API_BASE_URL=https://SEU-BACKEND.onrender.com/api/public
```

O arquivo `website/.vercelignore` também foi adicionado para evitar envio de artefatos locais desnecessários.
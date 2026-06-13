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
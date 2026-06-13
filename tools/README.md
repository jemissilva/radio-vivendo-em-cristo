# Zara Radio Sync

## Requisitos

- Node.js instalado no Windows
- Zara Radio configurado para escrever o arquivo `CurrentSong.txt`
- Credenciais administrativas da API

## Configuração

Defina as variáveis de ambiente:

- `ZARA_FILE_PATH`: caminho completo do `CurrentSong.txt`
- `API_URL`: URL base da API admin, por exemplo `https://radio-vivendo-em-cristo.onrender.com/api/admin`
- `ADMIN_EMAIL`: e-mail do admin
- `ADMIN_PASSWORD`: senha do admin

## Execução

```bash
node tools/zara-sync.js
```

O script monitora alterações no `CurrentSong.txt`, autentica automaticamente, envia a faixa atual para `PUT /api/admin/live` e registra o status no console.
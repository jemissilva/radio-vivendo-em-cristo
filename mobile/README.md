# App Android - Rádio Igreja Vivendo em Cristo

Aplicativo mobile completo em Expo/React Native criado na pasta `mobile`.

## Recursos

- player ao vivo com play/pause e fallback;
- home com destaques, programação e ações rápidas;
- catálogo de programas, conteúdos e eventos;
- envio de pedido de oração e mensagem de contato;
- favoritos locais com `AsyncStorage`;
- configuração centralizada para apontar para a API existente.

## Executar

```bash
npm install
npm run dev
```

## Android

```bash
npm run android
```

## Configuração da API

Edite `src/config/app-config.ts` e ajuste `apiBaseUrl` e `streamUrl` conforme seu ambiente.
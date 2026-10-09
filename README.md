# Pulse Market

Painel de acompanhamento de criptoativos com atualizações em tempo real. O backend recebe os eventos públicos do mercado, valida e normaliza os dados e os distribui ao frontend por Socket.IO. A interface também consulta a API REST para obter o snapshot mais recente.

O projeto foi pensado como uma aplicação full-stack enxuta, com responsabilidades separadas, TypeScript e uma interface responsiva.

## Tecnologias

- **Frontend:** React, TypeScript e Vite
- **Backend:** Node.js, TypeScript e Express
- **Tempo real:** Socket.IO e WebSocket
- **Dados de mercado:** Binance Spot WebSocket Streams
- **Testes:** Node.js Test Runner
- **Deploy sugerido:** Render para a API e Vercel para o frontend

## Funcionalidades

- Acompanhamento de preços e variação percentual em 24 horas.
- Exibição de máxima, mínima e volume negociado em 24 horas.
- Busca por ativo e filtro de variações positivas.
- Atualização da interface sem recarregar a página.
- Indicador do estado da conexão e tentativa de reconexão do feed.
- API REST para consultar o snapshot e endpoint de health check.
- Layout responsivo para desktop e dispositivos móveis.

## Estrutura do repositório

```text
pulse-market/
├── client/                 # Aplicação React
│   └── src/
│       ├── components/     # Componentes visuais reutilizáveis
│       ├── hooks/          # Estado e ciclo de vida das conexões
│       ├── services/       # Comunicação com a API
│       └── types/          # Tipos do frontend
├── server/                 # API e integração com a fonte de dados
│   ├── src/
│   │   ├── config/         # Configurações do servidor
│   │   ├── routes/         # Endpoints HTTP
│   │   ├── services/       # Feed e cache de mercado
│   │   └── utils/          # Normalização e validação
│   └── test/               # Testes automatizados
├── package.json            # Scripts e workspaces
└── README.md
```

## Requisitos

- Node.js 20 ou superior (recomenda-se uma versão LTS compatível com o projeto).
- npm, incluído na instalação do Node.js.
- Git.

## Instalação e execução local

### 1. Obter o código

Se estiver clonando o repositório do GitHub:

```bash
git clone https://github.com/SEU-USUARIO/pulse-market.git
cd pulse-market
```

Troque `SEU-USUARIO` pelo nome da sua conta. Se você já baixou o ZIP do projeto, extraia-o e abra um terminal na pasta `pulse-market`.

### 2. Instalar as dependências

Execute na raiz do repositório, onde está o `package.json` principal:

```bash
npm install
```

### 3. Criar os arquivos de ambiente

Os arquivos `.env.example` são modelos versionados. Crie os arquivos locais a partir deles; não envie os `.env` reais para o GitHub.

#### Ubuntu, Linux e macOS

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

#### Windows PowerShell

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Se o terminal informar que os arquivos já existem, confira seu conteúdo antes de sobrescrevê-los. Os valores padrão dos arquivos de exemplo devem ser suficientes para começar em desenvolvimento, salvo indicação diferente no próprio arquivo.

### 4. Iniciar a aplicação

Na raiz do projeto:

```bash
npm run dev
```

Por padrão, o frontend fica em `http://localhost:5173` e a API em `http://localhost:3001`. Mantenha o terminal aberto enquanto estiver desenvolvendo.

O frontend utiliza o proxy do Vite durante o desenvolvimento. Para a publicação, configure `VITE_API_URL` com a URL pública da API, conforme descrito na seção de deploy.

## Scripts de qualidade

Execute os comandos a partir da raiz do repositório:

```bash
npm test
npm run typecheck
npm run build
```

- `npm test`: executa os testes automatizados.
- `npm run typecheck`: verifica os tipos TypeScript.
- `npm run build`: compila o backend e gera os arquivos de produção do frontend.

Antes de publicar, confirme que os três comandos terminam sem erros. Se algum falhar, investigue a saída do terminal e corrija o problema antes de prosseguir.

## API HTTP

### `GET /api/markets`

Retorna o snapshot de mercado mais recente. Durante a inicialização ou antes de receber dados da fonte externa, a lista pode estar vazia.

Exemplo ilustrativo de resposta:

```json
{
  "data": [
    {
      "symbol": "BTCUSDT",
      "baseAsset": "BTC",
      "quoteAsset": "USDT",
      "price": 67500.12,
      "changePercent": 2.34,
      "high24h": 68000,
      "low24h": 65000,
      "quoteVolume": 123456789,
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "meta": { "count": 1, "source": "binance" }
}
```

Os valores acima são exemplos, não representam cotações atuais.

### `GET /api/health`

Informa o estado do serviço e da conexão com a fonte de dados. Consulte a resposta e o status HTTP para verificar a disponibilidade.

## Eventos em tempo real

| Evento | Direção | Finalidade |
| --- | --- | --- |
| `market:snapshot` | Servidor → cliente | Envia o snapshot inicial ao conectar |
| `market:update` | Servidor → cliente | Informa atualização de um ativo |
| `feed:status` | Servidor → cliente | Comunica o estado do feed externo |

## Deploy

O deploy pode ser conectado ao GitHub para que novos commits na branch configurada iniciem uma nova publicação. Os nomes dos serviços, limites e condições dos planos gratuitos podem mudar; confira as configurações atuais dos provedores antes de publicar.

### Backend — Render

1. Envie o repositório para o GitHub e conecte-o ao Render.
2. Crie um **Web Service** com a branch `main`.
3. Mantenha o diretório raiz do repositório como diretório de trabalho, pois os comandos abaixo usam os npm workspaces.
4. Configure o comando de build:

   ```bash
   npm install && npm --workspace server run build
   ```

5. Configure o comando de inicialização:

   ```bash
   npm --workspace server run start
   ```

6. Configure as variáveis de ambiente:

   - `NODE_ENV=production`
   - `CLIENT_ORIGIN=https://URL-PUBLICA-DO-FRONTEND`

   O Render fornece a variável `PORT` ao serviço; o servidor deve escutá-la. Não fixe uma porta de produção no código.

7. Após o deploy, teste `https://SUA-API.onrender.com/api/health` e `https://SUA-API.onrender.com/api/markets` usando o domínio real fornecido pelo Render.

### Frontend — Vercel

1. Importe o mesmo repositório na Vercel.
2. Configure o projeto para executar os comandos a partir da raiz do repositório.
3. Comando de build:

   ```bash
   npm install && npm --workspace client run build
   ```

4. Diretório de saída: `client/dist`.
5. Configure a variável de ambiente `VITE_API_URL` com a URL pública do backend, sem `/api` no final e sem barra final. Exemplo: `https://sua-api.onrender.com`.
6. Depois que a Vercel fornecer a URL final do site, atualize `CLIENT_ORIGIN` no Render para essa origem exata e faça novo deploy da API.

`VITE_API_URL` é incorporada ao frontend durante o build. Se alterá-la, é necessário gerar um novo deploy do frontend. Não coloque senhas, tokens ou segredos em variáveis com prefixo `VITE_`, pois elas podem ficar visíveis no navegador.

## Decisões técnicas e limites

- O backend mantém a conexão com a fonte externa e distribui os eventos aos clientes conectados.
- O snapshot mais recente é mantido em memória; não há persistência de histórico.
- Eventos recebidos da fonte externa são validados antes de serem distribuídos.
- O feed pode ficar indisponível ou sofrer atrasos por condições externas ou limites do provedor.
- O projeto não executa ordens de compra ou venda e não oferece recomendações financeiras.
- Para uma operação com maior volume, considere logs estruturados, métricas, testes de integração em CI, limitação de conexões e cache compartilhado.

## Segurança do repositório

- Não versione arquivos `.env` com configurações locais.
- Mantenha os arquivos `.env.example` sem credenciais ou segredos.
- Revise `git status` antes de cada commit.
- Não exponha tokens, senhas ou chaves privadas em logs, commits ou documentação.

## Licença

Distribuído sob a licença MIT. Consulte o arquivo `LICENSE`.

# MedLocaliza API

API REST do [MedLocaliza](https://github.com/kaua698/medlocaliza-app), responsável pelas **contas de usuário** e pelo **histórico de buscas** de medicamentos.

A consulta de estoque é feita pelo app diretamente no portal Dados Recife; esta API cuida apenas do que é do usuário.

---

## Tecnologias

- **Node.js** + **Express 4**
- **TypeScript**
- **lowdb** — banco de dados em arquivo JSON
- **bcryptjs** — hash das senhas
- **jsonwebtoken** — autenticação com JWT
- **dotenv** — configuração por variáveis de ambiente

## Rotas

| Método | Rota | Autenticação | Body | Resposta |
|---|---|---|---|---|
| GET | `/` | Não | — | `200 { status: "ok" }` |
| POST | `/auth/cadastro` | Não | `{ nome, email, senha }` | `201 { token, usuario }` |
| POST | `/auth/login` | Não | `{ email, senha }` | `200 { token, usuario }` |
| POST | `/buscas` | Bearer token | `{ medicamento, latitude, longitude, distritoMaisProximo, quantidadeResultados }` | `201 { ...busca }` |
| GET | `/buscas` | Bearer token | — | `200 [ ...buscas ]` (mais recentes primeiro) |

`latitude`, `longitude` e `distritoMaisProximo` podem ser `null` quando o usuário não libera a localização.

Erros sempre respondem em JSON no formato `{ "error": "mensagem" }`:

| Status | Quando |
|---|---|
| 400 | Campo inválido ou JSON malformado |
| 401 | Token ausente, inválido ou expirado; email ou senha incorretos |
| 404 | Rota inexistente |
| 409 | Email já cadastrado |

## Segurança

- Senhas guardadas apenas como **hash bcrypt**, nunca em texto
- Emails normalizados (sem espaços e em minúsculas) para evitar contas duplicadas
- Login com a mesma mensagem para email inexistente e senha errada
- Tokens JWT com validade de **30 dias**
- O servidor não inicia sem `JWT_SECRET` definido
- Cada usuário só acessa o próprio histórico

## Modelo de dados

```ts
Usuario { id, nome, email, senhaHash }
Busca   { id, usuarioId, medicamento, latitude, longitude, distritoMaisProximo, quantidadeResultados, timestamp }
```

Cada busca pertence a um usuário pelo campo `usuarioId`, preenchido a partir do token.

## Como rodar

**Pré-requisito:** Node.js 20.19 ou superior.

```bash
git clone https://github.com/kaua698/medlocaliza-api.git
cd medlocaliza-api
npm install
cp .env.example .env    # defina JWT_SECRET
npm run dev
```

A API sobe em `http://localhost:3333` e também fica acessível na rede local, para o app rodar no celular físico. O arquivo `db.json` é criado automaticamente na primeira gravação.

| Script | O que faz |
|---|---|
| `npm run dev` | Desenvolvimento com recarga automática |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Executa a versão compilada |

## Estrutura

```
src/
├── index.ts             Servidor, rotas e tratamento de erros
├── config.ts            Variáveis de ambiente
├── db.ts                Conexão com o lowdb
├── types.ts             Tipos Usuario e Busca
├── middlewares/
│   ├── auth.ts          Validação do JWT
│   └── validate.ts      Validação dos bodies
├── routes/
│   ├── auth.ts          Cadastro e login
│   └── buscas.ts        Histórico de buscas
└── utils/
    └── hash.ts          Hash e comparação de senhas
```

## Autor

Feito por **Kauã Oliveira Matos Borba** — [GitHub](https://github.com/kaua698) · [LinkedIn](https://www.linkedin.com/in/kau%C3%A3-oliveira-9212153a9/)

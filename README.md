# MedLocaliza API

Backend de autenticação e histórico de buscas de medicamentos com localização.

---

## Modelo de dados

- **Usuário → buscas**: cada busca pertence a um usuário autenticado via **JWT**.
- A relação é mantida no banco (`lowdb`) usando `usuarioId` nas rotas autenticadas.

---

## Rotas

| Método | Rota | Autenticação | Body esperado | Resposta de sucesso |
|---|---|---|---|---|
| POST | `/auth/cadastro` | Não | `{ nome, email, senha }` | `201 { token, usuario }` |
| POST | `/auth/login` | Não | `{ email, senha }` | `200 { token, usuario }` |
| POST | `/buscas` | Sim (JWT) | `{ medicamento, latitude, longitude, distritoMaisProximo, quantidadeResultados }` | `201 { ...registro }` (inclui `timestamp`) |
| GET | `/buscas` | Sim (JWT) | — | `200 [ { ...busca, timestamp } ]` |

---

## Como rodar localmente

1. Clonar o repositório:

   ```bash
git clone https://github.com/SEU_USUARIO/medlocaliza-api
   cd medlocaliza-api
   ```

2. Instalar dependências:

   ```bash
   npm install
   ```

3. Configurar variáveis de ambiente:
   - Copie `medlocaliza-api/.env.example` para `medlocaliza-api/.env`.

4. Iniciar o servidor:

   ```bash
   npm run dev
   ```

---

## Stack

- Node.js
- Express 4
- TypeScript
- lowdb
- bcryptjs
- jsonwebtoken

---

## Autor

Kauã Oliveira Matos Borba



---

# 2️⃣ README.pt-BR.md (Português)

```md
<p align="right">
  <a href="./README.md">🇺🇸 English</a>
</p>

# MoneyIO Lite

O **MoneyIO Lite** é um dashboard financeiro pessoal desenvolvido como um MVP, com foco em **qualidade de arquitetura, decisões de UX e pensamento de produto**, simulando um SaaS real desde a concepção até o refinamento visual.

## 🔹 Visão Geral

A aplicação permite registrar **entradas e despesas**, categorizá-las, visualizar **indicadores financeiros**, acompanhar o fluxo diário e analisar despesas por categoria, tudo com persistência local e uma interface limpa e profissional.

Além da funcionalidade, o projeto prioriza:
- decisões conscientes de UX
- consistência visual
- boas práticas modernas de front-end
- código legível e sustentável

> **Versão atual:** v1.0.0 (MVP)

---

## 🚀 Funcionalidades

- ✅ CRUD completo de transações (entradas e despesas)
- ✅ Categorias personalizadas
- ✅ Persistência local (localStorage)
- ✅ Cards de indicadores financeiros
- ✅ Gráfico de despesas por categoria (Top 5 + Outros)
- ✅ Gráfico diário de Entradas x Saídas
- ✅ Filtro por mês e busca textual
- ✅ Exportação de CSV
- ✅ Reset de dados (modo demo)
- ✅ Empty states pensados para UX
- ✅ Identidade visual própria (logo + favicon)

---

## 🧠 Decisões de Produto e UX

- **Conceito “no azul” (contexto brasileiro)**  
  Entradas e saldo positivo utilizam azul, refletindo a associação cultural brasileira de contas em dia.

- **Top 5 + Outros nas categorias**  
  Evita poluição visual e mantém leitura clara, mesmo com muitas categorias.

- **Layout estável de dashboard**  
  Altura fixa nos cards evita quebra do grid conforme o volume de dados varia.

- **Formulários com UX aprimorada**  
  Campo de valor com máscara monetária em tempo real e validação robusta.

- **Sem uso de templates pesados**  
  A interface foi construída de forma incremental para manter controle total sobre UI e arquitetura.

---

## 🛠️ Stack Tecnológica

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Zustand**
- **React Hook Form + Zod**
- **Recharts**

---

## 📂 Arquitetura

```text
src/
 ├─ modules/
 │   └─ transactions/
 │       ├─ components/
 │       ├─ pages/
 │       ├─ store/
 │       └─ utils/
 ├─ shared/
 ├─ App.tsx
 └─ index.css
 ```

Preparada para futuras evoluções como backend real, autenticação e múltiplos usuários.

---

## ▶️ Como rodar o projeto

```bash
npm install
npm run dev
```

This structure supports future evolution such as authentication, backend integration, and multi-user support.

---

## 👤 Autor

Walther Fornaciari Neto  
Gerente de Projetos Sênior / Desenvolvedor Full-Stack Sênior / Tech & Product  
Focado em produtos digitais, UX, e engenharia sustentável.

---

## 🧪 Observação

Este projeto foi desenvolvido como portfólio, simulando decisões reais de produto e engenharia.

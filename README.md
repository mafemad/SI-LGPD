# Projeto: Aplicativos Demonstrativos da LGPD

## Introdução
Este projeto consiste no desenvolvimento de quatro aplicativos web para demonstrar na prática conceitos fundamentais da Lei Geral de Proteção de Dados (LGPD). O foco está em funcionalidades essenciais, com implementação simples e objetiva, utilizando **React para o frontend** e **NestJS para o backend**. O armazenamento de dados será feito em **PostgreSQL ou MongoDB**, dependendo da necessidade de cada aplicação.

## Objetivos Gerais
Cada aplicativo tem como objetivo educar e demonstrar, de forma prática, como a LGPD impacta o tratamento de dados dos usuários. Os temas abordados são:

1. **Portabilidade de Dados** - Permitir que o usuário visualize e exporte seus dados.
2. **Opt-in / Opt-out** - Demonstrar como um usuário pode conceder e revogar permissões para comunicações.
3. **Transparência de Dados** - Exibir os dados coletados e como eles são utilizados.
4. **Notificação** - Notificar o usuário em caso de uso indevido ou vazamento de dados.

---

## Aplicativos e Funcionalidades

### 1. Portabilidade de Dados
**Nome:** "Meu Histórico de Dados"

**Objetivo:** Demonstrar o direito à portabilidade de dados, permitindo que os usuários baixem suas informações em diferentes formatos.

**Funcionalidades:**
- Exibir os dados armazenados do usuário (exemplo: nome, e-mail, histórico de compras).
- Botão para exportar os dados em **JSON** ou **CSV**.
- Opção de **download direto** ou **envio por e-mail**.
- Registro das exportações feitas para consulta futura.

**Tecnologia:**
- **Frontend:** React (com Axios para comunicação com a API).
- **Backend:** NestJS com PostgreSQL ou MongoDB.
- **Exportação:** JSON e CSV.

---

### 2. Opt-in / Opt-out
**Nome:** "Preferências de Comunicação"

**Objetivo:** Demonstrar como o usuário pode gerenciar suas permissões de comunicação com uma empresa.

**Funcionalidades:**
- Tela com opções de comunicação (notificações push, e-mails promocionais, SMS).
- Botões para **ativar (opt-in)** e **desativar (opt-out)** cada opção.
- Armazenamento das preferências do usuário no banco de dados.
- Mensagem de confirmação ao modificar uma configuração.

**Tecnologia:**
- **Frontend:** React.
- **Backend:** NestJS com PostgreSQL/MongoDB para salvar preferências.

---

### 3. Transparência de Dados
**Nome:** "Seus Dados na Nossa Empresa"

**Objetivo:** Exibir ao usuário quais dados a empresa armazena e como são utilizados.

**Funcionalidades:**
- Tela que **lista os dados coletados** e a finalidade de cada um.
- Botão "Saiba mais" que exibe **detalhes sobre o uso de cada dado**.
- Opção para **atualizar ou corrigir informações pessoais**.

**Tecnologia:**
- **Frontend:** React.
- **Backend:** NestJS com PostgreSQL/MongoDB para armazenar os dados.

---

### 4. Notificação
**Nome:** "Aviso de Dados"

**Objetivo:** Demonstrar como notificar um usuário em caso de vazamento ou uso indevido de seus dados.

**Funcionalidades:**
- Simulação de um **alerta ao usuário** em caso de suspeita de violação de dados.
- Histórico de notificações enviadas.
- Configuração do **canal de notificação** (e-mail, SMS, push notification).

**Tecnologia:**
- **Frontend:** React.
- **Backend:** NestJS com PostgreSQL/MongoDB para registrar notificações.

---

## Justificativa Tecnológica
As escolhas tecnológicas foram feitas com base nos seguintes critérios:
- **React (Frontend)**: Framework moderno, eficiente e amplamente utilizado para aplicações web.
- **NestJS (Backend)**: Estruturado, escalável e compatível com padrões modernos de desenvolvimento backend.
- **PostgreSQL / MongoDB (Banco de Dados)**: Flexibilidade para armazenar tanto dados relacionais quanto documentos JSON.
- **Axios (Comunicação API)**: Biblioteca simples para chamadas HTTP entre frontend e backend.

## Conclusão
Este projeto visa demonstrar, de forma prática, como as diretrizes da LGPD impactam a relação entre usuários e empresas no tratamento de dados. A simplicidade na implementação garante que o foco esteja na funcionalidade e na experiência do usuário.

---

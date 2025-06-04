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

# 3. Transparência de Dados
  A Transparência de dados, conforme a Lei Geral de Proteção de Dados (LGPD), é o princípio que garante aos usuários o direito de saber, de forma clara, quais os seus dados pessoais estão sendo coletados, armazenados, utilizados e protegidos pelo sistema. Esse princípio foi exemplificado no projeto através das seguintes implementações:

## Tela de Login com segurança reforçada

- Exigência de senhas fortes.
- Implementação do **bcrypt**, onde as senhas originais fornecidas pelos usuários não são armazenadas em texto plano, pois antes de serem salvas no banco de dados, elas passam por um processo de hashing (onde a senha é transformada em uma sequência de caracteres de comprimento fixo) além de se adicionar um salt aleatório (acrescenta aleatoriamente sequências de caracteres a senha), aumentando a segurança.
- Implementação do **JWT (JSON Web Token)** , onde após um Login com sucesso é gerado um token e somente a partir da validação desse token é possível ter a autorização para a visualizar e alterar as informações do usuário que está logado.
- Garante ao usuário que somente ele pode acessar e controlar seus dados.

## Criação de Usuário 

- O sistema solicita de forma explícita dados como nome, e-mail, idade, CPF, endereço e senha. Assim o usuário sabe exatamente quais informações está fornecendo para o sistema.

## Listagem de Dados

- Após autenticado, o usuário pode acessar uma tela que exibe de forma explícita todos os seus dados armazenados, atendendo ao direito de acesso e visualização de informações.

## Edição de Dados

- O sistema oferece a possibilidade do usuário atualizar ou corrigir seus dados garantindo que ele tenha controle sobre as informações que o sistema possui a seu respeito.





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

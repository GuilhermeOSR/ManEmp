# Projeto de Edição de Funcionários

![MANEMP](https://ibb.co/RStGBVp)

## Descrição

Este projeto é uma aplicação React que permite editar dados de funcionários em uma base de dados do Firebase. Ele oferece funcionalidades para atualizar informações, carregar uma foto de perfil, e gerar um PDF com os dados do funcionário.

### Tecnologias Utilizadas

- **React** - Biblioteca para construção da interface de usuário.
- **TypeScript** - Adiciona tipagem estática ao código, ajudando a identificar erros durante o desenvolvimento e melhorando a manutenção do projeto.
- **Firebase** - Para gerenciar dados e fotos no Firestore e Firebase Storage.
- **Material-UI** - Biblioteca de componentes para UI com estilo.
- **react-pdf** - Para gerar PDFs com as informações do funcionário.
- **PDF-lib** - Para manipulação e personalização de PDFs.

## Funcionalidades

- **Edição de dados**: Atualiza informações como nome, e-mail, telefone, cargo e outros dados de um funcionário.
- **Upload de foto de perfil**: Permite a troca da foto de perfil do funcionário.
- **Geração de PDF**: Ao editar os dados, é possível gerar um PDF com as informações atualizadas do funcionário.
- **Histórico de mudanças**: Registra todas as alterações feitas nos dados de um funcionário.

## Como Rodar o Projeto

### Requisitos

1. **Node.js** (recomendado versão >= 16.x)
2. **Firebase** (é necessário configurar a autenticação e banco de dados Firebase)

### Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/seuusuario/seuprojeto.git
   cd seuprojeto
   npm install

2. Configure seu firebase no projeto. Crie um arquivo .env com as credenciais do Firebase (referente ao seu projeto no Firebase console):
     ```bash
    REACT_APP_FIREBASE_API_KEY=your-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
    REACT_APP_FIREBASE_PROJECT_ID=your-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
    REACT_APP_FIREBASE_APP_ID=your-app-id
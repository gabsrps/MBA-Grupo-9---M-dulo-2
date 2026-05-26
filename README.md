# Executando o Projeto VitalizIA do Google AI Studio

## 1. Instale as ferramentas necessárias

Você vai precisar de:

- Git  
- Node.js  

Links oficiais:

- https://git-scm.com
- https://nodejs.org

---

## 2. Verifique se está tudo instalado

Abra o terminal e execute:

```bash
git --version
node --version
npm --version
```

Se aparecerem as versões instaladas, está tudo certo.

---

## 3. Clone o projeto do GitHub

No terminal:

```bash
git clone URL_DO_REPOSITORIO
```

Exemplo:

```bash
git clone https://github.com/usuario/projeto.git
```

Entre na pasta do projeto:

```bash
cd projeto
```

---

## 4. Instale as dependências

Execute:

```bash
npm install
```

ou, caso o projeto utilize Yarn:

```bash
yarn
```

---

## 5. Configure a API Key do Google AI Studio

Acesse:

https://aistudio.google.com

Gere uma API Key.

---

## 6. Edite o arquivo `.env`

Na raiz do projeto, edite o arquivo .env adicionando:

```env
GOOGLE_API_KEY=sua_chave_aqui
```


## 7. Execute o projeto

Normalmente:

```bash
npm run dev
```

ou:

```bash
npm start
```

---

## 8. Acesse no navegador

Abre o projeto em:

```text
http://localhost:3000
```

# Bravura

Jogo tático multiplayer, estilo Valorant/CS, 100% open source, com visual
low-poly (referência: Untuned, porém mais polido e menos "quadrado").

## Estrutura do repositório

- [`src/`](./src) — código-fonte do cliente do jogo (projeto Angular).
- [`documentacao/`](./documentacao) — design do jogo, stack técnica,
  arquitetura de rede e modelo econômico definidos até agora.

## Comece por aqui

- [Visão geral](./documentacao/visao-geral.md)
- [Stack técnica e arquitetura de rede](./documentacao/stack-tecnica-e-arquitetura.md)
- [Modo de jogo](./documentacao/modo-de-jogo.md)
- [Economia do projeto](./documentacao/economia.md)
- [Programa de criadores de conteúdo](./documentacao/criadores-de-conteudo.md)
- [Perguntas em aberto](./documentacao/perguntas-em-aberto.md)

## Desenvolvimento

Projeto gerado com [Angular CLI](https://angular.dev) 20.

```bash
npm install       # instala as dependências
npm start         # ng serve — servidor de desenvolvimento em http://localhost:4200
npm run build     # ng build — build de produção em dist/
npm test          # ng test — testes unitários (Karma)
```

### Bibliotecas principais

- [`three`](https://threejs.org) — renderização 3D
- [`ammojs3`](https://github.com/i2135/ammo.js) — física (port do Bullet
  Physics para WebAssembly)

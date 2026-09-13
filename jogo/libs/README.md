# Libs vendorizadas

Bibliotecas de terceiros usadas pelo cliente do jogo, incluídas diretamente
no repositório (vendored) em vez de instaladas via gerenciador de pacotes,
já que o projeto do cliente ainda não foi inicializado.

## three.js

- **Versão**: 0.186.0
- **Origem**: pacote `three` no npm (`node_modules/three/build/three.module.js`)
- **Licença**: MIT (ver [`three/LICENSE`](./three/LICENSE))
- Build ESM (`three.module.js`) — importável via `<script type="module">`
  ou bundler.

## ammo.js

- **Versão**: 0.0.11 (pacote `ammojs3`, fork mantido do port original do
  Bullet Physics para JavaScript/WebAssembly)
- **Origem**: pacote `ammojs3` no npm (`node_modules/ammojs3/builds/`)
- **Licença**: zlib (ver [`ammo/LICENSE`](./ammo/LICENSE))
- Build WebAssembly (`ammo.wasm.js` + `ammo.wasm.wasm`), a variante
  recomendada pelo próprio `AmmoPhysics.js` do three.js para melhor
  performance em relação ao build asm.js.
- Inclui os tipos (`ammo.d.ts`, `ammo-ambient.d.ts`) para uso com
  TypeScript.

## Atualizando

Para atualizar qualquer uma das libs, reinstale o pacote correspondente via
npm em um diretório temporário e copie os arquivos de build atualizados
para a pasta correspondente aqui, atualizando a versão anotada neste
arquivo.

/**
 * Traz os tipos do ammo.js (gerados pelo proprio pacote ammojs3) para
 * o projeto como um global. Em runtime, `ammo.wasm.js` e carregado
 * como uma tag <script> classica (nao importado como modulo, para o
 * bundler nao tentar resolver o branch de Node.js que esse arquivo
 * tem embutido) e o proprio script define `Ammo` como global — este
 * arquivo so garante que o TypeScript conheca esse global.
 */
/// <reference path="../../../node_modules/ammojs3/dist/ammo-ambient.d.ts" />

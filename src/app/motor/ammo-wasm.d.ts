/**
 * O pacote `ammojs3` só declara tipos para o caminho principal
 * (`ammojs3`, build asm.js). Usamos o build WebAssembly diretamente por
 * performance, e este módulo reaproveita os mesmos tipos para ele.
 */
declare module 'ammojs3/dist/ammo.wasm.js' {
  import Ammo from 'ammojs3';
  export default Ammo;
}

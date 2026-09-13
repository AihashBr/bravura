import type Ammo from 'ammojs3';

interface Vetor3 {
  x: number;
  y: number;
  z: number;
}

interface Quaternio {
  x: number;
  y: number;
  z: number;
  w: number;
}

/**
 * Ponto único de acesso ao ammo.js (física) no jogo. Nenhum outro arquivo
 * deve importar `ammojs3` diretamente — tudo passa por aqui.
 *
 * Usa o build WebAssembly do ammo.js. O binário (`ammo.wasm.wasm`) é
 * servido como asset estático em `public/ammo/`.
 */
export class Fisica {
  private ammo!: typeof Ammo;
  private mundo!: Ammo.btDiscreteDynamicsWorld;

  async inicializar(): Promise<void> {
    const inicializarAmmo = (await import('ammojs3/dist/ammo.wasm.js')).default;

    this.ammo = await inicializarAmmo({
      locateFile: (caminho: string) => `/ammo/${caminho}`,
    });

    const configuracaoColisao = new this.ammo.btDefaultCollisionConfiguration();
    const despachanteColisao = new this.ammo.btCollisionDispatcher(configuracaoColisao);
    const fasesAmplas = new this.ammo.btDbvtBroadphase();
    const solucionador = new this.ammo.btSequentialImpulseConstraintSolver();

    this.mundo = new this.ammo.btDiscreteDynamicsWorld(
      despachanteColisao,
      fasesAmplas,
      solucionador,
      configuracaoColisao,
    );
    this.mundo.setGravity(new this.ammo.btVector3(0, -9.8, 0));
  }

  criarFormaCaixa(semiLargura: number, semiAltura: number, semiProfundidade: number): Ammo.btBoxShape {
    return new this.ammo.btBoxShape(new this.ammo.btVector3(semiLargura, semiAltura, semiProfundidade));
  }

  criarFormaEsfera(raio: number): Ammo.btSphereShape {
    return new this.ammo.btSphereShape(raio);
  }

  criarCorpoRigido(forma: Ammo.btCollisionShape, massa: number, posicao: Vetor3, rotacao?: Quaternio): Ammo.btRigidBody {
    const transformacao = new this.ammo.btTransform();
    transformacao.setIdentity();
    transformacao.setOrigin(new this.ammo.btVector3(posicao.x, posicao.y, posicao.z));
    if (rotacao) {
      transformacao.setRotation(new this.ammo.btQuaternion(rotacao.x, rotacao.y, rotacao.z, rotacao.w));
    }

    const inerciaLocal = new this.ammo.btVector3(0, 0, 0);
    if (massa > 0) {
      forma.calculateLocalInertia(massa, inerciaLocal);
    }

    const estadoDeMovimento = new this.ammo.btDefaultMotionState(transformacao);
    const infoConstrucao = new this.ammo.btRigidBodyConstructionInfo(massa, estadoDeMovimento, forma, inerciaLocal);
    return new this.ammo.btRigidBody(infoConstrucao);
  }

  adicionarCorpo(corpo: Ammo.btRigidBody): void {
    this.mundo.addRigidBody(corpo);
  }

  removerCorpo(corpo: Ammo.btRigidBody): void {
    this.mundo.removeRigidBody(corpo);
  }

  atualizar(deltaTempo: number): void {
    this.mundo.stepSimulation(deltaTempo, 10);
  }

  obterMundo(): Ammo.btDiscreteDynamicsWorld {
    return this.mundo;
  }
}

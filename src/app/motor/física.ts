import type Ammo from 'ammojs3';

interface Vetor3 {
  x: number;
  y: number;
  z: number;
}

interface Quatérnio {
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
export class Física {
  private ammo!: typeof Ammo;
  private mundo!: Ammo.btDiscreteDynamicsWorld;

  async inicializar(): Promise<void> {
    const inicializarAmmo = (await import('ammojs3/dist/ammo.wasm.js')).default;

    this.ammo = await inicializarAmmo({
      locateFile: (caminho: string) => `/ammo/${caminho}`,
    });

    const configuraçãoColisão = new this.ammo.btDefaultCollisionConfiguration();
    const despachanteColisão = new this.ammo.btCollisionDispatcher(configuraçãoColisão);
    const fasesAmplas = new this.ammo.btDbvtBroadphase();
    const solucionador = new this.ammo.btSequentialImpulseConstraintSolver();

    this.mundo = new this.ammo.btDiscreteDynamicsWorld(
      despachanteColisão,
      fasesAmplas,
      solucionador,
      configuraçãoColisão,
    );
    this.mundo.setGravity(new this.ammo.btVector3(0, -9.8, 0));
  }

  criarFormaCaixa(semiLargura: number, semiAltura: number, semiProfundidade: number): Ammo.btBoxShape {
    return new this.ammo.btBoxShape(new this.ammo.btVector3(semiLargura, semiAltura, semiProfundidade));
  }

  criarFormaEsfera(raio: number): Ammo.btSphereShape {
    return new this.ammo.btSphereShape(raio);
  }

  criarCorpoRígido(forma: Ammo.btCollisionShape, massa: number, posição: Vetor3, rotação?: Quatérnio): Ammo.btRigidBody {
    const transformação = new this.ammo.btTransform();
    transformação.setIdentity();
    transformação.setOrigin(new this.ammo.btVector3(posição.x, posição.y, posição.z));
    if (rotação) {
      transformação.setRotation(new this.ammo.btQuaternion(rotação.x, rotação.y, rotação.z, rotação.w));
    }

    const inérciaLocal = new this.ammo.btVector3(0, 0, 0);
    if (massa > 0) {
      forma.calculateLocalInertia(massa, inérciaLocal);
    }

    const estadoDeMovimento = new this.ammo.btDefaultMotionState(transformação);
    const infoConstrução = new this.ammo.btRigidBodyConstructionInfo(massa, estadoDeMovimento, forma, inérciaLocal);
    return new this.ammo.btRigidBody(infoConstrução);
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

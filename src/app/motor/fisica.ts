import type { Quaternio, Vetor3 } from '../objetos/objeto-base';

/**
 * Ponto único de acesso ao ammo.js (física) no jogo. Nenhum outro arquivo
 * deve depender de `ammojs3`/`Ammo` diretamente — tudo passa por aqui.
 *
 * Usa o build WebAssembly do ammo.js. O binário (`ammo.wasm.wasm`) e o
 * script que o carrega (`ammo.wasm.js`) são servidos como assets
 * estáticos em `public/ammo/` — o script é injetado como uma tag
 * `<script>` clássica (não importado como módulo) porque seu código
 * gerado pelo Emscripten tem um branch de Node.js (`require('fs')`)
 * que o bundler não consegue resolver para o navegador.
 */
export class Fisica {
  private ammo!: typeof Ammo;
  private mundo!: Ammo.btDiscreteDynamicsWorld;

  async inicializar(): Promise<void> {
    const inicializarAmmo = await this.carregarAmmo();

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

  private carregarAmmo(): Promise<typeof Ammo> {
    if (typeof Ammo !== 'undefined') {
      return Promise.resolve(Ammo);
    }

    return new Promise((resolver, rejeitar) => {
      const script = document.createElement('script');
      script.src = '/ammo/ammo.wasm.js';
      script.onload = () => resolver(Ammo);
      script.onerror = () => rejeitar(new Error('Falha ao carregar /ammo/ammo.wasm.js'));
      document.head.appendChild(script);
    });
  }

  criarFormaCaixa(semiLargura: number, semiAltura: number, semiProfundidade: number): Ammo.btBoxShape {
    return new this.ammo.btBoxShape(new this.ammo.btVector3(semiLargura, semiAltura, semiProfundidade));
  }

  criarFormaEsfera(raio: number): Ammo.btSphereShape {
    return new this.ammo.btSphereShape(raio);
  }

  criarFormaCapsula(raio: number, alturaCilindro: number): Ammo.btCapsuleShape {
    return new this.ammo.btCapsuleShape(raio, alturaCilindro);
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

  /** Impede o corpo de girar em X/Z (tombar) — só permite giro no eixo Y. Uso tipico: personagens. */
  travarRotacaoXZ(corpo: Ammo.btRigidBody): void {
    corpo.setAngularFactor(new this.ammo.btVector3(0, 1, 0));
  }

  removerCorpo(corpo: Ammo.btRigidBody): void {
    this.mundo.removeRigidBody(corpo);
  }

  definirVelocidadeLinear(corpo: Ammo.btRigidBody, velocidade: Vetor3): void {
    // corpos parados por tempo suficiente "dormem" no Bullet/Ammo, e
    // setLinearVelocity sozinho nao acorda um corpo dormindo — sem
    // isso o corpo simplesmente ignora a velocidade e fica parado.
    corpo.activate(true);
    corpo.setLinearVelocity(new this.ammo.btVector3(velocidade.x, velocidade.y, velocidade.z));
  }

  obterVelocidadeLinear(corpo: Ammo.btRigidBody): Vetor3 {
    const velocidade = corpo.getLinearVelocity();
    return { x: velocidade.x(), y: velocidade.y(), z: velocidade.z() };
  }

  definirTransformacaoCorpo(corpo: Ammo.btRigidBody, posicao: Vetor3, rotacao?: Quaternio): void {
    const transformacao = new this.ammo.btTransform();
    transformacao.setIdentity();
    transformacao.setOrigin(new this.ammo.btVector3(posicao.x, posicao.y, posicao.z));
    if (rotacao) {
      transformacao.setRotation(new this.ammo.btQuaternion(rotacao.x, rotacao.y, rotacao.z, rotacao.w));
    }
    corpo.setCenterOfMassTransform(transformacao);
    corpo.getMotionState().setWorldTransform(transformacao);
  }

  obterTransformacaoCorpo(corpo: Ammo.btRigidBody): { posicao: Vetor3; rotacao: Quaternio } {
    const transformacao = corpo.getCenterOfMassTransform();
    const origem = transformacao.getOrigin();
    const rotacao = transformacao.getRotation();
    return {
      posicao: { x: origem.x(), y: origem.y(), z: origem.z() },
      rotacao: { x: rotacao.x(), y: rotacao.y(), z: rotacao.z(), w: rotacao.w() },
    };
  }

  atualizar(deltaTempo: number): void {
    this.mundo.stepSimulation(deltaTempo, 10);
  }

  obterMundo(): Ammo.btDiscreteDynamicsWorld {
    return this.mundo;
  }
}

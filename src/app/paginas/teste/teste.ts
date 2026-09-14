import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { Renderizacao } from '../../motor/renderizacao';
import { Fisica } from '../../motor/fisica';
import { CameraPrimeiraPessoa } from '../../objetos/personagens/controles/camera-primeira-pessoa';
import { Jogador } from '../../objetos/personagens/jogador';
import { Toque } from '../../objetos/personagens/controles/toque';
import { MapaTeste } from '../../objetos/mapas/mapa-teste';
import { TelaCheia } from '../../componentes/tela-cheia/tela-cheia';
import { OrientacaoHorizontal } from '../../componentes/orientacao-horizontal/orientacao-horizontal';
import { Configuracoes } from '../../componentes/configuracoes/configuracoes';
import { Preferencias } from '../../servicos/preferencias';

/**
 * Pagina que junta tudo: renderizacao, fisica, mapa de teste, jogador
 * (capsula) e camera em primeira pessoa, num unico loop de jogo. So e
 * possivel jogar em tela cheia e com a tela na horizontal.
 */
@Component({
  selector: 'app-teste',
  imports: [TelaCheia, OrientacaoHorizontal, Configuracoes],
  templateUrl: './teste.html',
  styleUrl: './teste.scss',
})
export class Teste implements AfterViewInit, OnDestroy {
  private readonly preferencias = inject(Preferencias);

  @ViewChild('tela', { static: true }) telaRef!: ElementRef<HTMLCanvasElement>;

  private renderizacao!: Renderizacao;
  private fisica!: Fisica;
  private cameraPrimeiraPessoa!: CameraPrimeiraPessoa;
  private jogador!: Jogador;
  private mapa!: MapaTeste;

  private idAnimacao = 0;
  private ultimoInstante = 0;
  private destruido = false;
  private observadorRedimensionamento?: ResizeObserver;

  private readonly aoClicar = (): void => this.cameraPrimeiraPessoa.travar();

  async ngAfterViewInit(): Promise<void> {
    const tela = this.telaRef.nativeElement;
    const largura = tela.clientWidth;
    const altura = tela.clientHeight;

    this.renderizacao = new Renderizacao(tela, largura, altura);

    this.fisica = new Fisica();
    await this.fisica.inicializar();

    if (this.destruido) {
      return;
    }

    this.mapa = new MapaTeste(this.fisica, 40, 40);
    this.renderizacao.adicionarObjeto(this.mapa.obterMalha());

    this.jogador = new Jogador(this.fisica, 0.4, 1.8, { x: 0, y: 2, z: 5 });
    this.renderizacao.adicionarObjeto(this.jogador.obterMalha());

    this.cameraPrimeiraPessoa = new CameraPrimeiraPessoa(this.renderizacao.obterCamera(), tela);
    this.jogador.anexarCamera(this.cameraPrimeiraPessoa);
    this.jogador.anexarToque(new Toque(tela));

    tela.addEventListener('click', this.aoClicar);

    // ResizeObserver cobre resize de janela, tela cheia e mudanca de
    // orientacao com um so mecanismo, reagindo ao tamanho real do
    // canvas em vez de depender de eventos especificos do navegador.
    this.observadorRedimensionamento = new ResizeObserver(() => this.redimensionar());
    this.observadorRedimensionamento.observe(tela);

    this.ultimoInstante = performance.now();
    this.animar(this.ultimoInstante);
  }

  private animar(instante: number): void {
    this.idAnimacao = requestAnimationFrame((proximoInstante) => this.animar(proximoInstante));

    const deltaTempo = Math.min((instante - this.ultimoInstante) / 1000, 0.1);
    this.ultimoInstante = instante;

    this.cameraPrimeiraPessoa.definirSensibilidade(this.preferencias.sensibilidadeCamera());

    this.fisica.atualizar(deltaTempo);
    this.mapa.atualizar(deltaTempo);
    this.jogador.atualizar(deltaTempo);
    this.renderizacao.renderizar();
  }

  private redimensionar(): void {
    const tela = this.telaRef.nativeElement;
    const largura = tela.clientWidth;
    const altura = tela.clientHeight;
    if (largura === 0 || altura === 0) {
      return;
    }
    this.renderizacao.redimensionar(largura, altura);
  }

  ngOnDestroy(): void {
    this.destruido = true;
    cancelAnimationFrame(this.idAnimacao);
    this.observadorRedimensionamento?.disconnect();
    this.telaRef.nativeElement.removeEventListener('click', this.aoClicar);

    this.jogador?.destruir();
    this.mapa?.destruir();
    this.cameraPrimeiraPessoa?.descartar();
    this.renderizacao?.descartar();
  }
}

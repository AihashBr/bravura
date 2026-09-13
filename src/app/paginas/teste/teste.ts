import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Renderizacao } from '../../motor/renderizacao';
import { Fisica } from '../../motor/fisica';
import { CameraPrimeiraPessoa } from '../../motor/camera-primeira-pessoa';
import { Jogador } from '../../objetos/jogador';
import { MapaTeste } from '../../objetos/mapas/mapa-teste';
import { TelaCheia } from '../../componentes/tela-cheia/tela-cheia';
import { OrientacaoHorizontal } from '../../componentes/orientacao-horizontal/orientacao-horizontal';

/**
 * Pagina que junta tudo: renderizacao, fisica, mapa de teste, jogador
 * (capsula) e camera em primeira pessoa, num unico loop de jogo. So e
 * possivel jogar em tela cheia e com a tela na horizontal.
 */
@Component({
  selector: 'app-teste',
  imports: [TelaCheia, OrientacaoHorizontal],
  templateUrl: './teste.html',
  styleUrl: './teste.scss',
})
export class Teste implements AfterViewInit, OnDestroy {
  @ViewChild('tela', { static: true }) telaRef!: ElementRef<HTMLCanvasElement>;

  private renderizacao!: Renderizacao;
  private fisica!: Fisica;
  private cameraPrimeiraPessoa!: CameraPrimeiraPessoa;
  private jogador!: Jogador;
  private mapa!: MapaTeste;

  private idAnimacao = 0;
  private ultimoInstante = 0;
  private destruido = false;

  private readonly aoRedimensionar = (): void => this.redimensionar();
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

    tela.addEventListener('click', this.aoClicar);
    window.addEventListener('resize', this.aoRedimensionar);

    this.ultimoInstante = performance.now();
    this.animar(this.ultimoInstante);
  }

  private animar(instante: number): void {
    this.idAnimacao = requestAnimationFrame((proximoInstante) => this.animar(proximoInstante));

    const deltaTempo = Math.min((instante - this.ultimoInstante) / 1000, 0.1);
    this.ultimoInstante = instante;

    this.fisica.atualizar(deltaTempo);
    this.mapa.atualizar(deltaTempo);
    this.jogador.atualizar(deltaTempo);
    this.renderizacao.renderizar();
  }

  private redimensionar(): void {
    const tela = this.telaRef.nativeElement;
    this.renderizacao.redimensionar(tela.clientWidth, tela.clientHeight);
  }

  ngOnDestroy(): void {
    this.destruido = true;
    cancelAnimationFrame(this.idAnimacao);
    window.removeEventListener('resize', this.aoRedimensionar);
    this.telaRef.nativeElement.removeEventListener('click', this.aoClicar);

    this.jogador?.destruir();
    this.mapa?.destruir();
    this.cameraPrimeiraPessoa?.descartar();
    this.renderizacao?.descartar();
  }
}

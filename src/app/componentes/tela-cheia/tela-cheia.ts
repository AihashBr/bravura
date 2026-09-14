import { Component, OnDestroy, OnInit, signal } from '@angular/core';

/**
 * Bloqueia o conteudo projetado enquanto o navegador nao estiver em
 * tela cheia. Reaparece automaticamente se a pessoa sair da tela
 * cheia (ex: apertando Esc).
 */
@Component({
  selector: 'app-tela-cheia',
  imports: [],
  templateUrl: './tela-cheia.html',
  styleUrl: './tela-cheia.scss',
})
export class TelaCheia implements OnInit, OnDestroy {
  protected readonly emTelaCheia = signal(this.verificarTelaCheia());

  private readonly aoMudar = (): void => this.emTelaCheia.set(this.verificarTelaCheia());

  ngOnInit(): void {
    document.addEventListener('fullscreenchange', this.aoMudar);
  }

  ngOnDestroy(): void {
    document.removeEventListener('fullscreenchange', this.aoMudar);
  }

  protected aplicar(): void {
    document.documentElement.requestFullscreen().catch(() => {
      // pedido recusado pelo navegador (ex: fora de um gesto do usuario); o aviso continua visivel
    });
  }

  private verificarTelaCheia(): boolean {
    if (window.self !== window.top) {
      // dentro de um iframe (ex: modo de teste com 4 telas) o estado
      // de tela cheia da pagina que hospeda nunca aparece aqui, mesmo
      // que ela esteja de fato em tela cheia — a checagem nao se aplica.
      return true;
    }
    return document.fullscreenElement !== null;
  }
}

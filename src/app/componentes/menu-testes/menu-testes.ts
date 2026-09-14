import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Botao de ferramentas de teste/dev (canto oposto ao de configuracoes
 * do jogador). Abre um menu curto com opcoes de teste — por enquanto
 * so "4 telas", que abre o jogo em 4 iframes ao mesmo tempo.
 */
@Component({
  selector: 'app-menu-testes',
  imports: [RouterLink],
  templateUrl: './menu-testes.html',
  styleUrl: './menu-testes.scss',
})
export class MenuTestes {
  protected readonly aberto = signal(false);

  protected alternar(): void {
    this.aberto.update((valor) => !valor);
  }
}

import { Component, inject, signal } from '@angular/core';
import { Preferencias } from '../../servicos/preferencias';
import { ControleNumerico } from '../controle-numerico/controle-numerico';

type Aba = 'controles';

/**
 * Botao de engrenagem flutuante que abre um painel de configuracoes
 * com abas. Por enquanto so tem a aba "Controles" (sensibilidade da
 * camera, edicao do layout da UI), mas outras abas podem entrar aqui
 * depois.
 */
@Component({
  selector: 'app-configuracoes',
  imports: [ControleNumerico],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.scss',
})
export class Configuracoes {
  protected readonly preferencias = inject(Preferencias);

  protected readonly aberto = signal(false);
  protected readonly abaAtiva = signal<Aba>('controles');

  protected alternar(): void {
    this.aberto.update((valor) => !valor);
  }
}

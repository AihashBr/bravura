import { Component, inject, signal } from '@angular/core';
import { Preferencias } from '../../servicos/preferencias';

type Aba = 'controles';

/**
 * Botao de engrenagem flutuante que abre um painel de configuracoes
 * com abas. Por enquanto so tem a aba "Controles" (sensibilidade da
 * camera), mas outras abas podem entrar aqui depois.
 */
@Component({
  selector: 'app-configuracoes',
  imports: [],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.scss',
})
export class Configuracoes {
  private readonly preferencias = inject(Preferencias);

  protected readonly aberto = signal(false);
  protected readonly abaAtiva = signal<Aba>('controles');
  protected readonly sensibilidadeCamera = this.preferencias.sensibilidadeCamera;

  protected alternar(): void {
    this.aberto.update((valor) => !valor);
  }

  protected aoMudarSensibilidade(evento: Event): void {
    const valor = Number((evento.target as HTMLInputElement).value);
    this.preferencias.definirSensibilidadeCamera(valor);
  }

  protected formatarSensibilidade(): string {
    return this.sensibilidadeCamera().toFixed(4);
  }
}

import { Component, input, model } from '@angular/core';

/**
 * Campo generico pra definir um valor numerico: um slider e um campo
 * de texto lado a lado, sempre sincronizados. Usado onde quer que o
 * jogo precise de uma configuracao numerica (sensibilidade, volume,
 * etc.) — nao e especifico de nenhuma delas.
 */
@Component({
  selector: 'app-controle-numerico',
  imports: [],
  templateUrl: './controle-numerico.html',
  styleUrl: './controle-numerico.scss',
})
export class ControleNumerico {
  readonly rotulo = input.required<string>();
  readonly minimo = input(0);
  readonly maximo = input(1);
  readonly passo = input(0.01);
  readonly valor = model.required<number>();

  protected aoMudarSlider(evento: Event): void {
    this.valor.set(Number((evento.target as HTMLInputElement).value));
  }

  protected aoMudarTexto(evento: Event): void {
    const numero = Number((evento.target as HTMLInputElement).value);
    if (Number.isFinite(numero)) {
      this.valor.set(Math.min(this.maximo(), Math.max(this.minimo(), numero)));
    }
  }
}

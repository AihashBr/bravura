import { Injectable, signal } from '@angular/core';

const CHAVE_SENSIBILIDADE_CAMERA = 'bravura.sensibilidadeCamera';
const SENSIBILIDADE_CAMERA_PADRAO = 0.0035;

/**
 * Preferencias do jogador, persistidas no localStorage. Unico ponto
 * de acesso a essas configuracoes — tanto quem le (ex: a camera)
 * quanto quem escreve (ex: a tela de configuracoes) passam por aqui.
 */
@Injectable({ providedIn: 'root' })
export class Preferencias {
  readonly sensibilidadeCamera = signal(this.carregarSensibilidadeCamera());

  definirSensibilidadeCamera(valor: number): void {
    this.sensibilidadeCamera.set(valor);
    localStorage.setItem(CHAVE_SENSIBILIDADE_CAMERA, String(valor));
  }

  private carregarSensibilidadeCamera(): number {
    const salvo = localStorage.getItem(CHAVE_SENSIBILIDADE_CAMERA);
    const valor = salvo === null ? NaN : Number(salvo);
    return Number.isFinite(valor) ? valor : SENSIBILIDADE_CAMERA_PADRAO;
  }
}

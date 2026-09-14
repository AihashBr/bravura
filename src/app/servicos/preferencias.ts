import { Injectable, Signal, computed, signal } from '@angular/core';

const CHAVE_SENSIBILIDADE_CAMERA = 'bravura.sensibilidadeCamera';
const SENSIBILIDADE_CAMERA_PADRAO = 0.35;

const CHAVE_LAYOUT_UI = 'bravura.layoutUi';

export interface LayoutElementoUi {
  /** Posicao horizontal, em % da largura da tela (0 a 100). */
  x: number;
  /** Posicao vertical, em % da altura da tela (0 a 100). */
  y: number;
  /** Escala uniforme do elemento (1 = tamanho normal). */
  escala: number;
}

/**
 * Preferencias do jogador, persistidas no localStorage. Unico ponto
 * de acesso a essas configuracoes — tanto quem le (ex: a camera, os
 * elementos de UI) quanto quem escreve (ex: a tela de configuracoes)
 * passam por aqui.
 */
@Injectable({ providedIn: 'root' })
export class Preferencias {
  /** Sensibilidade normalizada de 0 a 1 — cada consumidor converte pra sua propria escala. */
  readonly sensibilidadeCamera = signal(this.carregarSensibilidadeCamera());

  /** Se verdadeiro, os elementos de UI (botoes, etc.) ficam arrastaveis/redimensionaveis na tela. */
  readonly modoEdicaoLayout = signal(false);

  private readonly layoutUi = signal<Record<string, LayoutElementoUi>>(this.carregarLayoutUi());

  definirSensibilidadeCamera(valor: number): void {
    const limitado = Math.min(1, Math.max(0, valor));
    this.sensibilidadeCamera.set(limitado);
    localStorage.setItem(CHAVE_SENSIBILIDADE_CAMERA, String(limitado));
  }

  alternarModoEdicaoLayout(): void {
    this.modoEdicaoLayout.update((valor) => !valor);
  }

  /** Layout do elemento de UI com o `id` dado, ou `padrao` se nunca foi customizado. */
  obterLayoutElemento(id: string, padrao: LayoutElementoUi): Signal<LayoutElementoUi> {
    return computed(() => this.layoutUi()[id] ?? padrao);
  }

  definirLayoutElemento(id: string, layout: LayoutElementoUi): void {
    this.layoutUi.update((atual) => ({ ...atual, [id]: layout }));
    localStorage.setItem(CHAVE_LAYOUT_UI, JSON.stringify(this.layoutUi()));
  }

  private carregarSensibilidadeCamera(): number {
    const salvo = localStorage.getItem(CHAVE_SENSIBILIDADE_CAMERA);
    const valor = salvo === null ? NaN : Number(salvo);
    return Number.isFinite(valor) ? Math.min(1, Math.max(0, valor)) : SENSIBILIDADE_CAMERA_PADRAO;
  }

  private carregarLayoutUi(): Record<string, LayoutElementoUi> {
    const salvo = localStorage.getItem(CHAVE_LAYOUT_UI);
    if (salvo === null) {
      return {};
    }
    try {
      return JSON.parse(salvo) as Record<string, LayoutElementoUi>;
    } catch {
      return {};
    }
  }
}

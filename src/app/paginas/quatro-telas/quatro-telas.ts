import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

/**
 * Pagina de teste: carrega o jogo (/teste) em 4 iframes independentes
 * na tela, cada um com sua propria instancia isolada — util pra ver
 * varias "sessoes" ao mesmo tempo sem precisar de 4 navegadores.
 */
@Component({
  selector: 'app-quatro-telas',
  imports: [RouterLink],
  templateUrl: './quatro-telas.html',
  styleUrl: './quatro-telas.scss',
})
export class QuatroTelas {
  private readonly sanitizador = inject(DomSanitizer);

  protected readonly url: SafeResourceUrl = this.sanitizador.bypassSecurityTrustResourceUrl('/teste');
}

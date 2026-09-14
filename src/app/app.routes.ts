import { Routes } from '@angular/router';
import { Teste } from './paginas/teste/teste';
import { QuatroTelas } from './paginas/quatro-telas/quatro-telas';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'teste' },
  { path: 'teste', component: Teste },
  { path: 'testes/quatro-telas', component: QuatroTelas },
];

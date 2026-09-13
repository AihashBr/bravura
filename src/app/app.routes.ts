import { Routes } from '@angular/router';
import { Teste } from './paginas/teste/teste';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'teste' },
  { path: 'teste', component: Teste },
];

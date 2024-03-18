import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NodeListComponent } from './home/node-list/node-list.component';
import { NodeBuilderComponent } from './home/node-builder/node-builder.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home', component: HomeComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'node' },
      { path: 'node', component: NodeListComponent },
      { path: 'node/:id', component: NodeBuilderComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

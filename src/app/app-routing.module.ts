import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NodeListComponent } from './home/node-list/node-list.component';
import { NodeBuilderComponent } from './home/node-builder/node-builder.component';
import { ConnectorsComponent } from './home/connectors/connectors.component';
import { ConnectorEditorComponent } from './home/connector-editor/connector-editor.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home', component: HomeComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'node' },
      { path: 'node', component: NodeListComponent },
      { path: 'node/:id', component: NodeBuilderComponent },
      { path: 'connector', component: ConnectorsComponent },
      { path: 'connector/:id', component: ConnectorEditorComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

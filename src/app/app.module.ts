import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NodeListComponent } from './home/node-list/node-list.component';
import { NodeBuilderComponent } from './home/node-builder/node-builder.component';
import { ApiService } from './api.service';
import { SchemaBuilderComponent } from './utils/schema-builder/schema-builder.component';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { JsonPasteDirective } from './directives/json-paste.directive';
import { AlertModalComponent } from './utils/alert-modal/alert-modal.component';
import { ImportModalComponent } from './utils/import-modal/import-modal.component';
import { NewNodeModalComponent } from './utils/new-node-modal/new-node-modal.component';
import { JsonFileSelectDirective } from './directives/json-file-select.directive';
import { ExportModalComponent } from './utils/export-modal/export-modal.component';
import { FilterPipe } from './pipes/filter.pipe';
import { ConnectorsComponent } from './home/connectors/connectors.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NodeListComponent,
    NodeBuilderComponent,
    SchemaBuilderComponent,
    AutoFocusDirective,
    JsonPasteDirective,
    AlertModalComponent,
    ImportModalComponent,
    NewNodeModalComponent,
    JsonFileSelectDirective,
    ExportModalComponent,
    FilterPipe,
    ConnectorsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    MonacoEditorModule.forRoot()
  ],
  providers: [ApiService, FilterPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

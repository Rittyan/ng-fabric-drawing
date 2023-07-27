import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {AppComponent} from "./app/app.component";
import {bootstrapApplication} from "@angular/platform-browser";
import {importProvidersFrom} from "@angular/core";
import {RouterModule} from "@angular/router";
import {Route} from "./app/route";


bootstrapApplication(AppComponent, {
  providers: [
    // Common Modules
    importProvidersFrom(RouterModule.forRoot(Route)),
]}).catch(err => console.error(err));;

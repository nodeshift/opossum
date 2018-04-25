import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ButtonComponent } from './button/button.component';
import { ResponseCardComponent } from './response-card/response-card.component';
import { ResponseListComponent } from './response-list/response-list.component';
import { StatsCardComponent } from './stats-card/stats-card.component';


@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    ResponseCardComponent,
    ResponseListComponent,
    StatsCardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

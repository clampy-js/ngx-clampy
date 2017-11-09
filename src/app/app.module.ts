import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ClampyModule } from './clampy/index';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ClampyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserSearchComponent } from './search/user-search/user-search.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, UserSearchComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

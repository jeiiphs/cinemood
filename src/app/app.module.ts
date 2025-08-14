import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  declarations: [
    // ...existing declarations...
    SafePipe
  ],
  imports: [
    // ...existing imports...
    HttpClientModule
  ],
  // ...rest of the module...
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdatePostComponent } from './components/add-update-post/add-update-post.component';
import { AddLostPetComponent } from './components/add-lost-pet/add-lost-pet.component';
import { AddFoundPetComponent } from './components/add-found-pet/add-found-pet.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    AddUpdatePostComponent,
    AddLostPetComponent,
    AddFoundPetComponent
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    AddUpdatePostComponent,
    AddLostPetComponent,
    AddFoundPetComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }

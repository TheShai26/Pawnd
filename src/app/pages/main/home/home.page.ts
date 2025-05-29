import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddLostPetComponent } from 'src/app/shared/components/add-lost-pet/add-lost-pet.component';
import { AddFoundPetComponent } from 'src/app/shared/components/add-found-pet/add-found-pet.component';

@Component({
  standalone: false,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  //===== Cerrar Sesión =====
  signOut(){
    this.firebaseSvc.signOut();
  }
  
//===== Agregar o actualizar Post =====
  openAddPost(tipo: 'perdida' | 'encontrada') {
  const component = tipo === 'perdida' ? AddLostPetComponent : AddFoundPetComponent;

  this.utilsSvc.presentModal({
    component,
    cssClass: 'add-update-modal'
  });
}
}

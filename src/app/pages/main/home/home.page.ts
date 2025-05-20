import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePostComponent } from 'src/app/shared/components/add-update-post/add-update-post.component';

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
  addUpdatePost(){
    this.utilsSvc.presentModal({
      component: AddUpdatePostComponent,
      cssClass: 'add-update-modal'
    })
  }
}

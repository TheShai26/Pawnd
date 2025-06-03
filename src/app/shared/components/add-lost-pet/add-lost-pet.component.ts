import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  standalone: false,
  selector: 'app-add-lost-pet',
  templateUrl: './add-lost-pet.component.html',
  styleUrls: ['./add-lost-pet.component.scss'],
})
export class AddLostPetComponent implements OnInit {

  tipoPost: string = 'perdida';

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    petName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    peType: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
    descriptionPet: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(20)]),
    lastUbiPet: new FormControl('', [Validators.required, Validators.minLength(20)]),
    dateLost: new FormControl('', [Validators.required]),
    contactInfo: new FormControl('', [Validators.required, Validators.minLength(9)]),

  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {

    this.user = this.utilsSvc.getFromLocalStorage('user'); 

  }

  // ===== Tomar foto =====

  async takeImage() {
    const dataUrl = await (await this.utilsSvc.takePicture('Imagen de la mascota perdida')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  async submit() {
    if (this.form.valid) {

      let path = 'users/${this.user.uid}/posts'

      const loading = await this.utilsSvc.loading();
      await loading.present();

      // ===== Subir imagen y obtener url =====
      let dataUrl = this.form.value.image;
      let imagePath = 'users/${this.user.uid}/${Date.now()}';
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.id;

      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

        this.utilsSvc.dismissModal({success: true});

        this.utilsSvc.presentToast({
          message: 'Mascota perdida publicada con éxito',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })

        }).catch (error =>  {
          console.log(error);

        this.utilsSvc.presentToast({
          message: error.message || 'Error al publicar mascota perdida',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })

    }
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  standalone: false,
  selector: 'app-add-found-pet',
  templateUrl: './add-found-pet.component.html',
  styleUrls: ['./add-found-pet.component.scss'],
})
export class AddFoundPetComponent implements OnInit {

  tipoPost: string = 'encontrada';

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    peType: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
    descriptionPet: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(20)]),
    foundLocation: new FormControl('', [Validators.required, Validators.minLength(20)]),
    dateFound: new FormControl('', [Validators.required]),
    contactInfo: new FormControl('', [Validators.required, Validators.minLength(9)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  // ===== Tomar foto =====
  async takeImage() {
    const dataUrl = await (await this.utilsSvc.takePicture('Imagen de la mascota encontrada')).dataUrl;
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
          message: 'Mascota encontrada publicada con éxito',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })

        }).catch (error =>  {
          console.log(error);

        this.utilsSvc.presentToast({
          message: error.message || 'Error al publicar mascota encontrada',
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
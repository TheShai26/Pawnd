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

  async takeImage() {
    const dataUrl = await (await this.utilsSvc.takePicture('Imagen de la mascota encontrada')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        await this.firebaseSvc.addFoundPetPost(this.form.value);
        this.utilsSvc.presentToast({
          message: 'Mascota encontrada publicada con éxito',
          color: 'success'
        });
      } catch (error: any) {
        this.utilsSvc.presentToast({
          message: error.message || 'Error al publicar mascota encontrada',
          color: 'danger'
        });
      } finally {
        loading.dismiss();
      }
    }
  }
}
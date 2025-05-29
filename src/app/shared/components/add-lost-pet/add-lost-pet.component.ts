import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  standalone: false,
  selector: 'app-add-lost-pet',
  templateUrl: './add-lost-pet.component.html',
  styleUrls: ['./add-lost-pet.component.scss'],
})
export class AddLostPetComponent implements OnInit {

  tipoPost: string = 'perdida';

  form = new FormGroup({
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

  ngOnInit() {}

  async takeImage() {
    const dataUrl = await (await this.utilsSvc.takePicture('Imagen de la mascota perdida')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        // Ajusta el método de Firebase que uses para guardar el post
        await this.firebaseSvc.addLostPetPost(this.form.value);
        this.utilsSvc.presentToast({
          message: 'Mascota perdida publicada con éxito',
          color: 'success'
        });
        // Cerrar modal o resetear form si quieres
      } catch (error: any) {
        this.utilsSvc.presentToast({
          message: error.message || 'Error al publicar mascota perdida',
          color: 'danger'
        });
      } finally {
        loading.dismiss();
      }
    }
  }
}
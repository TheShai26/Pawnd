import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  standalone: false,
  selector: 'app-add-update-post',
  templateUrl: './add-update-post.component.html',
  styleUrls: ['./add-update-post.component.scss'],
})
export class AddUpdatePostComponent implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    petName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    peType: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
    descriptionPet: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(20)]),
    lastUbiPet: new FormControl('', [Validators.required, Validators.minLength(4)]),
  })

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)

  ngOnInit() {
  }

  // ===== Tomar / selccionar imagen =========
  async takeImage() {
    const dataUrl = await (await this.utilsSvc.takePicture('Imagen de la mascota')).dataUrl
    this.form.controls.image.setValue(dataUrl);
  }

  async submit() {

    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User).then(async res => {

        await this.firebaseSvc.updateUser(this.form.value.petName);

        let uid = res.user.uid;   
        

        console.log(res);

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
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

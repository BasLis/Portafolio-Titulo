import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TabMenuComponent } from 'src/app/layout/tab-menu/page/tab-menu.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MisRecetasService } from 'src/app/core/services/mis-recetas.service';
import { RecetaModalComponent } from 'src/app/layout/RecetaModal/page/receta-modal.component'; // Asegúrate de que esta ruta es correcta


@Component({
  selector: 'app-mis',
  templateUrl: './mis.component.html',
  styleUrls: ['./mis.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TabMenuComponent,
    RecetaModalComponent
  ]
})
export class MisComponent implements OnInit {

  private apiUrl = 'http://localhost:3000/api/recetas';
  misRecetas: any[] = [];
  idUsuario: string = '';
  nom_rec: string = '';

  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient,
    private misRecetasService: MisRecetasService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.idUsuario = payload.id;

      this.misRecetasService.obtenerRecetas(this.idUsuario).subscribe({
        next: (data) => {
          console.log('✅ Recetas cargadas', data);
          this.misRecetas = data;
          console.log('Recetas procesadas:', this.misRecetas.map(r => r.nombre_receta));

        },
        error: (err) => {
          console.error('❌ Error al cargar recetas', err);
        }
      });
    }
  }


  obtenerRecetas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?id_usuario_creador=${this.idUsuario}`);
  }

  agregarReceta() {
    console.log('Agregar receta');
    // Aquí puedes redirigir a un formulario o abrir un modal
  }

  editarReceta(receta: any) {
    console.log('Editar receta:', receta);
    // Puedes abrir un modal o navegar a otra página con el ID
  }

  async eliminarReceta(receta: any) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar receta?',
      message: `¿Estás seguro de que deseas eliminar "${receta.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.misRecetas = this.misRecetas.filter(r => r.id_recetas !== receta.id_recetas);
          }
        }
      ]
    });

    await alert.present();
  }

  async abrirModalReceta(receta: any) {
    console.log('Click detectado:', receta);
    const modal = await this.modalCtrl.create({
      component: RecetaModalComponent,
      componentProps: {
        receta: receta
      }
    });
    await modal.present();
  }


  handleCardClick(event: MouseEvent, receta: any) {
    const target = event.target as HTMLElement;
  
    if (target.closest('ion-button')) {
      return; // Evita abrir el modal si se hizo clic en un botón
    }
  
    this.abrirModalReceta(receta);
  }
  

}




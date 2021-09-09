import { Component, OnInit } from '@angular/core';
import { CuponService } from 'src/app/services/cupon.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
declare var iziToast : any;
declare var jQuery : any;
declare var $:any;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {

  public cupones : Array<any> = [];
  public load_data = true;
  public page = 1;
  public pageSize = 10;
  public filtro = '';
  public token;
  public url;

  constructor(
    private _cuponService : CuponService
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      response => {
        this.cupones = response.data;
        this.load_data = false;
      }
    )
  }

  init_data(){
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      response => {
        this.cupones = response.data;
        this.load_data = false;
      }
    )
  }

  filtrar(){
    if(this.filtro){
      this.init_data();
    }
  }

  resetear(){
    this.filtro = '';
    this.init_data();
  }

  eliminar(id:any){
    this._cuponService.eliminar_cupon_admin(id,this.token).subscribe(
      response =>{
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se elimino correctamente el cupón.'
        });
        //Ocultar modal
        $('#delete-'+id).modal('hide');
        //Eliminar el backdrop
        $('.modal-backdrop').removeClass('show');

        this.init_data();

      }, 
      error=>{
        console.log(error);
      }
    )
  }
}

import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable } from "rxjs";
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  //Peticion para llamar al backend
  login_admin(data:any):Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + 'login_admin' , data , {headers: headers});
  }
  //Para obtener el token del usuario que inicio sesion para que no vuelva a loguearse
  getToken(){
    return localStorage.getItem('token');
  }

  //Autentificacion y con Roles de cada admin
  public isAuthenticated(allowRoles : string[]):boolean{
    //Agregando validaciones: 
    //-Existe un token de este usuario
    const token = localStorage.getItem('token');

    if(!token){
      return false;
    }
    //-Comprobar si el token es valido (MUY IMPORTANTE - REVISAR DESPUES)
    try{ 
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);
      
      console.log(decodedToken)

      if(helper.isTokenExpired(token)){
        localStorage.clear();
        return false;
      }

      if(!decodedToken){
        console.log('NO ES VALIDO');
        localStorage.removeItem('token');
        return false;
       }
    }catch(error) {
      localStorage.removeItem('token');
      return false;
    }
    //Tendran acceso a la pagina solo los usuarios que cuentan con rol admin
    return allowRoles.includes(decodedToken['role']);
  }

  listar_clientes_filtro_admin(tipo:any,filtro:any, token:any):Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.get(this.url + 'listar_clientes_filtro_admin/' + tipo + '/' + filtro , {headers: headers});

  }

  obtener_config_admin(token:any):Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.get(this.url + 'obtener_config_admin/',{headers: headers});

  }

  actualiza_config_admin(id:any,data:any,token:any):Observable<any> {
    
    if(data.logo){
      let headers = new HttpHeaders({'Authorization' : token});
      const fd = new FormData();
      fd.append('titulo' , data.titulo);
      fd.append('serie' , data.serie);
      fd.append('correlativo' , data.correlativo);
      fd.append('categorias' , data.categorias);
      fd.append('logo' , data.logo);

      return this._http.put(this.url + 'actualiza_config_admin/' + id,fd,{headers: headers});
    }else{  
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.put(this.url + 'actualiza_config_admin/'+id,data,{headers: headers});
  }
}

  obtener_config_publico():Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'obtener_config_publico' , {headers: headers});
}

}

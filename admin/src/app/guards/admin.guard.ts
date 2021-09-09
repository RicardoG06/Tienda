import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from "src/app/services/admin.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( private _adminService: AdminService, private _router: Router){

  }

  //Te permite entrar al home solo si estas logueado o encuentra un token , de lo contrario te regresara al login
  canActivate():any{
    if(!this._adminService.isAuthenticated(['admin'])){
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

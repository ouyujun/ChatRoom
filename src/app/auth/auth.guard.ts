import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberServices } from '../service/member.service';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

public token:any;
  constructor(
    private mainService: MemberServices,
    private router: Router,
    private cookieService:CookieService,

  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.token =this.cookieService.get('test.token');
     if(this.token ===""){
         this.router.navigate(['memberlogin']);
         return false;
     }else{
        return true;
     }
  }
  //  canActivate(
  //      next:ActivatedRouteSnapshot,

  //    route: ActivatedRouteSnapshot,
  //    state: RouterStateSnapshot): boolean {
  //     if(this.mainService.isloginok.value){
  //     return true
  //    }else{
  //        this.router.navigate(['/memberlogin'])
  //    }
  //    return false;
  //  }
}

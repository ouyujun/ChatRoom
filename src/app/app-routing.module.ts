import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './auth/auth.guard';
import { AppComponent } from './app.component';
import { Error404Component } from './error404/error404.component';
import { MemberLoginComponent } from './member-login/member-login.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { MessageComponent } from './message/message.component';
import { WebIndexComponent } from './web-index/web-index.component';
import { WebContentComponent } from './web-content/web-content.component';


const routes: Routes = [
  { path: '', component: WebIndexComponent, canActivate: [AuthGuard]},
  { path: 'memberlogin', component: MemberLoginComponent },
  { path: 'layout', component: LayoutComponent, canActivate: [AuthGuard]},
  { path: 'error404', component: Error404Component, canActivate: [AuthGuard] },
  { path: 'webindex', component: WebIndexComponent, canActivate: [AuthGuard] },
  // {path: 'weblayout',   component: WebLayoutComponent,canActivate:[AuthGuard]},
  {
    path: 'webcontent', component: WebContentComponent, canActivate: [AuthGuard], children: [
      { path: 'message', component: MessageComponent },
      { path: 'login', component: LoginComponent },
    ]
  },
  { path: '**', component: Error404Component },

  //  ,{
  //     path: 'callback',
  //     loadChildren: () => import('./callback/callback.module').then(mod => mod.CallbackModule),
  //     canActivate: [AuthGuard],
  //   }
  //redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],//, { enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule {

}

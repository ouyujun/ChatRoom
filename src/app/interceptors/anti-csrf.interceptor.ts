// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpHeaders
// } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AntiCsrfInterceptor implements HttpInterceptor {

//   constructor() { }

//   intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     let csrf_token = sessionStorage.getItem('csrf_token');
//     if (csrf_token) {
//       // console.log(csrf_token);
//       req = req.clone({
//         withCredentials: true,
//         headers: new HttpHeaders({
//           "X-XSRF-TOKEN": csrf_token
//         })
//       })
//     }
//     return next.handle(req);
//   }
// }

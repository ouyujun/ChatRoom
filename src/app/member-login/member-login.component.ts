import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatbotService } from '../service/chatbot.service';
import { MemberServices } from '../service/member.service';
import { CookieService } from 'ngx-cookie-service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-member-login',
  templateUrl: './member-login.component.html',
  styleUrls: ['./member-login.component.scss']
})
export class MemberLoginComponent implements OnInit {
  passwordVisible = false;
  password?: string;
  constructor(
    private mainService: MemberServices,
    private router: Router,
    private fb: FormBuilder,
    private cookieService:CookieService,
  ) { }
  validateForm!: FormGroup;
  islogin = true;
  isenter = false;
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
  submitForm(): void {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  userName: string = ""
  passWord: string = ""
  OnEnter() {
    var data = {
      username: this.userName,
      password: this.passWord
    }
    this.mainService.onLogin(data).subscribe((res: any) => {
      if (res.isAuth) {
        // this.isenter = !this.isenter;
        // this.router.navigate(['/layout'])
        this.islogin = false;
        this.mainService.isloginok.next(true)
        this.cookieService.set('test.token', 'Hello World');
        // let message =  {type: 'open', link:'http://localhost:1337/#/layout'};
        // //子窗口向父窗口發送消息，消息中包含我們想跳轉的鏈接
        // window.parent.postMessage(message,'http://192.168.230.50:5569/');
        this.router.navigate([ 'webindex' ])
      }
    }, error => {
      alert("帳號或密碼輸入錯誤")
    })
  }
  
}
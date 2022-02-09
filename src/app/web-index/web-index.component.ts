import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatbotService } from '../service/chatbot.service';
import { MemberServices } from '../service/member.service';
import { ConfigLoaderService } from '../service/config-loder.service'; //Main.Url(API URL、IMG URL)
import { Router } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-web-index',
  templateUrl: './web-index.component.html',
  styleUrls: ['./web-index.component.scss']
})
export class WebIndexComponent implements OnInit {
  validateForm!: FormGroup;
  islogin = true;
  isenter = false;
  pdfURL;
  submitForm(): void {
    if (this.validateForm.valid) {
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  constructor(   
    private mainUrl: ConfigLoaderService,
    private ChatbotService: ChatbotService,
    private mainService: MemberServices,
    private router: Router,
    private fb: FormBuilder,
    private domSanitizer : DomSanitizer,
    ) {
   }
   iframeUrl = this.mainUrl.appIframe;
   photoURL() {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.iframeUrl);
  }
   istoken: string = ""
   ngOnInit(): void {
     this.iframeUrl= this.mainUrl.appIframe;
     this.ChatbotService.isAuth();
     this.mainService.getAntiCsrfToken().subscribe((res: any) => {
       this.istoken = res.token;
 
     })
     this.validateForm = this.fb.group({
       userName: [null, [Validators.required]],
       password: [null, [Validators.required]],
       remember: [true]
     });
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
      }
    }, error => {
      alert("帳號或密碼輸入錯誤")
    })

  }
}

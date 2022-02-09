import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_TW } from 'ng-zorro-antd/i18n';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { SwiperModule } from 'swiper/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';

// import { CallbackModule } from './callback/callback.module';
import { MessageComponent } from "./message/message.component";
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SixpalacesComponent } from './sixpalaces/sixpalaces.component';
import { ConfigLoaderService } from './service/config-loder.service';
// import { AntiCsrfInterceptor } from './interceptors/anti-csrf.interceptor';
import { WebIndexComponent } from './web-index/web-index.component';
import { WebLayoutComponent } from './web-layout/web-layout.component';
import { Error404Component } from './error404/error404.component';
import { MemberLoginComponent } from './member-login/member-login.component';

import { PreloadFactory } from "./service/preload-service.factory";
import { SharevarService } from './service/sharevar.service';
import { CustomerService } from './service/customer.service';
import { HistoryService } from './service/history.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './auth/auth.guard';
import { WebContentComponent } from './web-content/web-content.component';

import { SanitizerPipe } from './pipe/sanitizer.pipe';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    LoginComponent,
    LayoutComponent,
    SixpalacesComponent,
    WebIndexComponent,
    WebLayoutComponent,
    Error404Component,
    MemberLoginComponent,
    WebContentComponent,
    SanitizerPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SlickCarouselModule,
    NzButtonModule,
    NzModalModule, 
    NzGridModule,
    NzCardModule,
    NzInputModule,
    NzIconModule,
    NzLayoutModule,
    NzSpaceModule,
    NzToolTipModule,
    NzAvatarModule,
    NzCarouselModule,
    NzPipesModule,
    NzStatisticModule,
    NzBackTopModule,
    NzSpinModule,
    NzBadgeModule,
    NzFormModule, 
    SwiperModule,
    ReactiveFormsModule,
    NzResultModule,
    NzSelectModule,
  ],
  providers: [
   
    { provide: NZ_I18N, useValue: zh_TW },
    ConfigLoaderService,
    {
      provide: APP_INITIALIZER,
      deps: [
        ConfigLoaderService
      ],
      multi: true,
      useFactory: PreloadFactory
    },
    SharevarService, 
    CustomerService, 
    HistoryService,
    AuthGuard,
    CookieService,
    {provide:LocationStrategy,useClass:HashLocationStrategy},
    // { provide: HTTP_INTERCEPTORS,useClass: AntiCsrfInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

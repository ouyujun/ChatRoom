import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
@Injectable()

export class SharevarService {
  public isSpinning = new BehaviorSubject<boolean>(false);
}
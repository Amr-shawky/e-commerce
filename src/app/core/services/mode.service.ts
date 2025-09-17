import {Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Mode } from '../models/api.interface';


@Injectable({
  providedIn: 'root',
})
export class ModeService {
    mode = new BehaviorSubject<Mode>('light');
    toggleMode() {
        // use local storage to persist mode
        this.mode.next(this.mode.value === 'light' ? 'dark' : 'light');
    }
    getMode() {
        return this.mode.value;
    }
}

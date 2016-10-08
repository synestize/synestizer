import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import webrtc from 'webrtc-adapter';

export const deviceSubject  = new BehaviorSubject([]);

Observable.fromPromise(
  navigator.mediaDevices.enumerateDevices()
).subscribe((f) => deviceSubject.next(f));

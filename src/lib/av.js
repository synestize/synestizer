import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import webrtc from 'webrtc-adapter';

export const deviceSubject  = new BehaviorSubject();

Observable::fromPromise(
  navigator.mediaDevices.enumerateDevices()
).subscribe((f) => deviceSubject.next(f));

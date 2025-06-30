import { BehaviorSubject, from } from 'rxjs';
import webrtc from 'webrtc-adapter';

export const deviceSubject  = new BehaviorSubject([]);

from(
  navigator.mediaDevices.enumerateDevices()
).subscribe((f) => deviceSubject.next(f));

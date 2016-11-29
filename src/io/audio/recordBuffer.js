import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { toObservable } from '../../lib/rx_redux'
import  {
  setRecordBuffer,
  record,
} from '../../actions/audio'
import {
  mod,
  wrap
} from '../../lib/math'

import Tone from 'tone/build/Tone.js'

export default function init(store, signalio, audio, midi) {
  let initState = store.getState();
  let recordBuffer = initState.__volatile.audio.record.recordBuffer;
  let isRecording = initState.__volatile.audio.record.recording;
  toObservable(store).pluck(
    '__volatile', 'audio', 'record', 'recording',
  ).distinctUntilChanged().subscribe((val)=>{
    isRecording = val;
    if (val) {
      // Do actual recording here
      let recorder = new Tone.Recorder(1);
      
    }
  });
  toObservable(store).pluck(
    '__volatile', 'audio', 'record', 'recordBuffer',
  ).distinctUntilChanged().subscribe((val)=>{
    recordBuffer = val
  });
  return {
  }
};

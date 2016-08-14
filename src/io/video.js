import Rx from 'rxjs/Rx'
/*
import {Subject} from 'rxjs/Subject'
import {Observable} from 'rxjs/Observable'
import {Observer} from 'rxjs/Observer'
import {Scheduler} from 'rxjs/Scheduler'
import {distinctUntilChanged} from 'rxjs/operator/distinctUntilChanged';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {filter} from 'rxjs/operator/filter';
import {pluck} from 'rxjs/operator/pluck';
*/
import  {
  addSourceSignal,
  removeSourceSignal,
} from '../actions/signal'

import {deviceSubject} from '../lib/av'
import Videoworker_ from 'worker!./video/videoworker'
import {
  setValidVideoSource,
  setCurrentVideoSource,
  setAllVideoSources } from '../actions/video'
import { toObservable } from '../lib/rx_redux'
import { clip1 } from '../lib/transform'


export default function init(store, signalio, videoDom) {
  //set up video system
  const canvasElem = videoDom.querySelector('canvas');
  const videoElem = videoDom.querySelector('video');
  const gfxCtx = canvasElem.getContext('2d');

  //hardware business
  let sources = new Map(); //id -> device
  let source; //device

  let signalKeys;
  let signalNames;
  let signalNameFromKey;

  //worker thread business
  const videoworker =  Videoworker_();
  window.videoworker = videoworker;
  window.Videoworker_ = Videoworker_;

  const PIXELDIM=64;

  function doVideoPlumbing(key) {
    source = sources.get(key);
    canvasElem.width = PIXELDIM;
    canvasElem.height = PIXELDIM;

    Rx.Observable.fromPromise(
      navigator.mediaDevices.getUserMedia({deviceId:key, video:true})
    ).subscribe(function(mediaStream) {
      //we can play the video now, but we need to get video metadata before the dimensions work etc, so we start from the onloaded event.
      Rx.Observable.fromEvent(
        videoElem, "loadedmetadata").subscribe(pumpPixels);
      videoElem.src = window.URL.createObjectURL(mediaStream);
      videoElem.play();
    });
  }

  function grabPixels() {
    let vw, vh, vAspect;
    let xoffset, yoffset, vsize;
    /*
    This should return the size of the *video*,
    not the *video element*,
    although it may also return nonsense for the first few frames.
    so we only do this on the loadedmetadata event,
    */
    vw = videoElem.videoWidth;
    vh = videoElem.videoHeight;
    //so once again we guess!
    vAspect = vw/vh;
    vsize = Math.min(vw, vh);
    if (vAspect < 1){ //taller than wide
        xoffset = 0;
        yoffset = Math.floor((vh-vsize)/2);
    } else { //wider than tall
        xoffset = Math.floor((vw-vsize)/2);
        yoffset = 0;
    };
    // console.debug("cv", vw, vh, vAspect, vsize, xoffset, yoffset);
    // The first few frames get lost in Firefox, raising exceptions
    // We make sure this does not break the whole loop by
    // using a try..catch
    // TODO: check that this is still true
    try {
      //slice a square section out of the video
      //looks a bit sqished on my laptop, but whatever.
      gfxCtx.drawImage(
          videoElem,
          xoffset, yoffset, xoffset+vsize, yoffset+vsize,
          0, 0, PIXELDIM, PIXELDIM
      );
      return gfxCtx.getImageData(
          0, 0,
          PIXELDIM, PIXELDIM).data || [];
    } catch (e) {
        console.debug("error getting video frame", e);
    }
  }
  function pumpPixels() {
    let p = grabPixels();
    statsInbox.next({type:"pixels", payload: p})
  }

  function updateVideoIO(mediadevices) {
    /*
    updates lists of available devices.
    */
    let sourceNames = new Map();
    Rx.Observable.from(mediadevices).filter(
      (dev) => ( dev.kind==="videoinput" )
    ).subscribe(function (dev){
      sources.set(dev.deviceId, dev);
      sourceNames.set(dev.deviceId, dev.label);
    });
    store.dispatch(setAllVideoSources(sourceNames));
    //If there is a device, select it.
    if (sourceNames.size >= 1) {
      store.dispatch(setCurrentVideoSource(sourceNames.keys().next().value));
    }
  };

  //our observer of pixel arrays
  const statsInbox = {
    next: ({type, payload}) => {
      // special for array sharing
      if (payload.buffer !== undefined) {
        videoworker.postMessage({type, payload}, [payload.buffer]);
      } else {
        videoworker.postMessage({type, payload});
      }
    }
  };
  const statsOutbox = Rx.Observable.create(function (obs) {
      videoworker.onmessage = function (e) {
        obs.next(e.data);
      };
      videoworker.onerror = function (err, ...args) {
        console.warn(err, args);
        obs.error(err);
      };
      return function () {
        videoworker.terminate();
      };
  });
  const statsSubject = Rx.Subject.create(statsInbox, statsOutbox).share();

  statsSubject.filter((x)=>(x.type==="statmeta")).subscribe(
    ({type, payload}) => {
      ({signalKeys, signalNames} = payload);
      signalNameFromKey = {};
      // console.debug("signalKeys", signalKeys);
      // console.debug("signalNames", signalNames);

      /*
      // This erases prior video signals; however it also erases their settings,
      // which is not what one wants.
      // rather, I should use set differences to change where necessary
      let current = store.getState().signal.sourceSignalMeta;
      for (let signalKey of Object.keys(current)) {
        if (signalKey.indexOf('video-')===0){
          store.dispatch(removeSourceSignal(signalKey, signalNames[statKey][idx]))
        }
      }
      */
      //I could probably stitch these together with Rx
      for (let statKey in signalKeys) {
        signalKeys[statKey].map((signalKey, idx) => {
          store.dispatch(addSourceSignal(signalKey, signalNames[statKey][idx]))
        });
      }
    }
  );
  statsSubject.filter((x)=>(x.type==="results")).subscribe(
    ({type, payload}) => {
      //console.debug("got stuff back", payload);
      //report data streams
      statsStreamSpray(payload);
      //Now repeat
      Rx.Scheduler.asap.schedule(
        pumpPixels,
        20
      );
    }
  );
  function statsStreamSpray(x) {
    const sourceUpdate = {}
    //let sourceSignalMeta = store.getState().signal.sourceSignalMeta;
    for (let statKey in x) {
      const signalVals = x[statKey]
      for (let i=0;i<signalVals.length;i++){
        let signalKey = signalKeys[statKey][i]
        let value = signalVals[i]
        if ((value < -1) || (value > 1)) {
          console.warn("STATISTIC OUT OF RANGE", signalKey, value);
          value = clip1(value);
        };
        sourceUpdate[signalKey] = value;
      }
    }
    //console.debug('SPRAYED', sourceUpdate);
    signalio.sourceUpdates.next(sourceUpdate);
  }

  statsInbox.next({
    type: 'settings',
    payload: {
      statModels: {Moment: {PIXELDIM: PIXELDIM}}
    }
  });

  deviceSubject.subscribe(
    updateVideoIO,
    (err) => console.debug(err.stack)
  );
  const storeStream = toObservable(store);
  storeStream.pluck('source').distinctUntilChanged().subscribe(
    (key) => {
      doVideoPlumbing(key);
      console.log("vidkey", key);
    }
  )
};

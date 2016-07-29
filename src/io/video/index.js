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
import webrtc from 'webrtc-adapter'
import Videoworker_ from 'worker!./videoworker'
import { setValidVideoSource, setCurrentVideoSource, setAllVideoSources } from '../../actions/video'
import { toObservable } from '../../lib/rx_redux'
import { clip1 } from '../../lib/transform'


export default function init(store, signalio, videoDom) {
  //set up video system
  const canvasElem = videoDom.querySelector('canvas');
  const videoElem = videoDom.querySelector('video');
  const gfxCtx = canvasElem.getContext('2d');

  //hardware business
  let videosources = new Map(); //id -> device
  let videosource; //device


  //worker thread business
  const videoworker =  Videoworker_();
  window.videoworker = videoworker;
  window.Videoworker_ = Videoworker_;

  const PIXELDIM=64;

  function doVideoPlumbing(key) {
    videosource = videosources.get(key);
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
    if (vAspect<1){ //taller than wide
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
    let allsources = new Map();
    Rx.Observable.from(mediadevices).filter(
      (dev) => ( dev.kind==="videoinput" )
    ).subscribe(function (dev){
      videosources.set(dev.deviceId,dev);
      allsources.set(dev.deviceId,dev.label);
    });
    store.dispatch(setAllVideoSources(allsources));
    //If there is only one device, select it.
    if (allsources.size===1) {
      for (let key of allsources.keys()) {
        store.dispatch(setCurrentVideoSource(key));
      }
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
  const statsSubject = Rx.Subject.create(statsInbox, statsOutbox);

  statsSubject.filter((x)=>(x.type==="statmeta")).subscribe(
    ({type, payload}) => {
      let {signalKeys, signalNames} = payload;

    }
  );
  statsSubject.filter((x)=>(x.type==="results")).subscribe(function(x) {
    //console.debug("got stuff back",x);
    //report data streams
    //statsStreamSpray(x.payload);
    //Now repeat
    Rx.Scheduler.asap.schedule(
      pumpPixels,
      20
    );
  });
  function statsStreamSpray(x) {
    for (let [key, data] of x) {
      for (let [idx, value] of data.entries()) {
        let address = "VM" + ("00" + (idx + 1)).slice(-2);
        if ((value < -1) || (value > 1)) {
          console.warn("STATISTIC OUT OF RANGE", address, value);
          value = clip1(value);
        };
        ////streamPatch.getSourceSignal(address).next(value);
      }
    }
  }

  statsInbox.next({
    type: 'settings',
    payload: {
      statModels: {Moment: {PIXELDIM: PIXELDIM}}
    }
  });

  Rx.Observable.fromPromise(
    navigator.mediaDevices.enumerateDevices()
  ).subscribe(
    updateVideoIO,
    (err) => console.debug(err.stack)
  );
  const storeStream = toObservable(store);
  storeStream.pluck('currentVideoSource').distinctUntilChanged().subscribe(
    (key) => {
      doVideoPlumbing(key);
      console.log("vidkey", key);
    }
  )
};

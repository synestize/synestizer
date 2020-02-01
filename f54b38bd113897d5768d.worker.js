!function(t){function r(n){if(e[n])return e[n].exports;var i=e[n]={exports:{},id:n,loaded:!1};return t[n].call(i.exports,i,i.exports,r),i.loaded=!0,i.exports}var e={};return r.m=t,r.c=e,r.p="",r(0)}([function(t,r,e){"use strict";function n(t){if(t&&t.__esModule)return t;var r={};if(null!=t)for(var e in t)Object.prototype.hasOwnProperty.call(t,e)&&(r[e]=t[e]);return r.default=t,r}var i=e(1),o=e(15);e(18),e(20),e(22);var s=e(25),c=n(s),u={},a=!1,h=i.Observable.fromEvent(self,"message").map(function(t){return t.data}),f=new o.Subject;f.subscribe(function(t){self.postMessage(t)}),h.filter(function(t){return"settings"===t.type}).subscribe(function(t){var r=(t.type,t.payload),e={},n={},i=!0,o=!1,s=void 0;try{for(var a,h=Object.keys(u)[Symbol.iterator]();!(i=(a=h.next()).done);i=!0){var p=a.value;delete u[p]}}catch(t){o=!0,s=t}finally{try{!i&&h.return&&h.return()}finally{if(o)throw s}}var l=!0,b=!1,y=void 0;try{for(var v,d=Object.keys(r.statModels)[Symbol.iterator]();!(l=(v=d.next()).done);l=!0){var m=v.value,w=r.statModels,_=c[m](w),x=_.fn,S=_.keys,E=_.names;u[m]=x,e[m]=S,n[m]=E}}catch(t){b=!0,y=t}finally{try{!l&&d.return&&d.return()}finally{if(b)throw y}}f.next({type:"statmeta",payload:{signalKeys:e,signalNames:n}})}),h.filter(function(t){return"pixels"===t.type}).subscribe(function(t){var r=(t.type,t.payload);if(!a){a=!0;var e={},n=!0,i=!1,o=void 0;try{for(var s,c=Object.keys(u)[Symbol.iterator]();!(n=(s=c.next()).done);n=!0){var h=s.value;e[h]=u[h](r)}}catch(t){i=!0,o=t}finally{try{!n&&c.return&&c.return()}finally{if(i)throw o}}f.next({type:"results",payload:e}),a=!1}})},function(t,r,e){"use strict";var n=e(2),i=e(3),o=e(14),s=function(){function t(t){this._isScalar=!1,t&&(this._subscribe=t)}return t.prototype.lift=function(r){var e=new t;return e.source=this,e.operator=r,e},t.prototype.subscribe=function(t,r,e){var n=this.operator,o=i.toSubscriber(t,r,e);if(n?n.call(o,this):o.add(this._subscribe(o)),o.syncErrorThrowable&&(o.syncErrorThrowable=!1,o.syncErrorThrown))throw o.syncErrorValue;return o},t.prototype.forEach=function(t,r){var e=this;if(r||(n.root.Rx&&n.root.Rx.config&&n.root.Rx.config.Promise?r=n.root.Rx.config.Promise:n.root.Promise&&(r=n.root.Promise)),!r)throw new Error("no Promise impl found");return new r(function(r,n){var i=e.subscribe(function(r){if(i)try{t(r)}catch(t){n(t),i.unsubscribe()}else t(r)},n,r)})},t.prototype._subscribe=function(t){return this.source.subscribe(t)},t.prototype[o.$$observable]=function(){return this},t.create=function(r){return new t(r)},t}();r.Observable=s},function(t,r){(function(t){"use strict";if(r.root="object"==typeof window&&window.window===window&&window||"object"==typeof self&&self.self===self&&self||"object"==typeof t&&t.global===t&&t,!r.root)throw new Error("RxJS could not find any global context (window, self, global)")}).call(r,function(){return this}())},function(t,r,e){"use strict";function n(t,r,e){if(t){if(t instanceof i.Subscriber)return t;if(t[o.$$rxSubscriber])return t[o.$$rxSubscriber]()}return t||r||e?new i.Subscriber(t,r,e):new i.Subscriber(s.empty)}var i=e(4),o=e(13),s=e(12);r.toSubscriber=n},function(t,r,e){"use strict";var n=this&&this.__extends||function(t,r){function e(){this.constructor=t}for(var n in r)r.hasOwnProperty(n)&&(t[n]=r[n]);t.prototype=null===r?Object.create(r):(e.prototype=r.prototype,new e)},i=e(5),o=e(6),s=e(12),c=e(13),u=function(t){function r(e,n,i){switch(t.call(this),this.syncErrorValue=null,this.syncErrorThrown=!1,this.syncErrorThrowable=!1,this.isStopped=!1,arguments.length){case 0:this.destination=s.empty;break;case 1:if(!e){this.destination=s.empty;break}if("object"==typeof e){e instanceof r?(this.destination=e,this.destination.add(this)):(this.syncErrorThrowable=!0,this.destination=new a(this,e));break}default:this.syncErrorThrowable=!0,this.destination=new a(this,e,n,i)}}return n(r,t),r.prototype[c.$$rxSubscriber]=function(){return this},r.create=function(t,e,n){var i=new r(t,e,n);return i.syncErrorThrowable=!1,i},r.prototype.next=function(t){this.isStopped||this._next(t)},r.prototype.error=function(t){this.isStopped||(this.isStopped=!0,this._error(t))},r.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},r.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,t.prototype.unsubscribe.call(this))},r.prototype._next=function(t){this.destination.next(t)},r.prototype._error=function(t){this.destination.error(t),this.unsubscribe()},r.prototype._complete=function(){this.destination.complete(),this.unsubscribe()},r}(o.Subscription);r.Subscriber=u;var a=function(t){function r(r,e,n,o){t.call(this),this._parent=r;var s,c=this;i.isFunction(e)?s=e:e&&(c=e,s=e.next,n=e.error,o=e.complete,i.isFunction(c.unsubscribe)&&this.add(c.unsubscribe.bind(c)),c.unsubscribe=this.unsubscribe.bind(this)),this._context=c,this._next=s,this._error=n,this._complete=o}return n(r,t),r.prototype.next=function(t){if(!this.isStopped&&this._next){var r=this._parent;r.syncErrorThrowable?this.__tryOrSetError(r,this._next,t)&&this.unsubscribe():this.__tryOrUnsub(this._next,t)}},r.prototype.error=function(t){if(!this.isStopped){var r=this._parent;if(this._error)r.syncErrorThrowable?(this.__tryOrSetError(r,this._error,t),this.unsubscribe()):(this.__tryOrUnsub(this._error,t),this.unsubscribe());else{if(!r.syncErrorThrowable)throw this.unsubscribe(),t;r.syncErrorValue=t,r.syncErrorThrown=!0,this.unsubscribe()}}},r.prototype.complete=function(){if(!this.isStopped){var t=this._parent;this._complete?t.syncErrorThrowable?(this.__tryOrSetError(t,this._complete),this.unsubscribe()):(this.__tryOrUnsub(this._complete),this.unsubscribe()):this.unsubscribe()}},r.prototype.__tryOrUnsub=function(t,r){try{t.call(this._context,r)}catch(t){throw this.unsubscribe(),t}},r.prototype.__tryOrSetError=function(t,r,e){try{r.call(this._context,e)}catch(r){return t.syncErrorValue=r,t.syncErrorThrown=!0,!0}return!1},r.prototype._unsubscribe=function(){var t=this._parent;this._context=null,this._parent=null,t.unsubscribe()},r}(u)},function(t,r){"use strict";function e(t){return"function"==typeof t}r.isFunction=e},function(t,r,e){"use strict";var n=e(7),i=e(8),o=e(5),s=e(9),c=e(10),u=e(11),a=function(){function t(t){this.closed=!1,t&&(this._unsubscribe=t)}return t.prototype.unsubscribe=function(){var t,r=!1;if(!this.closed){this.closed=!0;var e=this,a=e._unsubscribe,h=e._subscriptions;if(this._subscriptions=null,o.isFunction(a)){var f=s.tryCatch(a).call(this);f===c.errorObject&&(r=!0,(t=t||[]).push(c.errorObject.e))}if(n.isArray(h))for(var p=-1,l=h.length;++p<l;){var b=h[p];if(i.isObject(b)){var f=s.tryCatch(b.unsubscribe).call(b);if(f===c.errorObject){r=!0,t=t||[];var y=c.errorObject.e;y instanceof u.UnsubscriptionError?t=t.concat(y.errors):t.push(y)}}}if(r)throw new u.UnsubscriptionError(t)}},t.prototype.add=function(r){if(!r||r===t.EMPTY)return t.EMPTY;if(r===this)return this;var e=r;switch(typeof r){case"function":e=new t(r);case"object":if(e.closed||"function"!=typeof e.unsubscribe)break;this.closed?e.unsubscribe():(this._subscriptions||(this._subscriptions=[])).push(e);break;default:throw new Error("unrecognized teardown "+r+" added to Subscription.")}return e},t.prototype.remove=function(r){if(null!=r&&r!==this&&r!==t.EMPTY){var e=this._subscriptions;if(e){var n=e.indexOf(r);n!==-1&&e.splice(n,1)}}},t.EMPTY=function(t){return t.closed=!0,t}(new t),t}();r.Subscription=a},function(t,r){"use strict";r.isArray=Array.isArray||function(t){return t&&"number"==typeof t.length}},function(t,r){"use strict";function e(t){return null!=t&&"object"==typeof t}r.isObject=e},function(t,r,e){"use strict";function n(){try{return o.apply(this,arguments)}catch(t){return s.errorObject.e=t,s.errorObject}}function i(t){return o=t,n}var o,s=e(10);r.tryCatch=i},function(t,r){"use strict";r.errorObject={e:{}}},function(t,r){"use strict";var e=this&&this.__extends||function(t,r){function e(){this.constructor=t}for(var n in r)r.hasOwnProperty(n)&&(t[n]=r[n]);t.prototype=null===r?Object.create(r):(e.prototype=r.prototype,new e)},n=function(t){function r(r){t.call(this),this.errors=r;var e=Error.call(this,r?r.length+" errors occurred during unsubscription:\n  "+r.map(function(t,r){return r+1+") "+t.toString()}).join("\n  "):"");this.name=e.name="UnsubscriptionError",this.stack=e.stack,this.message=e.message}return e(r,t),r}(Error);r.UnsubscriptionError=n},function(t,r){"use strict";r.empty={closed:!0,next:function(t){},error:function(t){throw t},complete:function(){}}},function(t,r,e){"use strict";var n=e(2),i=n.root.Symbol;r.$$rxSubscriber="function"==typeof i&&"function"==typeof i.for?i.for("rxSubscriber"):"@@rxSubscriber"},function(t,r,e){"use strict";function n(t){var r,e=t.Symbol;return"function"==typeof e?e.observable?r=e.observable:(r=e("observable"),e.observable=r):r="@@observable",r}var i=e(2);r.getSymbolObservable=n,r.$$observable=n(i.root)},function(t,r,e){"use strict";var n=this&&this.__extends||function(t,r){function e(){this.constructor=t}for(var n in r)r.hasOwnProperty(n)&&(t[n]=r[n]);t.prototype=null===r?Object.create(r):(e.prototype=r.prototype,new e)},i=e(1),o=e(4),s=e(6),c=e(16),u=e(17),a=e(13),h=function(t){function r(r){t.call(this,r),this.destination=r}return n(r,t),r}(o.Subscriber);r.SubjectSubscriber=h;var f=function(t){function r(){t.call(this),this.observers=[],this.closed=!1,this.isStopped=!1,this.hasError=!1,this.thrownError=null}return n(r,t),r.prototype[a.$$rxSubscriber]=function(){return new h(this)},r.prototype.lift=function(t){var r=new p(this,this);return r.operator=t,r},r.prototype.next=function(t){if(this.closed)throw new c.ObjectUnsubscribedError;if(!this.isStopped)for(var r=this.observers,e=r.length,n=r.slice(),i=0;i<e;i++)n[i].next(t)},r.prototype.error=function(t){if(this.closed)throw new c.ObjectUnsubscribedError;this.hasError=!0,this.thrownError=t,this.isStopped=!0;for(var r=this.observers,e=r.length,n=r.slice(),i=0;i<e;i++)n[i].error(t);this.observers.length=0},r.prototype.complete=function(){if(this.closed)throw new c.ObjectUnsubscribedError;this.isStopped=!0;for(var t=this.observers,r=t.length,e=t.slice(),n=0;n<r;n++)e[n].complete();this.observers.length=0},r.prototype.unsubscribe=function(){this.isStopped=!0,this.closed=!0,this.observers=null},r.prototype._subscribe=function(t){if(this.closed)throw new c.ObjectUnsubscribedError;return this.hasError?(t.error(this.thrownError),s.Subscription.EMPTY):this.isStopped?(t.complete(),s.Subscription.EMPTY):(this.observers.push(t),new u.SubjectSubscription(this,t))},r.prototype.asObservable=function(){var t=new i.Observable;return t.source=this,t},r.create=function(t,r){return new p(t,r)},r}(i.Observable);r.Subject=f;var p=function(t){function r(r,e){t.call(this),this.destination=r,this.source=e}return n(r,t),r.prototype.next=function(t){var r=this.destination;r&&r.next&&r.next(t)},r.prototype.error=function(t){var r=this.destination;r&&r.error&&this.destination.error(t)},r.prototype.complete=function(){var t=this.destination;t&&t.complete&&this.destination.complete()},r.prototype._subscribe=function(t){var r=this.source;return r?this.source.subscribe(t):s.Subscription.EMPTY},r}(f);r.AnonymousSubject=p},function(t,r){"use strict";var e=this&&this.__extends||function(t,r){function e(){this.constructor=t}for(var n in r)r.hasOwnProperty(n)&&(t[n]=r[n]);t.prototype=null===r?Object.create(r):(e.prototype=r.prototype,new e)},n=function(t){function r(){var r=t.call(this,"object unsubscribed");this.name=r.name="ObjectUnsubscribedError",this.stack=r.stack,this.message=r.message}return e(r,t),r}(Error);r.ObjectUnsubscribedError=n},function(t,r,e){"use strict";var n=this&&this.__extends||function(t,r){function e(){this.constructor=t}for(var n in r)r.hasOwnProperty(n)&&(t[n]=r[n]);t.prototype=null===r?Object.create(r):(e.prototype=r.prototype,new e)},i=e(6),o=function(t){function r(r,e){t.call(this),this.subject=r,this.subscriber=e,this.closed=!1}return n(r,t),r.prototype.unsubscribe=function(){if(!this.closed){this.closed=!0;var t=this.subject,r=t.observers;if(this.subject=null,r&&0!==r.length&&!t.isStopped&&!t.closed){var e=r.indexOf(this.subscriber);e!==-1&&r.splice(e,1)}}},r}(i.Subscription);r.SubjectSubscription=o},function(t,r,e){"use strict";var n=e(1),i=e(19);n.Observable.prototype.map=i.map},function(t,r,e){"use strict";function n(t,r){if("function"!=typeof t)throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");return this.lift(new s(t,r))}var i=this&&this.__extends||function(t,r){function e(){this.constructor=t}for(var n in r)r.hasOwnProperty(n)&&(t[n]=r[n]);t.prototype=null===r?Object.create(r):(e.prototype=r.prototype,new e)},o=e(4);r.map=n;var s=function(){function t(t,r){this.project=t,this.thisArg=r}return t.prototype.call=function(t,r){return r._subscribe(new c(t,this.project,this.thisArg))},t}();r.MapOperator=s;var c=function(t){function r(r,e,n){t.call(this,r),this.project=e,this.count=0,this.thisArg=n||this}return i(r,t),r.prototype._next=function(t){var r;try{r=this.project.call(this.thisArg,t,this.count++)}catch(t){return void this.destination.error(t)}this.destination.next(r)},r}(o.Subscriber)},function(t,r,e){"use strict";var n=e(1),i=e(21);n.Observable.prototype.filter=i.filter},function(t,r,e){"use strict";function n(t,r){return this.lift(new s(t,r))}var i=this&&this.__extends||function(t,r){function e(){this.constructor=t}for(var n in r)r.hasOwnProperty(n)&&(t[n]=r[n]);t.prototype=null===r?Object.create(r):(e.prototype=r.prototype,new e)},o=e(4);r.filter=n;var s=function(){function t(t,r){this.predicate=t,this.thisArg=r}return t.prototype.call=function(t,r){return r._subscribe(new c(t,this.predicate,this.thisArg))},t}(),c=function(t){function r(r,e,n){t.call(this,r),this.predicate=e,this.thisArg=n,this.count=0,this.predicate=e}return i(r,t),r.prototype._next=function(t){var r;try{r=this.predicate.call(this.thisArg,t,this.count++)}catch(t){return void this.destination.error(t)}r&&this.destination.next(t)},r}(o.Subscriber)},function(t,r,e){"use strict";var n=e(1),i=e(23);n.Observable.fromEvent=i.fromEvent},function(t,r,e){"use strict";var n=e(24);r.fromEvent=n.FromEventObservable.create},function(t,r,e){"use strict";function n(t){return!!t&&"function"==typeof t.addListener&&"function"==typeof t.removeListener}function i(t){return!!t&&"function"==typeof t.on&&"function"==typeof t.off}function o(t){return!!t&&"[object NodeList]"===t.toString()}function s(t){return!!t&&"[object HTMLCollection]"===t.toString()}function c(t){return!!t&&"function"==typeof t.addEventListener&&"function"==typeof t.removeEventListener}var u=this&&this.__extends||function(t,r){function e(){this.constructor=t}for(var n in r)r.hasOwnProperty(n)&&(t[n]=r[n]);t.prototype=null===r?Object.create(r):(e.prototype=r.prototype,new e)},a=e(1),h=e(9),f=e(5),p=e(10),l=e(6),b=function(t){function r(r,e,n,i){t.call(this),this.sourceObj=r,this.eventName=e,this.selector=n,this.options=i}return u(r,t),r.create=function(t,e,n,i){return f.isFunction(n)&&(i=n,n=void 0),new r(t,e,i,n)},r.setupSubscription=function(t,e,u,a,h){var f;if(o(t)||s(t))for(var p=0,b=t.length;p<b;p++)r.setupSubscription(t[p],e,u,a,h);else if(c(t)){var y=t;t.addEventListener(e,u,h),f=function(){return y.removeEventListener(e,u)}}else if(i(t)){var v=t;t.on(e,u),f=function(){return v.off(e,u)}}else if(n(t)){var d=t;t.addListener(e,u),f=function(){return d.removeListener(e,u)}}a.add(new l.Subscription(f))},r.prototype._subscribe=function(t){var e=this.sourceObj,n=this.eventName,i=this.options,o=this.selector,s=o?function(){for(var r=[],e=0;e<arguments.length;e++)r[e-0]=arguments[e];var n=h.tryCatch(o).apply(void 0,r);n===p.errorObject?t.error(p.errorObject.e):t.next(n)}:function(r){return t.next(r)};r.setupSubscription(e,n,s,t,i)},r}(a.Observable);r.FromEventObservable=b},function(t,r,e){"use strict";function n(t){if(t&&t.__esModule)return t;var r={};if(null!=t)for(var e in t)Object.prototype.hasOwnProperty.call(t,e)&&(r[e]=t[e]);return r.default=t,r}function i(t){function r(t){for(var r=0;r<i;r++)rawSums[r]=0;for(var e=0;e<n;e++)for(var o=0;o<n;o++){var s=4*(n*e+o);ysvij[0]=.00117255*t[s]+.002302*t[s+1]+44706e-8*t[s+2]}return cookedMoments[Y]=u.linBipol(.4,.6,centralMoments[Y]),cookedMoments}var e=t.PIXELDIM,n=void 0===e?64:e,i=(t.LAYER1SIZE,t.LAYER2SIZE,15);new Float32Array(i);return{fn:r,keys:["video-randfilt-1"],names:["●"]}}function o(t){function r(t){o[s]=0,o[c]=0,o[a]=0;for(var r=0;r<i;r+=8)o[s]+=t[4*r+s]/255,o[c]+=t[4*r+c]/255,o[a]+=t[4*r+a]/255;return o[s]=u.linBipol(0,i,o[s]),o[c]=u.linBipol(0,i,o[c]),o[a]=u.linBipol(0,i,o[a]),o}var e=t.PIXELDIM,n=void 0===e?64:e,i=n*n,o=new Float32Array(3),s=0,c=1,a=2;return{fn:r,keys:["video-red","video-green","video-blue"],names:["Red","Green","Blue"]}}function s(t){function r(t){for(var r=0;r<o;r++)S[r]=0;for(var e=0;e<n;e++)for(var j=0;j<n;j++){var g=4*(n*e+j);M[0]=.00117255*t[g]+.002302*t[g+1]+44706e-8*t[g+2],M[1]=.5+(-66563e-8*t[g]-.00129907*t[g+1]+.00196078*t[g+2]),M[2]=.5+(.00196078*t[g]-.00164191*t[g+1]-31887e-8*t[g+2]),M[3]=j/n,M[4]=e/n,S[s]+=M[0],S[c]+=M[1],S[a]+=M[2],S[h]+=M[0]*M[3],S[f]+=M[1]*M[3],S[p]+=M[2]*M[3],S[l]+=M[0]*M[4],S[b]+=M[1]*M[4],S[y]+=M[2]*M[4],S[v]+=M[0]*M[0],S[d]+=M[0]*M[1],S[m]+=M[0]*M[2],S[w]+=M[1]*M[1],S[_]+=M[1]*M[2],S[x]+=M[2]*M[2]}return E[s]=S[s]/i,E[c]=S[c]/i,E[a]=S[a]/i,E[v]=S[v]/i-E[s]*E[s],E[w]=S[w]/i-E[c]*E[c],E[x]=S[x]/i-E[a]*E[a],E[h]=S[h]/i-.5*E[s],E[f]=S[f]/i-.5*E[c],E[p]=S[p]/i-.5*E[a],E[l]=S[l]/i-.5*E[s],E[b]=S[b]/i-.5*E[c],E[y]=S[y]/i-.5*E[a],E[d]=S[d]/i-E[s]*E[c],E[m]=S[m]/i-E[s]*E[a],E[_]=S[_]/i-E[c]*E[a],O[s]=u.linBipol(.4,.6,E[s]),O[c]=u.linBipol(.4,.6,E[c]),O[a]=u.linBipol(.4,.6,E[a]),O[v]=u.linBipol(-.05,.05,E[v]),O[w]=u.linBipol(-.05,.05,E[w]),O[x]=u.linBipol(-.05,.05,E[x]),O[d]=u.clip1(E[d]/Math.max(1e-4,Math.sqrt(E[v]*E[w]))),O[m]=u.clip1(E[m]/Math.max(1e-4,Math.sqrt(E[v]*E[x]))),O[_]=u.clip1(E[_]/Math.max(1e-4,Math.sqrt(E[w]*E[x]))),O[h]=u.clip1(E[h]/Math.max(1e-4,Math.sqrt(.08333333333*E[v]))),O[f]=u.clip1(E[f]/Math.max(1e-4,Math.sqrt(.08333333333*E[w]))),O[p]=u.clip1(E[p]/Math.max(1e-4,Math.sqrt(.08333333333*E[x]))),O[l]=u.clip1(E[l]/Math.max(1e-4,Math.sqrt(.08333333333*E[v]))),O[b]=u.clip1(E[b]/Math.max(1e-4,Math.sqrt(.08333333333*E[w]))),O[y]=u.clip1(E[y]/Math.max(1e-4,Math.sqrt(.08333333333*E[x]))),O}var e=t.PIXELDIM,n=void 0===e?64:e,i=n*n,o=15,s=0,c=1,a=2,h=3,f=4,p=5,l=6,b=7,y=8,v=9,d=10,m=11,w=12,_=13,x=14,S=new Float32Array(o),E=new Float32Array(o),O=new Float32Array(o),M=new Float32Array(5);return{fn:r,keys:["video-moment-0001","video-moment-0002","video-moment-0003","video-moment-0010","video-moment-0011","video-moment-0012","video-moment-0013","video-moment-0014","video-moment-0015","video-moment-0004","video-moment-0007","video-moment-0008","video-moment-0005","video-moment-0009","video-moment-0006"],names:["Bright","Blue","Red","Right⌑Bright","Right⌑Blue","Right⌑Red","Up⌑Bright","Up⌑Blue","Up⌑Red","Bright²","Bright⌑Blue","Bright⌑Red","Blue²","Blue⌑Red","Red²"]}}Object.defineProperty(r,"__esModule",{value:!0}),r.RandomFilter=i,r.AvgColor=o,r.Moment=s;var c=e(26),u=n(c)},function(t,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var e=function(){function t(t,r){var e=[],n=!0,i=!1,o=void 0;try{for(var s,c=t[Symbol.iterator]();!(n=(s=c.next()).done)&&(e.push(s.value),!r||e.length!==r);n=!0);}catch(t){i=!0,o=t}finally{try{!n&&c.return&&c.return()}finally{if(i)throw o}}return e}return function(r,e){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return t(r,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),n=.99609375,i=Math.atanh(1*n)/n,o=r.saturate=function(t){return Math.tanh(t/n)*n},s=r.desaturate=function(t){return u(Math.atanh(t*n)/n)},c=(r.identity=function(t){return t},r.perturb=function(t){return o(t.map(s).reduce(function(t,r){return t+r}))},r.clip=function(t,r,n){var i=[t,r].sort(),o=e(i,2);return t=o[0],r=o[1],Math.min(Math.max(n,t),r)}),u=(r.clip1=function(t){return Math.min(Math.max(t,-1),1)},r.clipinf=function(t){return Math.min(Math.max(t,-i),i)}),a=(r.linBipol=function(t,r,e){var n=r-t,i=(r+t)/2;return Math.min(Math.max(2*(e-i)/n,-1),1)},r.bipolLin=function(t,r,e){var n=r-t,i=(r+t)/2;return c(t,r,e*n*.5+i)}),h=(r.intBipol=function(t,r,e){var n=r-t,i=(r+t)/2;return c(t,r,2*(e-i)/n)},r.bipolInt=function(t,r,e){var n=r-t,i=(r+t)/2;return c(t,r,Math.round(e*n*.5+i))});r.midiBipol=function(t){return(t-63.5)/63.5},r.bipolMidi=function(t){return Math.max(Math.min(Math.round(63.5*t+63.5),127),0)},r.percBipol=function(t){return Math.min(Math.max((t-50)/50,-1),1)},r.bipolPerc=function(t){return Math.max(Math.min(Math.round(50*t+50),100),0)},r.bipolEquiOctave=function(t,r,e){var n=Math.log(t)/Math.LN2,i=Math.log(r)/Math.LN2;return Math.pow(2,a(n,i,e))},r.bipolLookup=function(t,r){var e=t.length;return e<2?t[0]:t[h(0,e-1,r)]}}]);
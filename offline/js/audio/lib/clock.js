// Perhaps better a stream of note triggers?
// Generate a stream for any given pattern?
// If they share a common clock?
// So I guess this should just run whenever, and schedule events of an 

(function(global, _, Rx){
    'use strict';
    var audio;
    window.audio = audio = window.audio || {};
    function BeatScheduler(state, pumpcallback){
        //two schedulers wrapped together for shcduling syntsh ahead of time
        // TODO: now that I've done this, I've realiszed it would
        //be easier to invoke the constructor with some custo state fuctions
        // Rx.Scheduler(now, schedule, scheduleRelative, scheduleAbsolute)
        
        /* Comparer required for scheduling priority */
        function comparer (x, y) {
            if (x > y) { return 1; }
            if (x < y) { return -1; }
            return 0;
        }
        var DIVISIONS=1/4;
        var LOOKAHEAD=1;
        var state = state || {};
        state.tempo = state.tempo || 1.0;
        state.beat = state.beat || 0;
        state.actualrealtime = state.actualrealtime ||0;
        state.intendedrealtime = 0;
        state.starttime = window.performance.now();

        pumpcallback = pumpcallback || function (stuff, logicalscheduler) {
            if (state.debug) {
                console.debug("pumpcallback", stuff, logicalscheduler.rtstate)
            }
        }
        
        var logicalscheduler = new Rx.VirtualTimeScheduler(
            LOOKAHEAD, comparer);
        logicalscheduler.rtstate = state;
        /**
         * Not quite sure how many of thesme implementions are required.
         */
        logicalscheduler.add = function (absolute, relative) {
            return absolute + relative;
        };
       
        logicalscheduler.toDateTimeOffset = function (absolute) {
            return new Date(absolute).getTime();
        };

        logicalscheduler.toRelative = function (timeSpan) {
            return timeSpan;
        };
        //helper to do audio scheduling in beats
        logicalscheduler.scheduleSynthAbsolute = function(
                params, time, playfn, resched) {
            resched = resched || function (scheduler, instate) {
                console.debug("could be rescheduling beats now", instate);
            };
            logicalscheduler.scheduleWithAbsolute(
                time,
                function(){
                    var logicalbeat = logicalscheduler.now();
                    var instate = _.extend(state, {
                        logicalbeat: logicalbeat,
                        logicalrealtime: (logicalbeat-state.beat)*1000+state.intendedrealtime,
                    }, params, {});
                    playfn(instate);
                    resched(logicalscheduler, instate);
                }
            )
        };
        //another helper to do audio scheduling in beats
        //usage:
        // scheduler.scheduleSynthRelative({stuff:"great"}, 1, function(a,b) {console.debug("playing", a,b)}, function(a,b, c) {console.debug("scheduling next note", a,b,c)});
        // scheduler.stop()
        logicalscheduler.scheduleSynthRelative = function (
                params, time, playfn, resched) {
            resched = resched || function (scheduler, instate) {
                console.debug("could be rescheduling beats now", instate);
            };
            logicalscheduler.scheduleWithRelative(
                time,
                function(){
                    var logicalbeat = logicalscheduler.now();
                    var instate = _.extend(state, {
                        logicalbeat: logicalbeat,
                        logicalrealtime: (logicalbeat-state.beat)*1000+state.intendedrealtime,
                    }, params, {});
                    playfn(instate);
                    resched(logicalscheduler, instate);
                }
            )
        };
        var rtscheduler = Rx.Scheduler.default;
        logicalscheduler.rtscheduler = rtscheduler;
        var clocktask = rtscheduler.scheduleRecursiveWithRelativeAndState(
            state,
            1000*state.tempo*DIVISIONS,
            function(instate, recurse){
                if (instate.debug) {
                    console.debug(
                        instate, rtscheduler.now(), logicalscheduler.now()
                    );
                };
                //every tick we request some more beats to play with
                pumpcallback(instate, logicalscheduler);
                logicalscheduler.advanceBy(DIVISIONS);
                instate.beat += DIVISIONS;
                instate.intendedrealtime += 1000*state.tempo*DIVISIONS;
                instate.actualrealtime = (
                    window.performance.now() - instate.starttime);
                instate.offsettime = (
                    instate.actualrealtime - instate.intendedrealtime);
                recurse(instate, Math.max(
                    1000*state.tempo*DIVISIONS-instate.offsettime, 10));
            }
        );
        logicalscheduler.stop = function () {
            clocktask.dispose();
        }
        
        return logicalscheduler;
    }
    audio.BeatScheduler = BeatScheduler;
    function playSynth(){
        
    }
    
})(this, _, Rx);

export let SIGNAL_PERIOD_MS = 4000;
export let UI_PERIOD_MS = 4000;

if (PRODUCTION){
  SIGNAL_PERIOD_MS = 1000/25;
  UI_PERIOD_MS = 100;
}

export const SIGNAL_PERIOD = SIGNAL_PERIOD_MS/1000
export const UI_PERIOD = UI_PERIOD_MS/1000
export const SIGNAL_RATE = 1/SIGNAL_PERIOD
export const UI_RATE = 1/UI_PERIOD

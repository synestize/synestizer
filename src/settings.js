export let SIGNAL_RATE = 4000;
export let UI_RATE = 4000;

if (PRODUCTION){
  SIGNAL_RATE = 1000/25;
  UI_RATE = 100;
}

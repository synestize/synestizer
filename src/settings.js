export let SIGNAL_RATE = 2000;
export let UI_RATE = 2000;

if (PRODUCTION){
  SIGNAL_RATE = 1000/25;
  UI_RATE = 100;
}

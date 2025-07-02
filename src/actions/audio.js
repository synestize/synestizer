// Legacy actions for recording functionality
// These actions affect volatile state and are used by the io layer

export const RECORD = 'RECORD';
export const RECORD_BUFFER = 'RECORD_BUFFER';

export const record = (isRecording) => ({
  type: RECORD,
  payload: isRecording
});

export const setRecordBuffer = (bufferKey) => ({
  type: RECORD_BUFFER,
  payload: bufferKey
});
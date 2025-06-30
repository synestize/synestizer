self.onmessage = (event: MessageEvent<ImageData>) => {
  const imageData = event.data;
  const data = imageData.data;
  let brightness = 0;

  // Calculate average brightness (simple grayscale approximation)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    brightness += (r + g + b) / 3;
  }

  const avgBrightness = brightness / (data.length / 4);

  // Post the result back to the main thread
  self.postMessage({ brightness: avgBrightness / 255 }); // Normalize to 0-1
};
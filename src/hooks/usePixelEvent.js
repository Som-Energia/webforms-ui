import ReactPixel from "react-facebook-pixel";

export const  usePixelEvent = ()  => {

  const triggerEvent = (eventName, pixelData = {}) => {
    ReactPixel.trackCustom(eventName, pixelData);
    const iframeUrl = import.meta.env.VITE_PIXEL_URL;
    
    if (iframeUrl) {
      const ftRandom = Math.random() * 1000000;
      const iframe = document.createElement("iframe");

      iframe.style.position = "absolute";
      iframe.style.visibility = "hidden";
      iframe.style.width = "1px";
      iframe.style.height = "1px";
      iframe.src = `${iframeUrl}&cachebuster=${ftRandom}`;

      document.body.appendChild(iframe);
    }
  }

  return {triggerEvent};
}
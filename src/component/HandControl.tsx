import React, { useEffect } from 'react';

function HandControl() {
  useEffect(() => {
    // Use correct type for videoElement (HTMLImageElement)
    const videoElement = document.getElementById('video') as HTMLImageElement | null;

    if (videoElement) {
      videoElement.src = 'http://localhost:5000/video_feed';  // Set video feed URL if the element exists
    }

    // Create WebSocket connection
    const socket = new WebSocket('ws://localhost:5000/socket.io/?EIO=3&transport=websocket');

    socket.onopen = () => {
      console.log('WebSocket Connection Established');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === 'adjust_brightness') {
        console.log(`Adjust Brightness: ${data.value}`);
      } else if (data.action === 'adjust_volume') {
        console.log(`Adjust Volume: ${data.value}`);
      }
    };

    // Clean up WebSocket connection when component unmounts
    return () => socket.close();
  }, []);

  return (
    <div>
      <h1>Hand Gesture Control</h1>
      <img id="video" alt="Hand Detection Feed" />
    </div>
  );
}

export default HandControl;

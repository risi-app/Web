import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface GestureResponse {
  action: 'adjust_brightness' | 'adjust_volume';
  value: number;
}

function HandControl() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentMode, setCurrentMode] = useState<string>('IDLE');
  const [brightness, setBrightness] = useState<number>(50);
  const [volume, setVolume] = useState<number>(50);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('gesture_response', (data: GestureResponse) => {
      if (data.action === 'adjust_brightness') {
        setBrightness(data.value);
      } else if (data.action === 'adjust_volume') {
        setVolume(data.value);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className='hand_gesture_control'>
      <h2>Advanced Hand Gesture Control</h2>
      <img 
        id="video" 
        src='http://localhost:5000/video_feed'
        alt="Hand Detection Feed" 
        width={300}
      />
      <div>
        <p>Current Mode: {currentMode}</p>
        <p>Brightness: {brightness.toFixed(2)}%</p>
        <p>Volume: {volume.toFixed(2)}%</p>
      </div>
      <div>
        <h3>Instructions:</h3>
        <ul>
          <li>Extend only your pinky finger to enter IDLE mode (all functions stop)</li>
          <li>Extend only your index finger to enter MOUSE control mode</li>
          <li>Extend index and middle fingers to enter BRIGHTNESS/VOLUME control mode</li>
          <li>There is a 1.2-second delay for all gesture detections</li>
          <li>In MOUSE mode:</li>
          <ul>
            <li>Move your wrist within the green rectangle to control the cursor</li>
            <li>Quickly touch thumb and index finger tips together for a single click</li>
            <li>Double-click by quickly touching thumb and index finger tips twice</li>
            <li>Triple-click for a right-click</li>
            <li>Touch and hold thumb and index finger tips, then move to drag</li>
            <li>Single click, then touch and hold thumb and index finger tips to scroll</li>
          </ul>
          <li>In CONTROL mode:</li>
          <ul>
            <li>Adjust the distance between thumb and index finger tips</li>
            <li>Left side of the screen controls brightness</li>
            <li>Right side of the screen controls volume</li>
          </ul>
        </ul>
      </div>
    </div>
  );
}

export default HandControl;
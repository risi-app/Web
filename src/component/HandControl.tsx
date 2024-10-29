import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface GestureResponse {
  action: 'adjust_brightness' | 'adjust_volume';
  value: number;
}

function mapRange(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
  return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}

function HandControl() {
  const [brightness, setBrightness] = useState<number>(50);
  const [volume, setVolume] = useState<number>(50);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');

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
      <div className='brightness_and_volume'>
        Brightness: {brightness.toFixed(2)}%
        <br/>
        Volume: {mapRange(volume, -66, 0, 0, 100).toFixed(0)}%
      </div>
      <br/>
      <div>
        <h3>Instructions:</h3>
        
        <ul>
          <li>새끼손가락을 펴면 IDLE 모드 진입 (모든 기능 멈춤)</li>
          <br/>
          <li>마우스 조절 모드: 검지손가락 펴기</li>
          <ul>
            초록색 사각형 안쪽에서 손목을 움직여 마우스 이동<br/>
            클릭: 엄지, 검지손가락을 빠르게 붙였다 떼기<br/>
            드래그: 엄지, 검지손가락을 붙인 상태로 이동<br/>
          </ul>
          <br/>
          <li>밝기/소리 조절 모드: 검지와 중지손가락 펴기</li>
          <ul>
            소리: 오른손 엄지, 검지, 중지 세 손가락을 이용 (화면 오른쪽 부분에서)<br/>
            밝기: 왼손 엄지, 검지, 중지 세 손가락을 이용 (화면 왼쪽 부분에서)<br/>
          </ul>
        </ul>
      </div>
    </div>
  );
}

export default HandControl;
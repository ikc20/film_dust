// src/features/watchParty/CinemaRoom.tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { initSocket } from './socketService';
import { UserAvatar } from './types';
import Avatar from './components/Avatar';
import { threeConfig } from './config/threeConfig';

const CinemaRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [users, setUsers] = useState<UserAvatar[]>([]);

  useEffect(() => {
    const socket = initSocket(roomId);
    
    socket.on('user-joined', (user: UserAvatar) => {
      setUsers(prev => [...prev, user]);
    });

    return () => { socket.disconnect(); };
  }, [roomId]);

  return (
    <View style={{ flex: 1 }}>
      <Canvas camera={threeConfig.camera}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {users.map(user => (
          <Avatar 
            key={user.id}
            position={user.position}
            modelUrl={user.avatarUrl}
          />
        ))}
      </Canvas>
    </View>
  );
};

export default CinemaRoom;
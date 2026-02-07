# 프론트엔드 연동 예제

이 문서는 React를 사용한 프론트엔드 연동 예제를 제공합니다.

## 1. 프로젝트 설정

```bash
npx create-react-app roommate-frontend
cd roommate-frontend
npm install axios socket.io-client react-router-dom
```

## 2. API 클라이언트 설정

### src/api/client.js
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - 토큰 만료 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token도 만료된 경우 로그아웃
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

## 3. API 서비스 함수

### src/api/auth.js
```javascript
import apiClient from './client';

export const authAPI = {
  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
```

### src/api/properties.js
```javascript
import apiClient from './client';

export const propertiesAPI = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get('/properties', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/properties', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.patch(`/properties/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/properties/${id}`);
    return response.data;
  },

  toggleWishlist: async (id) => {
    const response = await apiClient.post(`/properties/${id}/wishlist`);
    return response.data;
  },

  getMyProperties: async () => {
    const response = await apiClient.get('/properties/my');
    return response.data;
  },

  getWishlist: async () => {
    const response = await apiClient.get('/properties/wishlist');
    return response.data;
  },

  search: async (query) => {
    const response = await apiClient.get('/properties/search', {
      params: { q: query },
    });
    return response.data;
  },
};
```

### src/api/posts.js
```javascript
import apiClient from './client';

export const postsAPI = {
  getAll: async (page = 1, limit = 20, category) => {
    const response = await apiClient.get('/posts', {
      params: { page, limit, category },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/posts', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.patch(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },

  toggleLike: async (id) => {
    const response = await apiClient.post(`/posts/${id}/like`);
    return response.data;
  },
};
```

### src/api/uploads.js
```javascript
import apiClient from './client';

export const uploadsAPI = {
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/uploads/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiClient.post('/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
```

## 4. Socket.IO 클라이언트

### src/socket/chat.js
```javascript
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

class ChatSocket {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    this.socket.on('newMessage', (message) => {
      this.emit('newMessage', message);
    });

    this.socket.on('userTyping', (data) => {
      this.emit('userTyping', data);
    });

    this.socket.on('messageRead', (data) => {
      this.emit('messageRead', data);
    });

    this.socket.on('notification', (notification) => {
      this.emit('notification', notification);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(userId, roomId) {
    if (!this.socket) return;
    this.socket.emit('join', { userId, roomId });
  }

  sendMessage(roomId, userId, content, type = 'TEXT') {
    if (!this.socket) return;
    this.socket.emit('sendMessage', {
      roomId,
      userId,
      content,
      type,
    });
  }

  markAsRead(roomId, userId, messageId) {
    if (!this.socket) return;
    this.socket.emit('markAsRead', {
      roomId,
      userId,
      messageId,
    });
  }

  setTyping(roomId, userId, isTyping) {
    if (!this.socket) return;
    this.socket.emit('typing', {
      roomId,
      userId,
      isTyping,
    });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach((callback) => {
      callback(data);
    });
  }
}

export default new ChatSocket();
```

## 5. React 컴포넌트 예제

### src/components/Login.jsx
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import chatSocket from '../socket/chat';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await authAPI.login(email, password);
      
      // Socket 연결
      chatSocket.connect(data.accessToken);
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
```

### src/components/PropertyList.jsx
```javascript
import React, { useState, useEffect } from 'react';
import { propertiesAPI } from '../api/properties';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    city: '',
    district: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertiesAPI.getAll(filters);
      setProperties(data.properties);
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // 필터 변경 시 첫 페이지로
    }));
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="property-list">
      <div className="filters">
        <input
          type="text"
          placeholder="도시"
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
        />
        <input
          type="text"
          placeholder="구/군"
          value={filters.district}
          onChange={(e) => handleFilterChange('district', e.target.value)}
        />
        <input
          type="number"
          placeholder="최소 가격"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
        />
        <input
          type="number"
          placeholder="최대 가격"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
        />
      </div>

      <div className="properties">
        {properties.map((property) => (
          <div key={property._id} className="property-card">
            <img src={property.images[0]} alt={property.title} />
            <h3>{property.title}</h3>
            <p>{property.address}</p>
            <p>
              월세: {property.monthlyRent.toLocaleString()}원 /
              보증금: {property.deposit.toLocaleString()}원
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropertyList;
```

### src/components/Chat.jsx
```javascript
import React, { useState, useEffect, useRef } from 'react';
import chatSocket from '../socket/chat';
import { authAPI } from '../api/auth';

function Chat({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = authAPI.getCurrentUser();

  useEffect(() => {
    // 채팅방 입장
    chatSocket.joinRoom(currentUser.id, roomId);

    // 새 메시지 수신
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    };

    // 타이핑 상태 수신
    const handleUserTyping = (data) => {
      if (data.userId !== currentUser.id) {
        setIsTyping(data.isTyping);
      }
    };

    chatSocket.on('newMessage', handleNewMessage);
    chatSocket.on('userTyping', handleUserTyping);

    return () => {
      chatSocket.off('newMessage', handleNewMessage);
      chatSocket.off('userTyping', handleUserTyping);
    };
  }, [roomId, currentUser.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    chatSocket.sendMessage(roomId, currentUser.id, newMessage);
    setNewMessage('');
  };

  const handleTyping = (typing) => {
    chatSocket.setTyping(roomId, currentUser.id, typing);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === currentUser.id ? 'sent' : 'received'
            }`}
          >
            <p>{message.content}</p>
            <span className="time">
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {isTyping && <div className="typing-indicator">상대방이 입력 중...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onFocus={() => handleTyping(true)}
          onBlur={() => handleTyping(false)}
          placeholder="메시지를 입력하세요..."
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
}

export default Chat;
```

## 6. React Native 앱 연동 예제

### 설치
```bash
npx react-native init RoommateApp
cd RoommateApp
npm install axios socket.io-client @react-navigation/native
```

### API 클라이언트 (동일)
React 웹과 동일한 API 클라이언트 사용 가능

### Socket.IO 클라이언트 (동일)
React 웹과 동일한 Socket.IO 클라이언트 사용 가능

### 네이티브 컴포넌트 예제
```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { authAPI } from './api/auth';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await authAPI.login(email, password);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
```

이 예제들을 참고하여 프론트엔드와 백엔드를 연동할 수 있습니다!

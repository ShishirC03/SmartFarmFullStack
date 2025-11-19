// src/utils/socket.js
import { io } from 'socket.io-client';
import { API_BASE } from './api';

// single socket instance for the app
export const socket = io(API_BASE, { transports: ['websocket'] });

socket.on('connect', () => {
  console.log('socket connected', socket.id);
});

socket.on('connect_error', (err) => {
  console.warn('socket connect_error', err.message);
});

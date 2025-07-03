import { inject } from 'vue'

export function useSocket() {
  const socket = inject('socket')

  const connect = () => {
    if (!socket.connected) {
      socket.connect()
    }
  }

  const disconnect = () => {
    if (socket.connected) {
      socket.disconnect()
    }
  }

  const emit = (event, data, callback) => {
    socket.emit(event, data, callback)
  }

  //Te suscribes a eventos que te mande el servidor.
  const on = (event, callback) => {
    socket.on(event, callback)
  }

  //Te desuscribes de eventos que te mande el servidor.
  const off = (event, callback) => {
    socket.off(event, callback)
  }

  return {
    socket,
    connect,
    disconnect,
    emit,
    on,
    off,
    isConnected: socket.connected
  }
}
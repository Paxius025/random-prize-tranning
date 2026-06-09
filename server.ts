import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { RoomManager } from './server/store';
import { ClientToServerEvents, ServerToClientEvents, Stage } from './types';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const roomManager = new RoomManager(io);

  io.on('connection', (socket) => {
    
    // Check if it's admin (we can pass a query param from admin page)
    if (socket.handshake.query.admin === 'true') {
      socket.join('admin');
      socket.emit('stateSync', {
        stage: roomManager.getStage(),
        participantsCount: roomManager.getParticipants().length,
        completedCount: roomManager.getParticipants().filter(p => p.completed && p.stage === roomManager.getStage()).length,
        countdown: 0,
        maxParticipants: roomManager.getMaxParticipants()
      });
      io.to('admin').emit('adminSync', {
        stage: roomManager.getStage(),
        participants: roomManager.getParticipants()
      });
    }

    // Student joins
    socket.on('join', (nickname, callback) => {
      // Validate input per secure coding guidelines
      if (typeof nickname !== 'string' || nickname.length < 1 || nickname.length > 50) {
        callback({ success: false, error: 'Invalid nickname' });
        return;
      }
      
      const me = roomManager.addParticipant(socket.id, nickname);
      if (!me) {
        callback({ success: false, error: 'ห้องเต็มแล้ว (Room is full)' });
        return;
      }
      callback({ success: true, me });
    });

    socket.on('submitExpectation1', (text, callback) => {
      if (typeof text !== 'string' || text.length > 500) {
        callback({ success: false });
        return;
      }
      roomManager.updateParticipantExpectation(socket.id, 1, text);
      callback({ success: true });
    });

    socket.on('submitExpectation2', (text, callback) => {
      if (typeof text !== 'string' || text.length > 500) {
        callback({ success: false });
        return;
      }
      roomManager.updateParticipantExpectation(socket.id, 2, text);
      callback({ success: true });
    });

    socket.on('submitPhoto', (callback) => {
      roomManager.updateParticipantPhoto(socket.id);
      callback({ success: true });
    });

    socket.on('submitAddress', (province, reward, callback) => {
      if (typeof province !== 'string' || typeof reward !== 'string') {
        callback({ success: false });
        return;
      }
      roomManager.updateParticipantAddress(socket.id, province, reward);
      callback({ success: true });
    });

    // Admin Actions
    socket.on('adminAction', (action, payload) => {
      // Basic security check (would use a proper token in prod)
      if (socket.handshake.query.admin !== 'true') return;

      switch (action) {
        case 'nextStage': {
          const current = roomManager.getStage();
          if (current < Stage.END) roomManager.setStage(current + 1);
          break;
        }
        case 'prevStage': {
          const current = roomManager.getStage();
          if (current > Stage.JOIN) roomManager.setStage(current - 1);
          break;
        }
        case 'forceReveal': {
          roomManager.setStage(Stage.REVEAL);
          break;
        }
        case 'resetRoom': {
          roomManager.reset();
          break;
        }
        case 'markComplete': {
          if (payload && payload.id) {
            roomManager.markParticipantComplete(payload.id);
          }
          break;
        }
        case 'setMaxParticipants': {
          if (typeof payload === 'number' && payload > 0) {
            roomManager.setMaxParticipants(payload);
          }
          break;
        }
      }
    });

    socket.on('disconnect', () => {
      roomManager.setParticipantConnected(socket.id, false);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

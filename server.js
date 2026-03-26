const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const STUDY_TIME = 10; // demo value; change later
const BREAK_TIME = 10; // demo value; change later

const roomTimers = new Map();
const roomUsers = new Map(); // roomId -> [{ socketId, userName }]

function createRoomState() {
    return {
        phase: "study",
        timeLeft: STUDY_TIME,
        running: true,
        intervalId: null,
    };
}

function getRoomState(roomId) {
    if (!roomTimers.has(roomId)) {
        roomTimers.set(roomId, createRoomState());
    }
    return roomTimers.get(roomId);
}

function publicTimerState(state) {
    return {
        phase: state.phase,
        isStudy: state.phase === "study",
        timeLeft: state.timeLeft,
        running: state.running,
    };
}

function startRoomTimer(io, roomId) {
    const room = getRoomState(roomId);
    if (room.intervalId) return;

    room.running = true;

    room.intervalId = setInterval(() => {
        if (!room.running) return;

        room.timeLeft -= 1;

        if (room.timeLeft < 0) {
            if (room.phase === "study") {
                room.phase = "break";
                room.timeLeft = BREAK_TIME;
            } else {
                room.phase = "study";
                room.timeLeft = STUDY_TIME;
                io.to(roomId).emit("session:complete");
            }
        }

        io.to(roomId).emit("timer:update", publicTimerState(room));
    }, 1000);
}

function resetRoomTimer(io, roomId) {
    const room = getRoomState(roomId);
    room.phase = "study";
    room.timeLeft = STUDY_TIME;
    room.running = true;
    io.to(roomId).emit("timer:sync", publicTimerState(room));
}

app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer, {
        cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
        socket.on("room:join", ({ roomId, userName }) => {
            socket.join(roomId);

            socket.data.roomId = roomId;
            socket.data.userName = userName;

            // 🔥 add user to room
            if (!roomUsers.has(roomId)) {
                roomUsers.set(roomId, []);
            }

            const users = roomUsers.get(roomId);
            users.push({ socketId: socket.id, userName });

            // 🔥 broadcast updated list
            io.to(roomId).emit("room:users", users);

            socket.to(roomId).emit("chat:system", {
                id: `${Date.now()}`,
                text: `${userName} joined the room`,
            });


            const room = getRoomState(roomId);
            socket.emit("timer:sync", publicTimerState(room));

            startRoomTimer(io, roomId);
        });

        socket.on("chat:message", ({ roomId, userName, message }) => {
            io.to(roomId).emit("chat:message", {
                id: `${Date.now()}-${Math.random()}`,
                userName,
                message,
                createdAt: Date.now(),
            });
        });

        socket.on("timer:reset", ({ roomId }) => {
            resetRoomTimer(io, roomId);
        });

        socket.on("disconnect", () => {
            const { roomId, userName } = socket.data;

            if (!roomId || !userName) return;

            const users = roomUsers.get(roomId) || [];

            // ✅ FIX: assign filtered result
            const updatedUsers = users.filter(
                (u) => u.socketId !== socket.id
            );

            roomUsers.set(roomId, updatedUsers);

            // broadcast updated list
            socket.to(roomId).emit("room:users", updatedUsers);

            // send system message
            socket.to(roomId).emit("chat:system", {
                id: `${Date.now()}`,
                text: `${userName} left the room`,
            });
        });
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
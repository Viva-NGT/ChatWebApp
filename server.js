const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const PORT = 3000;

//保存されたメッセージ用の配列
const messages = [];

//静的ファイルを提供
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
//ユーザーが接続したときの処理
io.on("connection", (socket) => {
    console.log("ユーザーが接続しました");

    //保存されたメッセージを新しい接続に送信
    messages.forEach((msg) => {
        socket.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
        console.log("ユーザーが切断しました");
    });
    //メッセージを受信したときの処理
    socket.on("chat message", (msg) => {
        const timestamp = new Date().toLocaleString();
        const messageWithTimestamp = `${timestamp} - ${msg}`;
        messages.push(messageWithTimestamp);
        io.emit("chat message", messageWithTimestamp);
    });
});


server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

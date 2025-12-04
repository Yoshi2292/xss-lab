const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// メッセージ保存用（メモリ保持）
const messages = [];

// ---- CSP を付与して XSS を難しくする ----
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

// 掲示板ページ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public", "board.html"));
});

// 投稿処理
app.post("/post", (req, res) => {
  console.log("Received post:", req.body.message); // ←今回追加したログ

  messages.push(req.body.message);
  res.redirect("/stored.html");
});

// メッセージ取得API（DOM-XSSで使う）
app.get("/messages", (req, res) => {
  res.json(messages);
});

// サーバ起動
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


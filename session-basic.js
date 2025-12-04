const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 簡易的にセッション保存
const sessions = {};

// ★ URL の sid を強制的に Cookie にする（脆弱）
app.use((req, res, next) => {
    if (req.query.sid) {
        res.setHeader("Set-Cookie", `sid=${req.query.sid}; SameSite=None; Secure`);
    }
    next();
});

app.get("/", (req, res) => {
  const sid = req.cookies.sid;

  if (sid && sessions[sid]) {
    res.send(`<h2>Welcome ${sessions[sid]}</h2>
              <a href="/logout">Logout</a>`);
  } else {
    res.send(`<form method="POST" action="/login">
                <input name="user" placeholder="username">
                <button>Login</button>
              </form>`);
  }
});

app.post("/login", (req, res) => {
  const username = req.body.user;
  const sid = Math.random().toString(36).slice(2);

  sessions[sid] = username;

  // 新しい安全でない Cookie 発行
  res.setHeader("Set-Cookie", `sid=${sid}; SameSite=None; Secure`);
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  const sid = req.cookies.sid;
  delete sessions[sid];
  res.setHeader("Set-Cookie", "sid=; Max-Age=0; SameSite=None; Secure");
  res.redirect("/");
});

app.listen(3001, () => console.log("Session server at http://localhost:3001"));


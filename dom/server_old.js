const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

// XSS 実験ページ
app.get('/', (req, res) => {
  res.send(`
    <h2>XSS Test</h2>
    <form method="POST">
      <input name="msg" placeholder="Type something">
      <button>Send</button>
    </form>
  `);
});

// 反射型 XSS の実験ポイント
app.post('/', (req, res) => {
  const msg = req.body.msg;
  res.send(`
    <h2>Result</h2>
    <p>You typed: ${msg}</p>
    <a href="/">Back</a>
  `);
});

app.use(express.static(__dirname));
app.listen(3000, () => console.log('XSS lab running on http://localhost:3000'));


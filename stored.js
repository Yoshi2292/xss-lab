const express = require("express");
const app = express();
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

let posts = []; // DB の代わり（配列）

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    let html = `
        <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>
        <h2>Mini Board (Stored XSS)</h2>
        <form method="POST">
            <input name="msg" placeholder="write a message">
            <button>Send</button>
        </form>
        <hr>
        <h3>Messages:</h3>
    `;

    posts.forEach(p => {
        const clean = DOMPurify.sanitize(p);
        html += `<div>${clean}</div>`;
    });

    //posts.forEach(p => {
     //   html += `<div>${p}</div>`;  // ← 危険：エスケープなし
    //});

    res.send(html);
});

app.post("/", (req, res) => {
    const msg = req.body.msg;
    posts.push(msg);
    res.redirect("/");
});

app.listen(3001, () => console.log("http://localhost:3001"));


const express = require("express");
const app = express();

app.get("/search", (req, res) => {
    const q = req.query.q;
    res.send(`
        <h2>Search Result</h2>
        You searched: ${q}
    `);
});

app.listen(3000, () => console.log("http://localhost:3000/search?q=test"));


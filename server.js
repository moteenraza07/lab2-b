const express = require("express");
const fs = require("fs").promises;

const app = express();
const PORT = 3000;

const myData = { id: 1, value: 100, name: "Moteen Raza" };

function dataCallBack(cb) {
  setTimeout(() => {
    cb(null, myData);
  }, 1000);
}

function getDataPromise() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(myData);
    }, 1000);
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/callback", (req, res) => {
  dataCallBack((err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

// /promise
app.get("/promise", (req, res) => {
  getDataPromise()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// /async
app.get("/async", async (req, res) => {
  try {
    const data = await getDataPromise();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// /file
app.get("/file", async (req, res) => {
  try {
    const content = await fs.readFile("data.txt", "utf8");
    res.send(content);
  } catch (err) {
    res.status(500).send("Could not read file");
  }
});

// /chain (login -> fetch -> render)
app.get("/chain", async (req, res) => {
  try {
    await delay(500);
    const loginMsg = "Login done";

    await delay(500);
    const fetchMsg = "Fetch done";

    await delay(500);
    const renderMsg = "Render done";

    res.json({
      steps: [loginMsg, fetchMsg, renderMsg],
      data: myData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));

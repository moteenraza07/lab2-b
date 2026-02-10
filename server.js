// import express
const express = require("express");
// import fs
const fs = require("fs").promises;

// create the express app
const app = express();

// server port
const PORT = 3000;

// my data that will be returned
const myData = { id: 1, value: 100, name: "Moteen Raza" };

// callback function
function dataCallBack(cb) {
  setTimeout(() => {
    // return after 1 second
    cb(null, myData);
  }, 1000);
}

// promise function
function getDataPromise() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(myData);
    }, 1000);
  });
}

// helper function
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// callback endpoint

app.get("/callback", (req, res) => {
  dataCallBack((err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    // send data to browser
    res.json(data);
  });
});

// promise endpoint
app.get("/promise", (req, res) => {
  getDataPromise()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// async endpoint
app.get("/async", async (req, res) => {
  try {
    const data = await getDataPromise();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// file endpoint
app.get("/file", async (req, res) => {
  try {
    const content = await fs.readFile("data.txt", "utf8");
    res.send(content);
  } catch (err) {
    res.status(500).send("Could not read file");
  }
});

// chain (login -> fetch -> render)
app.get("/chain", async (req, res) => {
  try {
    // login
    await delay(500);
    const loginMsg = "Login done";

    // fetch
    await delay(500);
    const fetchMsg = "Fetch done";

    // output
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

// start server
app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));

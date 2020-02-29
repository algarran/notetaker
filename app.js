const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.static("assets"));

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./notes.html"));
});

app.get("/api/notes", (req,res) => {
    res.sendFile(path.join(__dirname, "/db.json"));
});

app.post("/api/notes", (req, res) => {
    
    const data = req.body;
    const id = Date.now();
    const db = fs.readFileSync(path.join(__dirname, "/db.json"), "utf8");
    
    const note = {
      id: id,
      title: data.title,
      text: data.text,
    };

    const database = JSON.parse(db)

    database.push(note);
    fs.writeFileSync(path.join(__dirname, "/db.json"), JSON.stringify(database), "utf8");
    res.sendFile(path.join(__dirname, "/db.json"));
  });
  
  app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    const db = fs.readFileSync(path.join(__dirname, "/db.json"), "utf8");
    
    const database = JSON.parse(db);
    for (let x = 0; x < database.length; x++) {
      if (database[x].id.toString() === id) {
        database.splice(x, 1);
        break;
      }
    }
    
    fs.writeFileSync(path.join(__dirname, "/db.json"), JSON.stringify(database), "utf8");
    res.sendFile(path.join(__dirname, "/db.json"));
  });



app.listen(PORT, function() {
    console.log("App is listening on PORT: " + PORT)
});
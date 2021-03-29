// mongodb+srv://ahm:<password>@devlink.w8izj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const express = require("express");
const app = express();

//
app.get("/", (req, res) => {
  res.send("Working!");
});

// ========================== Listening =============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Connected at ${PORT}`));

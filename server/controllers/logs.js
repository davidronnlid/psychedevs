// Define a route to handle user login
app.post("/vas", async (req, res) => {
  console.log(req.body.date + req.body.value + " received");
  const { date, value } = req.body;
  try {
    await client.connect();

    const database = client.db("app_users");
    const users = database.collection("user_account_data");

    // Find the user in the database by username
    const user = await users.findOne({ username });
    console.log("Found " + user.username);

    // Compare the password entered by the user with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log("Successfully logged in " + user._id);

      const vas_mood_logs = database.collection("vas_mood_logs");

      const query = { user_id: user._id };
      const foundUserLogs = await vas_mood_logs.findOne(query);

      if (foundUserLogs) {
        console.log("User logs " + foundUserLogs);
      } else {
        console.log("No logs found for this user");
      }
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});

import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`
    ✅ Server running on http://localhost:${PORT}
    To view API documentation, visit http://localhost:${PORT}/api-docs
    `);
});

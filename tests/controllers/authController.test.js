const request = require("supertest");
const app = require("../../main/controllers/authControllers");
const fs = require("fs");
const pathResolver = require("path");

describe("authControllers", () => {
  describe("POST /signup", () => {
    it("should create a new user with valid data and return a 201 status code", async () => {
      const response = await request(app)
        .post("/signup")
        .send({ email: "example@gmail.com" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", "QR Code sent");
      expect(response.body).toHaveProperty("token");

      const users = JSON.parse(
        fs.readFileSync(pathResolver.join("./main/data/users.json"))
      );
      const user = users.find((user) => user.email === "example@gmail.com");
      expect(user).toHaveProperty("email", "example@gmail.com");
      expect(user).toHaveProperty("token", response.body.token);
    });

    it("should return a 500 status code with an error message if there is an error", async () => {
      const response = await request(app).post("/signup");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("PUT /update-user", () => {
    it("should update the user token with valid data and return a 201 status code", async () => {
      const users = JSON.parse(
        fs.readFileSync(pathResolver.join("./main/data/users.json"))
      );
      const user = users[0];

      const response = await request(app)
        .put("/update-user")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ email: user.email });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", "QR Code sent and saved");
      expect(response.body).toHaveProperty("token");

      const updatedUsers = JSON.parse(
        fs.readFileSync(pathResolver.join("./main/data/users.json"))
      );
      const updatedUser = updatedUsers.find((user) => user.email === user.email);
      expect(updatedUser).toHaveProperty("email", user.email);
      expect(updatedUser).toHaveProperty("token", response.body.token);
    });

    it("should return a 500 status code with an error message if there is an error", async () => {
      const response = await request(app).put("/update-user");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("DELETE /delete-user", () => {
    it("should delete the user with a valid token and return a 200 status code", async () => {
      const users = JSON.parse(
        fs.readFileSync(pathResolver.join("./main/data/users.json"))
      );
      const user = users[0];

      const response = await request(app)
        .delete("/delete-user")
        .set("Authorization", `Bearer ${user.token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "success");

      const updatedUsers = JSON.parse(
        fs.readFileSync(pathResolver.join("./main/data/users.json"))
      );
      const deletedUser = updatedUsers.find((user) => user.email === user.email);
      expect(deletedUser).toBeUndefined();
    });

    it("should return a 500 status code with an error message if there is an error", async () => {
        const response = await request(app).delete("/delete-user");
    
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("status", "error");
        expect(response.body).toHaveProperty("message");
        });
    });
});

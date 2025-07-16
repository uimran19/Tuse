const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const seedInspiration = require("../db/seeds/seedInspiration")
const app = require("../app");
const { response } = require("express");

beforeAll(async () => { 
    await seed(2)
    await seedInspiration()
});
afterAll(() => db.end());

describe("/inspiration/:date", () => {
    test("200: returns an object with artwork metadata and image URLs", async () => {
        const currentTimestamp = Date.now();
        const date = new Date(currentTimestamp);
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const response = await request(app).get(`/inspiration/${formattedDate}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("inspiration");

        const inspiration = response.body.inspiration;

        expect(inspiration).toHaveProperty("title");
        expect(inspiration).toHaveProperty("artist");
        expect(inspiration).toHaveProperty("medium");
        expect(inspiration).toHaveProperty("thumbnailUrl");
        expect(inspiration).toHaveProperty("imageUrl");
    })
})

describe("invalid routes and dates", () => {
    test("404: GET /inspiration/:date with no data returns an error", async () => {
        const res = await request(app).get("/inspiration/2020-1-1");
        expect(res.status).toBe(404);
        expect(res.body.msg).toBe("no artwork found for that date");
    });
    test("400: GET /inspiration/invalid-date returns an error", async () => {
        const response = await request(app).get("/inspiration/invalid-date");
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe("bad request");
    })
})
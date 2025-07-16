const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const server = require("../server");
const { response } = require("express");

beforeAll(async () => { await seed(2)});
afterAll(() => db.end());

describe("/inspiration/:date", () => {
    test("200: returns an object with artwork metadata and image URLs", async () => {
        const response = await request(server).get("/inspiration/2025-7-16");
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

describe("invalid routes", () => {
    test("404: GET /not-a-valid-route returns an error", async () => {
        const response = await request(server).get("/not-a-valid-route");
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("not found");
    })
    test("400: GET /inspiration/invalid-date returns an error", async () => {
        const response = await request(server).get("/inspiration/invalid-date");
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe("bad request");
    })
})
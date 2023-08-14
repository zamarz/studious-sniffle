const app = require("../app");
const request = require("supertest");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("GET /api/topics", () => {
  test("GET: 200 sends an array of all the topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toEqual(expect.any(Array));
        expect(Object.keys(response.body.topics[0])).toEqual(
          expect.arrayContaining(["slug", "description"])
        );
      });
  });
  test("GET: 200 sends an array with the correct values to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
  test("GET: 200 sends an array with the correct topic", () => {
    return request(app)
      .get("/api/topics?slug=paper")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(1);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", "paper");
        });
      });
  });
  test("GET: 404 warns user that the value doesn't exist", () => {
    return request(app)
      .get("/api/topics?slug=chocolate")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Resource not found");
      });
  });
});

describe("GET /api", () => {
  test("GET: 200 sends a json representation of all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.endpoints).toEqual({ ...endpoints });
      });
  });
});

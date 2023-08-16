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

describe("GET /api/articles", () => {
  test("GET: 200 responds with an array of articles with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles.length).toBe(5);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("GET: 200 ensure articles are ordered by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("GET: 400 ensure articles cannot be ordered in an unacceptable way(not asc or desc)", () => {
    return request(app)
      .get("/api/articles?order_by=pineapple")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET: 200 gets an article by its id with the correct properties", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toHaveProperty("author", "icellusedkars");
        expect(article).toHaveProperty(
          "title",
          "Eight pug gifs that remind me of mitch"
        );
        expect(article).toHaveProperty("body", "some gifs");
        expect(article).toHaveProperty("article_id", 3);
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty(
          "created_at",
          "2020-11-03T09:12:00.000Z"
        );
        expect(article).toHaveProperty("votes", 0);
        expect(article).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET: 404 article id does not exist and returns an error message", () => {
    return request(app)
      .get("/api/articles/459")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });

  test("GET: 400 article id has the wrong datatype", () => {
    return request(app)
      .get("/api/articles/chocolatecookies")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST: 201 adds a comment to an article", () => {
    const newComment = {
      author: "icellusedkars",
      body: "hey am I on the right site?",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "hey am I on the right site?",
          article_id: 9,
          author: "icellusedkars",
          votes: 0,
        });
      });
  });
  test("POST: 400 article id does not exist and returns an error message", () => {
    const newComment = {
      author: "icellusedkars",
      body: "hey am I on the right site?",
    };
    return request(app)
      .post("/api/articles/579/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("POST: 400 article id has the wrong datatype", () => {
    const newComment = {
      author: "icellusedkars",
      body: "hey am I on the right site?",
    };
    return request(app)
      .post("/api/articles/trustysandwich/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

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
        expect(article).toHaveProperty("body", "git push origin master");
        expect(article).toHaveProperty("article_id", 3);
        expect(article).toHaveProperty("comment_count", "1");

        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("created_at", expect.any(String));
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

  test("POST: 201 adds a comment to an article", () => {
    const newComment = {
      author: "icellusedkars",
      body: "hey am I on the right site?",
      otherProperty: "allignored",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).not.toHaveProperty("otherProperty");
      });
  });

  test("POST: 201 adds a comment to an article and returns comment with specific properties", () => {
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
        expect(Object.keys(comment)).toHaveLength(6);
        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("body", expect.any(String));
        expect(comment).toHaveProperty("article_id", expect.any(Number));
        expect(comment).toHaveProperty("author", expect.any(String));
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment).toHaveProperty("votes", expect.any(Number));
      });
  });

  test("POST: 400 new comment object is missing a required field", () => {
    const newComment = {
      body: "hey am I on the right site?",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test("POST: 404 article id does not exist and returns an error message", () => {
    const newComment = {
      author: "icellusedkars",
      body: "hey am I on the right site?",
    };
    return request(app)
      .post("/api/articles/579/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
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

  test("POST: 404 username does not exist", () => {
    const newComment = {
      author: "elgato",
      body: "hey am I on the right site?",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("PATCH:200 increases the votes property of an article and responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 105,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("PATCH:200 ensure updated article contains correct properties", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(Object.keys(article)).toHaveLength(8);
        expect(article).toHaveProperty("article_id", expect.any(Number));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });

  test("PATCH:200 decreases the votes property of an article and responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 95,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("PATCH:404 article id does not exist and returns error message", () => {
    return request(app)
      .patch("/api/articles/576")
      .send({ inc_votes: -5 })
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not found");
      });
  });

  test("PATCH:400 displays correct error message if wrong data type used", () => {
    return request(app)
      .patch("/api/articles/empanadas")
      .send({ inc_votes: -5 })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });

  test("PATCH:400 displays correct error message if nothing sent in PATCH message", () => {
    return request(app)
      .patch("/api/articles/9")
      .send({})
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });

  test("PATCH:400 displays correct error message if PATCH message vote property in not a number", () => {
    return request(app)
      .patch("/api/articles/9")
      .send({ inc_votes: "pineapple" })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
});

describe("FEATURE: GET /api/articles (queries)", () => {
  test("GET: 200 can filter the endpoint by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(4);
        articles.forEach((article) => {
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", "mitch");
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(Object.keys(article)).toHaveLength(8);
        });
      });
  });
  test("GET: 404 warns user that the topic doesn't exist", () => {
    return request(app)
      .get("/api/articles?topic=chocolate")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("GET: 400 returns an error message if topic is valid but contains no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("GET: 200 responds with all articles if query is omitted", () => {
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
  test("GET: 200 sorts the articles by author column descending by default", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("GET: 200 sorts the articles by votes column and order ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order_by=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("votes");
      });
  });
  test("GET: 200 sorts the articles by votes column and order is descending by default", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("GET: 400 returns an error message if sort_by is unacceptable", () => {
    return request(app)
      .get("/api/articles?sort_by=passwords")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("GET: 400 returns an error message if order_by is unacceptable", () => {
    return request(app)
      .get("/api/articles?order_by=passwords")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("GET: 400 returns an error message if either sort_by or order_by are unacceptable", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order_by=passwords")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE: 204 deletes a comment correctly", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE: 404 responds with error message if id does not exist", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not found");
      });
  });
  test("DELETE: 400 responds with error message if data type for id is wrong", () => {
    return request(app)
      .delete("/api/comments/starfish")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
  test("DELETE: 204 ensures no content is sent back", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
});

describe("GET /api/users", () => {
  test("GET:200 returns all users with specific properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);

        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });

  test("GET:200 returns an array", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toEqual(expect.any(Array));
        expect(Object.keys(users[0])).toEqual(
          expect.arrayContaining(["username", "name", "avatar_url"])
        );
      });
  });
});

describe("FEATURE: GET /api/articles/:article_id ", () => {
  test("GET: 200 Ensure the article response object contains a comment count", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("comment_count", expect.any(String));
      });
  });
});

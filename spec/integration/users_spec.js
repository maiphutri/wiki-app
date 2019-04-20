const request   = require('request'),
      server    = require('../../src/server'),
      base      = "https://localhost:3000/users/",
      User      = require("../../src/db/models").User,
      Wiki      = require("../../src/db/models").Wiki,
      sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

  beforeEach((done) => {
    sequelize.sync({force: true}).then(() => {
      done();
    })
    .catch(err => {
      console.log(err);
      done();
    })
  });

  describe("GET /users/sign_up", () => {

    it("should render a view with a sign up form", (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      })
    })
  });

  describe("POST /users", () => {

    it("should create a new user with valid values and redirect", (done) => {
      const options = {
        url: `${base}sign_up`,
        form: {
          email: "user@example.com",
          password: "123456789",
          passwordConfirmation: "123456789"
        }
      };

      request.post(options,
        (err, res, body) => {
          User.findOne({ where: {email: "user@example.com"} }).then(user => {
            expect(user).not.toBeNull();
            expect(user.email).toBe("user@example.com");
            expect(user.id).toBe(1);
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          })
        }
      )
    });

    it("should not create a new user with invalid attributes and redirect", (done) => {
      request.post({
        url: `${base}sign_up`,
        form: {
          email: "no",
          password: "123456789"
        }
      }, (err, res, body) => {
          User.findOne({ where: {email: "no"} }).then(user => {
            expect(user).toBeNull();
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          })
      })
    });
  });

  describe("GET /users/sign_in", () => {

    it("should render a view with a sign in form", (done) => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      })
    })
  });

  describe("GET /users/:id", () => {

    beforeEach(done => {
      this.user;
      this.wiki;

      User.create({
        email: "ada@example.com",
        password: "123456"
      })
      .then(user => {
        this.user = user;

        Wiki.create({
          title: "Scrum",
          body: "Scrum is an agile framework for managing knowledge work",
          userId: this.user.id
        })
        .then(wiki => {
          this.wiki = wiki;
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        })
      })
      .catch(err => {
        console.log(err);
        done();
      })
    });

    it("should present a list of wikis a user has created", (done) => {
      request.get(`${base}${this.user.id}/my_wikis`, (err, res, body) => {
        expect(body).toContain("Scrum");
        done();
      })
    })
  })
})
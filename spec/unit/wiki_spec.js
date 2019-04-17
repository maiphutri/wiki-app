const sequelize = require("../../src/db/models/index").sequelize,
      User      = require("../../src/db/models").User,
      Wiki      = require("../../src/db/models").Wiki;

describe("Wiki", () => {
  
  beforeEach(done => {
    this.wiki;
    this.user;

    sequelize.sync({force: true}).then(res => {
      User.create({
        email:"ada@test.com",
        password:"123456",
      })
      .then(user => {
        this.user = user;

        Wiki.create({
          title: "MVC",
          body: "Model, View and Controller",
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
    })
  })

  describe("#create()", () => {

    it("should create a wiki object with title, body, private and assigned user", (done) => {
      Wiki.create({
        title: "Scrum",
        body: "Scrum is an agile framework for managing knowledge work"
      })
      .then(wiki => {
        expect(wiki.title).toBe("Scrum");
        expect(wiki.body).toBe("Scrum is an agile framework for managing knowledge work");
        expect(wiki.private).toBe(false);
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      })
    });

    it("should not create a wiki with missing title, body, and private or assigned user", (done) => {
      Wiki.create({
        title: "Computer"
      })
      .then(wiki => {
        done();
      })
      .catch(err => {
        expect(err.message).toContain("Wiki.body cannot be null");
        done();
      })
    });

    it("should not create a wiki with a title already taken", (done) => {
        Wiki.create({
          title: "MVC",
          body: "refers to websites that emphasize user-generated content, ease of use",
        })
        .then(wiki => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Validation error");
          done();
        })
    })
  });
})
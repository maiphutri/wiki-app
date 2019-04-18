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
    })
  })

  describe("#create()", () => {

    it("should create a wiki object with title, body, private and assigned user", (done) => {
      Wiki.create({
        title: "Scrum",
        body: "Scrum is an agile framework for managing knowledge work",
        userId: this.user.id
      })
      .then(wiki => {
        expect(wiki.title).toBe("Scrum");
        expect(wiki.body).toBe("Scrum is an agile framework for managing knowledge work");
        expect(wiki.private).toBe(false);
        expect(wiki.userId).toBe(this.user.id)
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
          userId: this.user.id
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

  describe("#setUser()", () => {

    it("should associate a wiki and user together", (done) => {
      User.create({
        email: "ada2@yahoo.com",
        password: "123456"
      })
      .then(newUser => {
        expect(this.wiki.userId).toBe(this.user.id);
        this.wiki.setUser(newUser).then(wiki => {
          expect(wiki.userId).toBe(newUser.id);
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        })
      })
    })
  });

  describe("#getUser()", () => {

    it("should return associated User", (done) => {
      this.wiki.getUser().then(associatedUser => {
        expect(associatedUser.email).toBe(this.user.email);
        done();
      })
    })
  })
})
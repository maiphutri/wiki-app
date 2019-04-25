const sequelize    = require("../../src/db/models/index").sequelize,
      Collaborator = require("../../src/db/models").Collaborator,
      User         = require("../../src/db/models").User,
      Wiki         = require("../../src/db/models").Wiki;

describe("Collaborator", () => {
  
  beforeEach(done => {
    this.user;
    this.wiki;
    this.collaborator;

    sequelize.sync({force: true}).then(res => {
      User.create({
        email: "ada@example.com",
        password: "123456"
      })
      .then(user => {
        this.user = user;
        
        User.create({
          email: "abc@example.com",
          password: "123456"
        })
        .then(user => {

          Wiki.create({
            title: "MVC",
            body: "Model, View and Controller",
            userId: this.user.id,
            private: true
          })
          .then(wiki => {
            this.wiki = wiki;
            
            Collaborator.create({
              wikiId: this.wiki.id,
              email: user.email
            })
            .then(collaborator => {
              this.collaborator = collaborator;
              done();
            })
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
      .catch(err => {
        console.log(err);
        done();
      })
    })
  });

  describe("#create()", () => {

    it("should create a collaborator object with wikiId, collaboratorId, creatorId", (done) => {
      User.create({
        email: "stark@example.com",
        password: "123456"
      })
      .then(user => {
        Collaborator.create({
          wikiId: this.wiki.id,
          email: user.email
        })
        .then(collaborator => {
          expect(collaborator.wikiId).toBe(this.wiki.id);
          expect(collaborator.email).toBe(user.email);
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

    it("should not create a collaborator with missing userId and assigned wikiId", (done) => {
      Collaborator.create({
        email: this.user.email
      })
      .then(wiki => {
        done();
      })
      .catch(err => {
        expect(err.message).toContain("Collaborator.wikiId cannot be null");
        done();
      })
    })
  });

  describe("#setWiki()", () => {

    it("should associate a wiki and a collaborator together", (done) => {
      Wiki.create({
        title: "Scrum",
        body: "Scrum is an agile framework for managing knowledge work",
        userId: this.user.id,
        private: true
      })
      .then(newWiki => {
        this.collaborator.setWiki(newWiki).then(collaborator => {
          expect(collaborator.wikiId).toBe(newWiki.id)
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
  })

  describe("#getWiki()", () => {

    it("should return associated Wiki", (done) => {
      this.collaborator.getWiki().then(associatedWiki => {
        expect(associatedWiki.id).toBe(this.wiki.id);
        done();
      })
    })
  });
})
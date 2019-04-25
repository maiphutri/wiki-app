const sequelize    = require("../../src/db/models/index").sequelize,
      request      = require("request"),
      server       = require("../../src/server"),
      base         = "http://localhost:3000/",
      Collaborator = require("../../src/db/models").Collaborator,
      User         = require("../../src/db/models").User,
      Wiki         = require("../../src/db/models").Wiki;

describe("routes : collaborators", () => {

  beforeEach(done => {
    this.collaborator;
    this.user;
    this.wiki;

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
              email: user.email,
              wikiId: this.wiki.id,
              userId: this.user.id
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

  describe("premium members attempting to add collaborators to their private wikis", () => {

    beforeEach(done => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          email: this.user.email,
          userId: this.user.id,
          role: "premium"
        }
      }, (err, res, body) => {
        done();
      })
    })

    describe("GET /collaborators", () => {

      it("should render a view with a list of collaborators to add", (done) => {
        request.get(`${base}wikis/${this.wiki.id}/collaborators`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Add Collaborators");
          done();
        })
      })
    })
  })
})
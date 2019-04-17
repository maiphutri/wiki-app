const request   = require("request"),
      server    = require("../../src/server"),
      sequelize = require("../../src/db/models/index").sequelize,
      User      = require("../../src/db/models").User,
      Wiki      = require("../../src/db/models").Wiki,
      base      = "http://localhost:3000/wikis/";

describe("routes: wikis", () => {

  beforeEach(done => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then(res => {
      User.create({
        email: "ada@test.com",
        password: "123456"
      })
      .then(user => {
        this.user = user;

        Wiki.create({
          title: "MVC",
          body: "Model, View and Controller"
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
  });
  
  describe("GET /wikis", () => {

    it("should respond with all wikis", (done) => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Wikis");
        expect(body).toContain("MVC");
        done();
      })
    });
  });

  describe("GET /wikis/new", () => {

    it("should render a view with a new wiki form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki");
        done();
      })
    })
  });

  describe("POST /wikis/create", () => {

    it("should create a new wiki and redirect", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Scrum",
          body: "Scrum is an agile framework for managing knowledge work",
        }
      };

      request.post(options,
        (err, res, body) => {
          Wiki.findOne({where: {title: "Scrum"}}).then(wiki => {
            expect(wiki).not.toBeNull();
            expect(wiki.title).toBe("Scrum");
            expect(wiki.body).toBe("Scrum is an agile framework for managing knowledge work");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          })
        }
      )
    });

    it("should not create a new post that fails validations", (done) => {
      request.post({
        url: `${base}create`,
        form: {
          title: "a",
          body: "b",
        }
      }, (err, res, body) => {
        Wiki.findOne({where: {title: "a"}}).then(wiki => {
          expect(wiki).toBeNull();
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        })
      })
    })
  });

  describe("GET /wikis/:id", () => {

    it("should render a view with the selected wiki", (done) => {
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("MVC");
        done();
      })
    })
  });

  describe("POST /wikis/:id/destroy", () => {

    it("should delete the wiki with the associated id", (done) => {
      Wiki.findAll().then(wikis => {
        const wikiCountBeforeDelete = wikis.length;

        request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
          Wiki.findAll().then(wikis => {
            expect(err).toBeNull();
            expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          })
        })
      })
      .catch(err => {
        console.log();
        done();
      })
    })
  });

  describe("GET /wikis/:id/edit", () => {

    it("should render a view with an edit wiki form", (done) => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Wiki");
        expect(body).toContain("MVC");
        done();
      })
    })
  });

  describe("POST /wikis/:id/update", () => {
    
    it("should update the wiki with the given value", (done) => {
      request.post({
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Scrum",
          body: "Scrum is an agile framework for managing knowledge work"
        }
      }, (err, res, body) => {
        expect(err).toBeNull();
        
        Wiki.findOne({where: {title: "Scrum"}}).then(wiki => {
          expect(wiki).not.toBeNull();
          expect(wiki.title).toBe("Scrum");
          expect(wiki.body).toBe("Scrum is an agile framework for managing knowledge work");
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        })
      })
    })
  })

})
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
    });
  });

  describe("guest user performing CRUD actions for Wiki", () => {
    
    beforeEach(done => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: 0
        }
      }, (err, res , body) => {
        done();
      })
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
  
      it("should redirect to Wikis view", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          done();
        })
      })
    });
  
    describe("POST /wikis/create", () => {
  
      it("should not create a new wiki and redirect", (done) => {
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
              expect(wiki).toBeNull();
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            })
          }
        )
      });
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
  
      it("should not delete the wiki with the associated id", (done) => {
        Wiki.findAll().then(wikis => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);
  
          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll().then(wikis => {
              expect(wikis.length).toBe(wikiCountBeforeDelete);
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
  
      it("should redirect to selected wiki view", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Wiki");
          expect(body).toContain("MVC");
          done();
        })
      })
    });
  
    describe("POST /wikis/:id/update", () => {
      
      it("should not update the wiki with the given value", (done) => {
        request.post({
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Scrum",
            body: "Scrum is an agile framework for managing knowledge work"
          }
        }, (err, res, body) => {
          expect(err).toBeNull();
          
          Wiki.findOne({where: {id: this.wiki.id}}).then(wiki => {
            expect(wiki).not.toBeNull();
            expect(wiki.title).toBe("MVC");
            expect(wiki.body).toBe("Model, View and Controller");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          })
        })
      })
    })
  });

  describe("admin user perfoming CRUD actions for Wiki", () => {
    
    beforeEach(done => {
      User.create({
        email: "admin@example.com",
        password: "123456",
        role: "admin"
      })
      .then(user => {
        request.get({
          url: 'http://localhost:3000/auth/fake',
          form: {
            role: user.role,
            userId: user.id,
            email: user.email
          }
        }, (err, res, body) => {
          done();
        })
      })
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
  });

  describe("signed in user performing CRUD actions for Wiki", () => {

    describe("is wiki's owner", () => {

      beforeEach(done => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: "member",
            userId: this.user.id,
            email: this.user.email
          }
        }, (err, res, body) => {
          done();
        })
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

    describe("is not wiki's owner", () => {

      beforeEach(done => {
        User.create({
          email: "ada2@example.com",
          password: "123456"
        })
        .then(user => {
          request.get({
            url: "http://localhost:3000/auth/fake",
            form: {
              role: "member",
              userId: user.id,
              email: user.email
            }
          }, (err, res, body) => {
            done();
          })
        })
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
  
        it("should not delete the wiki with the associated id", (done) => {
          Wiki.findAll().then(wikis => {
            const wikiCountBeforeDelete = wikis.length;
            expect(wikiCountBeforeDelete).toBe(1);
    
            request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
              Wiki.findAll().then(wikis => {
                expect(wikis.length).toBe(wikiCountBeforeDelete);
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
    
        it("should redirect to selected wiki view", (done) => {
          request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).not.toContain("Edit Wiki");
            expect(body).toContain("MVC");
            done();
          })
        })
      });
    
      describe("POST /wikis/:id/update", () => {
        
        it("should not update the wiki with the given value", (done) => {
          request.post({
            url: `${base}${this.wiki.id}/update`,
            form: {
              title: "Scrum",
              body: "Scrum is an agile framework for managing knowledge work"
            }
          }, (err, res, body) => {
            expect(err).toBeNull();
            
            Wiki.findOne({where: {id: this.wiki.id}}).then(wiki => {
              expect(wiki).not.toBeNull();
              expect(wiki.title).toBe("MVC");
              expect(wiki.body).toBe("Model, View and Controller");
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
  })
})
const Wiki = require("./models").Wiki,
      User = require("./models").User;

module.exports = {
  getAllWikis(callback) {
    return Wiki.findAll().then(wikis => {
      callback(null, wikis);
    })
    .catch(err => {
      callback(err);
    })
  },
  
  addWiki(newWiki, callback) {
    Wiki.findOne({where: {title: newWiki.title}}).then(wiki => {
      if(wiki) {
        let err = [];
        err.push({param: "Title", msg: "is already being used. Please try another title."})
        return callback(err);
      } else {
        return Wiki.create(newWiki).then(wiki => {
          callback(null, wiki);
        })
        .catch(err => {
          callback(err);
        })
      }
    })
  },

  getWiki(id, callback) {
    return Wiki.findByPk(id).then(wiki => {
      callback(null, wiki);
    })
    .catch(err => {
      callback(err);
    })
  },

  deleteWiki(id, callback) {
    return Wiki.findByPk(id).then(wiki => {
      wiki.destroy().then(res => {
        callback(null, wiki);
      })
    })
    .catch(err => {
      callback(err);
    })
  },

  updateWiki(id, updatedWiki, callback) {
    return Wiki.findByPk(id).then(wiki => {
      if(!wiki) return callback("Wiki not found");

      wiki.update(updatedWiki, {
        fields: Object.keys(updatedWiki)
      })
      .then(() => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      })
    })
    .catch(err => {
      callback(err);
    })
  }
}
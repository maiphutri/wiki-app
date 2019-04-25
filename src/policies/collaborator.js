const ApplicationPolicy = require("./application");

module.exports = class CollaboratorPolicy extends ApplicationPolicy {
  new() {
    return this._isOwner();
  }
}
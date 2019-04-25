module.exports = class ApplicationPolicy {
  constructor(user, record, collaborator) {
    this.user = user;
    this.record = record;
    this.collaborator = collaborator;
  }

  _isOwner() {
    return this.record && (this.record.userId == this.user.id);
  }

  _isAdmin() {
    return this.user && this.user.role == 'admin';
  }

  _isPremium() {
    return this.user && this.user.role == 'premium';
  }

  _isCollaborator() {
    return this.user && (this.collaborator.wikiId == this.record.id);
  }

  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    return true;
  }

  edit() {
    return this.new() && this.record && (this._isOwner() || this._isAdmin() || this._isCollaborator());
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}
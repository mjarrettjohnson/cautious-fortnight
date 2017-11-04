export default class Validator {
  static validateFrom(from) {
    if (!from || from.split(' ').length !== 3) {
      return 'A from email address must be in the format: Display name <email@address.com>.';
    } else {
      const split = from.split(' ');
      const email = split[2];
      if (email[0] !== '<' || email[email.length - 1] !== '>') {
        return 'A from email address must be in the format: Display name <email@address.com>.';
      } else {
        const stripped = email.slice(1, email.length - 1);
        if (!this._validEmail(stripped)) {
          return 'Please enter a valid email.';
        } else {
          return '';
        }
      }
    }
  }

  static validateTo(to) {
    if (!to || !this._validEmail(to)) {
      return 'Please enter a valid email.';
    } else {
      return '';
    }
  }

  static validateSubject(subject) {
    if (!subject || subject.trim().length === 0) {
      return 'An email subject line cannot be empty.';
    } else {
      return '';
    }
  }

  static validateText(text) {
    if (!text || text.trim().length === 0) {
      return 'An email body must contain text';
    } else {
      return '';
    }
  }

  static _validEmail(email) {
    return email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }
}

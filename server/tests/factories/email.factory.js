import faker from 'faker';

class EmailFactory {
  generate(attrs) {
    return Object.assign(
      {},
      {
        from: faker.internet.email(),
        to: faker.internet.email(),
        subject: faker.lorem.lines(1),
        text: faker.lorem.paragraph(4),
      },
      attrs
    );
  }
}

export default new EmailFactory();

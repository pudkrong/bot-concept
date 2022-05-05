const Handlebars = require('handlebars');

async function decision (intent, entities = {}) {
  try {
    const requiredEntities = require(`./${intent}.json`);
    const missingEntity = Object.keys(requiredEntities.entities).find((key) => {
      return !entities[key];
    });

    if (missingEntity) {
      const questions = requiredEntities.entities[missingEntity].questions;
      const questionIndex = Math.floor(Math.random() * questions.length);
      const question = questions[questionIndex];

      return {
        acquiredEntity: missingEntity,
        answers: requiredEntities.entities[missingEntity].answers,
        question,
        fulfilled: false
      };
    } else {
      const template = Handlebars.compile(requiredEntities.fulfilled);
      return {
        reply: template(entities),
        fulfilled: true
      };
    }
  } catch (error) {
    console.warn('Cannot find data for the given intent', intent);
    return null;
  }
}

module.exports = decision;

const Handlebars = require('handlebars');
const axios = require('axios');
const log = require('../lib/logger')('decision');
const _ = require('lodash');

async function processNlu (text) {
  const result = await axios.post(process.env.INTENT_ENDPOINT, { text });

  if (result.status === 200) {
    const { intent, entities } = result.data;
    return {
      intent,
      entities
    }
  } else {
    return { intent: null };
  }
}

async function decision (intent, entities = [], validate = null) {
  try {
    const requiredEntities = require(`./${intent}.json`);
    log.info('load intent stories', { intent });
    // Validate given entity
    if (validate) {
      const answers = _.get(requiredEntities, `entities.${validate.entity}.answers`, null);
      log.info('Validate set', requiredEntities, validate, answers);
      if (answers) {
        const valid = answers.indexOf(validate.value) !== -1;
        log.info('Validate result', valid);
        if (valid) {
          entities.push({
            entity: validate.entity,
            value: validate.value
          });
        } else {
          // Validation is failed
          // Re-send to intent extraction
          log.info('Send to extract new entities', validate);
          const { intent, entities } = await processNlu(validate.value);
          log.info('New extract result', intent, entities);
          return decision(intent, entities);
        }
      } else {
        entities.push({
          entity: validate.entity,
          value: validate.value
        });
      }
    }

    const missingEntity = Object.keys(requiredEntities.entities).find((key) => {
      return entities.findIndex((el) => el.entity === key) === -1;
    });

    if (missingEntity) {
      const questions = requiredEntities.entities[missingEntity].questions;
      const questionIndex = Math.floor(Math.random() * questions.length);
      const question = questions[questionIndex];

      return {
        intent,
        acquiredEntity: missingEntity,
        entities,
        question,
        fulfilled: false
      };
    } else {
      // Fulfilled
      // Remap entities into json
      const entitiesJson = entities.reduce((acc, el) => {
        acc[el.entity] = el.value;
        return acc;
      }, {});
      const template = Handlebars.compile(requiredEntities.fulfilled);
      return {
        reply: template(entitiesJson),
        fulfilled: true
      };
    }
  } catch (error) {
    log.warn('Cannot find data for the given intent', intent);
    return null;
  }
}

module.exports = decision;

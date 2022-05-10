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

async function decision (text, intent = null, entities = [], validate = null) {
  try {
    if (!intent) {
      log.info('Send text to NLU', text);
      const result = await processNlu(text);
      if (result.intent === null) {
        return {
          fulfilled: true,
          reply: 'I do not understand'
        }
      }

      log.info('NLU: ', result);
      intent = result.intent;
      entities = result.entities || [];
    }

    const requiredEntities = require(`./${intent}.json`);
    // Validate given entity
    if (validate) {
      const answers = _.get(requiredEntities, `entities.${validate.entity}.answers`, null);
      if (answers) {
        const valid = answers.indexOf(validate.value) !== -1;
        log.info('Is answer valid?', valid);
        if (valid) {
          entities.push({
            entity: validate.entity,
            value: validate.value
          });
        } else {
          // Validation is failed, then call decision to process new text
          return decision(validate.value);
        }
      } else {
        // Validation is not provided
        // Simply assign input to the acquired entity and return
        entities.push({
          entity: validate.entity,
          value: validate.value
        });
      }
    }

    // Searching for next acquired entity
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
    log.error('Error', error);
    return null;
  }
}

module.exports = decision;

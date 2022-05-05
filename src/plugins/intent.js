const axios = require('axios');
const _ = require('lodash');
const log = require('../lib/logger')('plugin');

async function intent (context) {
  const shouldLookingForIntent = !_.get(context.state, 'intent', null);

  if (shouldLookingForIntent) {
    const msg = context.event.isText ? context.event.message.text : '';
    const matches = /^intent\s+(\w+)\s*(.*)/.exec(msg);
    let intent = '';
    let entities = [];
    if (matches) {
      intent = matches[1];
      entities = /\w/.test(matches[2]) ? matches[2].split(' ') : [];
    }

    const result = await axios.post('https://httpbin.org/post', {
      data: { intent }
    });

    if (result.status === 200) {
      log.info('Add intent and entities into state', { intent, entities });
      context.setIntent(intent);
      const entitiesState = {};
      entities.forEach((entity) => {
        const [key, value] = entity.split(':');
        entitiesState[key] = value;
      });
      context.setState({
        entities: entitiesState
      });
    }
  } else {
    log.info('This turn is from the previous intent', context.state.intent);
  }
}

module.exports = intent;

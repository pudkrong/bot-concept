const axios = require('axios');
const _ = require('lodash');
const log = require('../lib/logger')('plugin');

async function intent (context) {
  if (context.event.message.text === 'reset') return;

  const shouldLookingForIntent = !_.get(context.state, 'intent', null);

  if (shouldLookingForIntent) {
    const text = context.event.isText ? context.event.message.text : '';

    const result = await axios.post(process.env.INTENT_ENDPOINT, { text });

    if (result.status === 200) {
      const { intent, entities } = result.data;
      log.info('Add intent and entities into state', { intent, entities });
      context.setIntent(intent);
      context.setState({
        entities
      });
    }
  } else {
    log.info('This turn is from the previous intent', context.state.intent);
  }
}

module.exports = intent;

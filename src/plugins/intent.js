const axios = require('axios');
const _ = require('lodash');

async function intent (context) {
  if (!_.get(context.state, 'intent', null)) {
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
    console.log('plugins: skip due to multi-turn dialog');
  }
}

module.exports = intent;

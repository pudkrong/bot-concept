const { router, text } = require('bottender/router');
const { values } = require('lodash');
const decision = require('./intents/index');
const log = require('./lib/logger')('main');

async function sayHi (context) {
  await context.sendText(`Hi! there. What can I help you today?`);
}

async function echo (context) {
  if (context.event.isText) {
    await context.sendText(context.event.message.text);
  }
}

async function unknown (context) {
  log.info('CONTEXT', context);
  await context.sendText('I don\'t understand');
}

async function reset (context) {
  log.info('RESET State');
  context.resetState();
  await context.sendText('state is reset');
}

async function external (context) {
  let result = null;
  const text = context.event.message.text;

  if (context.state.acquiredEntity) {
    result = await decision(text, context.state.intent, context.state.entities, {
      entity: context.state.acquiredEntity,
      value: text
    });
  } else {
    result = await decision(text, context.state.intent, context.state.entities);
  }
  log.info('Decision: ', result);
  if (!result) return;

  if (!result.fulfilled) {
    if (result.acquiredEntity) {
      context.setState({
        intent: result.intent,
        entities: result.entities,
        acquiredEntity: result.acquiredEntity
      });
    }

    await context.sendText(result.question);
  } else {
    await context.sendText(result.reply);
    context.resetState();
  }
}

module.exports = async function App (context) {
  return router([
    text(/^(hi|hello)$/, sayHi),
    text('reset', reset),
    text('*', external)
  ]);
  // return router([
  //   text(/^(hi|hello)$/, sayHi),
  //   text('echo', echo),
  //   text('*', unknown)
  // ]);
};

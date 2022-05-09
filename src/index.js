const { router, text } = require('bottender/router');
const { values } = require('lodash');
const decision = require('./intents/index');
const log = require('./lib/logger')('main');

async function sayHi (context) {
  const count = context.state.count + 1;
  context.setState({
    count
  });
  await context.sendText(`Hi! ${context.state.count}`);
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
  if (context.intent) context.setState({ intent: context.intent });

  if (!context.state.intent) {
    await context.sendText('I don\'t understand');
  } else {
    let result = null;
    if (context.state.acquiredEntity) {
      log.info('Calling function with acquired entity', context.state);
      result = await decision(context.state.intent, context.state.entities, {
        entity: context.state.acquiredEntity,
        value: context.event.message.text
      });
    } else {
      log.info('Calling function without acquired entity', context.state);
      result = await decision(context.state.intent, context.state.entities);
    }
    if (!result) return;

    log.info('Decision result', result);
    if (!result.fulfilled) {
      if (result.acquiredEntity) {
        log.info('Set state as', result);
        context.setState({
          intent: result.intent,
          entities: result.entities,
          acquiredEntity: result.acquiredEntity,
        });
      }

      log.info('Send question to client');
      await context.sendText(result.question);
    } else {
      await context.sendText(result.reply);
      context.resetState();
    }
  }
}

module.exports = async function App (context) {
  return router([
    text('reset', reset),
    text('*', external)
  ]);
  // return router([
  //   text(/^(hi|hello)$/, sayHi),
  //   text('echo', echo),
  //   text('*', unknown)
  // ]);
};

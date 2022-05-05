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

function validateAnswer (context) {
  if (context.state.answers) {
    return context.state.answers.indexOf(context.event.message.text) !== -1;
  } else {
    return true;
  }
}

async function external (context) {
  if (context.intent) context.setState({ intent: context.intent });
  if (context.state.acquiredEntity) {
    // TONOTE:: Validate answer
    if (validateAnswer(context)) {
      const entities = context.state.entities || {};
      entities[context.state.acquiredEntity] = context.event.message.text;
      context.setState({
        entities,
        acquiredEntity: null
      });
    } else {
      // TONOTE:: Send answer to external decision system
      context.resetState();
      context.sendText('Your answer is not correct. We are try our best to give you answer');
      return;
    }
  }

  if (!context.state.intent) {
    await context.sendText('I don\'t understand');
  } else {
    log.info('Calling function with payload', context.state);
    const result = await decision(context.state.intent, context.state.entities);
    if (!result) return;

    if (!result.fulfilled) {
      if (result.acquiredEntity) {
        log.info('Set state as', result);
        context.setState({
          acquiredEntity: result.acquiredEntity,
          answers: result.answers || null
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

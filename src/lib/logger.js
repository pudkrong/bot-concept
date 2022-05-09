const pino = require('pino');
const _ = require('lodash');
const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    ignore: 'pid,hostname',
    destination: 1
  }
});
const logger = pino(transport);

module.exports = (mod) => {
  const l = logger.child({ module: mod });

  const reArgs = (args) => {
    let ret = {};
    switch (args.length) {
      case 0:
        break;
      case 1:
        ret = args.slice(0, 1);
        break;
      default:
        const msg = args.slice(0, 1);
        const extras = args.slice(1);
        const mergedObject = extras.reduce((acc, el, index) => {
          const nObj = {};
          nObj[`p${index}`] = el;
          return _.merge(acc, nObj);
        }, {});
        ret = [mergedObject].concat(msg);
    }

    return ret;
  };

  return {
    info (...args) { return l.info(...reArgs(args)); },
    error (...args) { return l.error(...reArgs(args)); },
    warn (...args) { return l.warn(...reArgs(args)); }
  };
};

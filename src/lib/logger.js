const pino = require('pino');
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
    const msg = args.slice(0, 1);
    const extras = args.slice(1);

    return extras.concat(msg);
  };

  return {
    info (...args) { return l.info(...reArgs(args)); },
    error (...args) { return l.error(...reArgs(args)); },
    warn (...args) { return l.warn(...reArgs(args)); }
  };
};

const { execFile } = require('child_process');

const OPTIONS_CONSTRAINTS = {
  lang: [
    // Fully supported
    'af', 'bs', 'ca', 'cs', 'de', 'en', 'en-us', 'en-sc', 'en-n', 'en-rp', 'en-wm',
    'el', 'eo', 'es', 'es-la', 'fi', 'fr', 'hr', 'hu', 'it', 'kn', 'lv', 'nl', 'pl',
    'pt', 'pt-pt', 'ro', 'sk', 'sr', 'sv', 'ta', 'tr', 'zh',

    // Provisional
    'cy', 'grc', 'hi', 'hy', 'id', 'id', 'jbo', 'ka', 'la', 'mk', 'no', 'ru', 'sq',
    'vi', 'zh-yue'
  ],
  gender: [ 'm', 'f' ],
  variant: [ 1, 2, 3, 4, 5, 6, 7, 'croak', 'whisper' ],
  speed: 'number',
  ssml: 'boolean',
  pitch: 'number',
  emphasis: 'number'
}

const DEFAULT_OPTIONS = {
  lang: 'en',
  gender: 'm',
  variant: 3,
  speed: 120,
  ssml: false,
  pitch: 50,
  emphasis: 5
};

function isNumeric(val) {
  return val - 0 == val;
}

module.exports = class Espeak {
  constructor(options = DEFAULT_OPTIONS) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  speak(text) {
    const optionsValid = this._verifyOptions();
    if (!optionsValid.length) {
      const { options } = this;
      const args = [];
      const langModifiers = `${options.gender || ''}${options.variant || ''}`;
      args.push(`-v${options.lang}${langModifiers && '+'}${langModifiers}`);
      args.push(`-k${options.emphasis}`);
      args.push(`-s${options.speed}`);
      args.push(`-p${options.pitch}`);
      if (options.ssml) {
        args.push('-m');
      }
      args.push(text);
      execFile('espeak', args);
    }
  }

  _verifyOptions() {
    const errors = [];

    Object.keys(OPTIONS_CONSTRAINTS).forEach(key => {
      if (this.options[key]) {
        const value = this.options[key];
        const constraint = OPTIONS_CONSTRAINTS[key];
        if (Array.isArray(constraint) && constraint.indexOf(value) === -1) {
          errors.push(`"${key}" has invalid value: ${value}`);
        } else if (constraint === 'number' && !isNumeric(value)) {
          errors.push(`"${key}" must be a number: ${value}`);
        }
      }
    });

    return errors;
  }
}
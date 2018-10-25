import { execFile } from 'child_process';
import {
  IEspeakOptions,
  ESPEAK_LANGUAGES,
  ESPEAK_GENDERS,
  ESPEAK_VARIANTS
} from 'common/espeak';

const DEFAULT_OPTIONS: IEspeakOptions = {
  lang: 'en',
  gender: 'm',
  variant: 3,
  speed: 120,
  ssml: false,
  pitch: 50,
  emphasis: 5
};

function isNumeric(val: any): boolean {
  return val - 0 == val;
}

const OPTIONS_CONSTRAINTS: any = {
  lang: ESPEAK_LANGUAGES,
  gender: ESPEAK_GENDERS,
  variant: ESPEAK_VARIANTS,
  speed: 'number',
  ssml: 'boolean',
  pitch: 'number',
  emphasis: 'number'
}


export class Espeak {
  private options: IEspeakOptions;

  constructor(options: IEspeakOptions = DEFAULT_OPTIONS) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  public speak(text: string): void {
    const optionsValid = this.verifyOptions();
    if (!optionsValid.length) {
      const { options } = this;
      const args: Array<string> = [];
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

  private verifyOptions(): Array<string> {
    const errors: Array<string> = [];

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
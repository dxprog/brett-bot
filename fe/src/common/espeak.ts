export interface IEspeakOptions {
  [key: string]: any,
  lang?: string;
  gender?: string;
  variant?: number;
  speed?: number;
  ssml?: boolean;
  pitch?: number;
  emphasis?: number;
}

export const ESPEAK_LANGUAGES: Array<string> = [
  // Fully supported
  'af', 'bs', 'ca', 'cs', 'de', 'en', 'en-us', 'en-sc', 'en-n', 'en-rp', 'en-wm',
  'el', 'eo', 'es', 'es-la', 'fi', 'fr', 'hr', 'hu', 'it', 'kn', 'lv', 'nl', 'pl',
  'pt', 'pt-pt', 'ro', 'sk', 'sr', 'sv', 'ta', 'tr', 'zh',

  // Provisional
  'cy', 'grc', 'hi', 'hy', 'id', 'id', 'jbo', 'ka', 'la', 'mk', 'no', 'ru', 'sq',
  'vi', 'zh-yue'
];

export const ESPEAK_GENDERS: Array<string> = [ 'm', 'f' ];
export const ESPEAK_VARIANTS: Array<string | number> = [
  1, 2, 3, 4, 5, 6, 7, 'croak', 'whisper'
];
import { Dictionary } from './common';

export interface IEspeakOptions {
  [key: string]: any,
  lang?: string;
  voiceType?: string;
  variant?: number;
  speed?: number;
  ssml?: boolean;
  pitch?: number;
  emphasis?: number;
}

export const ESPEAK_LANGUAGES: Dictionary<string> = {
  // Fully supported
  'en': 'Brittbot',
  'en-us': `'Murican`,
  'en-sc': 'Scotsman',
  'af': 'Afrikaans',
  'bs': 'Bosnian',
  'ca': 'Catalan',
  'cs': 'Czech',
  'da': 'Danish',
  'de': 'German',
  'el': 'Greek',
  'en-n': 'Northern Brittbot',
  'en-rp': 'Received Pronunciation Brittbot',
  'en-wm': 'West Midlands Brittbot',
  'eo': 'Esperanto',
  'es': 'Spanish',
  'es-la': 'Latin American',
  'fi': 'Finnish',
  'fr': 'French',
  'hr': 'Croatian',
  'hu': 'Hungarian',
  'it': 'Italian',
  'kn': 'Kannada',
  'ku': 'Kurdish',
  'lv': 'Latvian',
  'nl': 'Dutch',
  'pl': 'Polish',
  'pt': 'Brazilian Portuguese',
  'pt-pt': 'European Prtuguese',
  'ro': 'Romanian',
  'sk': 'Slovak',
  'sr': 'Serbian',
  'sv': 'Swedish',
  'sw': 'Swahili',
  'ta': 'Tamil',
  'tr': 'Turkish',
  'zh': 'Mandarin Chinese',

  // Provisional
  'cy': 'Welsh',
  'grc': 'Ancient Greek',
  'hi': 'Hindi',
  'hy': 'Armenian',
  'id': 'Indonesian',
  'is': 'Icelandic',
  'jbo': 'Lojban',
  'ka': 'Georgian',
  'la': 'Latin',
  'mk': 'Macedonian',
  'no': 'Norwegian',
  'ru': 'Russian',
  'sq': 'Albanian',
  'vi': 'Vietnamese',
  'zh-yue': 'Cantonese Chinese'
}
export const ESPEAK_LANGUAGE_CODES: Array<string> = Object.keys(ESPEAK_LANGUAGES);

export const ESPEAK_VOICE_TYPES: Dictionary<string> = {
  m: 'Male',
  f: 'Female',
  croak: 'Croak',
  whisper: 'Whisper'
}
export const ESPEAK_VOICE_TYPE_CODES: Array<string> = Object.keys(ESPEAK_VOICE_TYPES);

export const ESPEAK_VARIANTS: Array<string | number> = [
  1, 2, 3, 4, 5, 6, 7
];

export const ESPEAK_DEFAULT_OPTIONS: IEspeakOptions = {
  lang: 'en',
  voiceType: 'm',
  variant: 3,
  speed: 120,
  ssml: false,
  pitch: 50,
  emphasis: 5
};
import * as React from 'react';

import './SpeechOptions.css';
import {
  IEspeakOptions,
  ESPEAK_LANGUAGES,
  ESPEAK_LANGUAGE_CODES,
  ESPEAK_VOICE_TYPES,
  ESPEAK_VOICE_TYPE_CODES
} from './common/espeak';

const { Fragment } = React;

export interface ISpeechOptionsProps {
  options: IEspeakOptions
}

export class SpeechOptions extends React.Component<ISpeechOptionsProps> {
  constructor(props: ISpeechOptionsProps) {
    super(props);
    this.handleLangChange = this.handleLangChange.bind(this);
    this.handleSpeedChange = this.handleSpeedChange.bind(this);
  }

  handleLangChange(evt: React.ChangeEvent<HTMLSelectElement>) {
    this.props.options.lang = evt.target.value;
    this.forceUpdate();
  }

  handleVoiceTypeChange(voiceType: string) {
    this.props.options.voiceType = voiceType;
    this.forceUpdate();
  }

  handleSSMLChange(enabled: boolean) {
    this.props.options.ssml = enabled;
    this.forceUpdate();
  }

  handleSpeedChange(evt: React.ChangeEvent<HTMLInputElement>) {
    this.props.options.speed = parseInt(evt.target.value);
    this.forceUpdate();
  }

  render() {
    const { options } = this.props;
    return (
      <Fragment>
        <h3>Options</h3>
        <div className="speech-option">
          <label htmlFor="lang" className="speech-option__label">Language:</label>
          <select
            name="lang"
            className="speech-option__dropdown"
            value={options.lang}
            onChange={this.handleLangChange}>
            {
              ESPEAK_LANGUAGE_CODES.map((lang: string) => {
                const langLabel: string = ESPEAK_LANGUAGES[lang];
                return (
                  <option
                    key={`lang-${lang}`}
                    value={lang}
                  >
                    {langLabel}
                  </option>
                );
              })
            }
          </select>
        </div>
        <div className="speech-option">
          <span className="speech-option__label">Voice Type: </span>
          <div className="speech-option__options">
            {
              ESPEAK_VOICE_TYPE_CODES.map(voiceType => {
                const voiceTypeLabel = ESPEAK_VOICE_TYPES[voiceType];
                return (
                  <label className="speech-option__option" key={`voiceType-${voiceType}`}>
                    <input
                      type="radio"
                      checked={options.voiceType === voiceType}
                      onChange={() => this.handleVoiceTypeChange(voiceType)}
                      value={voiceType}
                    /> {voiceTypeLabel}
                  </label>
                );
              })
            }
          </div>
        </div>
        <div className="speech-option">
          <span className="speech-option__label">Enable SSML: </span>
          <div className="speech-option__options">
            <label className="speech-option__option">
              <input
                type="checkbox"
                checked={options.ssml}
                onChange={() => this.handleSSMLChange(!options.ssml)}
              />
            </label>
          </div>
        </div>
        <div className="speech-option">
          <span className="speech-option__label">Enable SSML: </span>
          <div className="speech-option__options">
            <label className="speech-option__option">
              <input
                type="number"
                value={options.speed}
                onChange={this.handleSpeedChange}
              />
            </label>
          </div>
        </div>
      </Fragment>
    );
  }
}
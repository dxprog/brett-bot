import * as React from 'react';

import './LogDateSeparator.css';

const MONTHS: Array<string> = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function formatDate(date: Date) {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export interface ILogDateSeparatorProps {
  date: Date;
}

export class LogDateSeparator extends React.Component<ILogDateSeparatorProps> {
  render() {
    console.log(this.props.date);
    return (
      <li className="log__date-separator">
        {formatDate(this.props.date)}
      </li>
    );
  }
}
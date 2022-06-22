import './index.styl';
import React from 'react';
import Experience from '@/containers/Farm/scripts/Experience';

export default class Earth extends React.Component {

  componentDidMount () {
    this.init();
  }

  init () {
    const experience = new Experience({
      targetElement: document.querySelector('.farm')
    });
    this.experience = experience;
  }

  render () {
    return (
      <div className='farm'>farm</div>
    )
  }
}
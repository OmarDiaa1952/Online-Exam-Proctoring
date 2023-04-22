import React from 'react';

let hidden = null;
let visibilityChange = null;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support 
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

class TabSwitch extends React.Component {

  state = {
    actions: []
  }

  componentDidMount() {
    document.addEventListener(visibilityChange, this.handleVisibilityChange, false);
  }

  handleVisibilityChange = () => {
    if (document[hidden]) {
    //  this.setState({actions: [...this.state.actions, 'hide']});
    console.log('hide');
    } else {
    //  this.setState({actions: [...this.state.actions, 'show']});
    console.log('show');
    }
  }

  componentWillUnmount()    {
    document.removeEventListener(visibilityChange, this.handleVisibilityChange);
  }

  render() {
    return (
        <div></div>
    //   <ul>
    //   {
    //     this.state.actions.map((item, key) => <li key={key}>{item}</li>)
    //   }
    // </ul>
    )
  }
}

export default TabSwitch;
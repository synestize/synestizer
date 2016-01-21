(function( global, document, Rx) {
    'use strict';
    
    var ui;
    
    global.ui = ui = global.ui || {};
    
    class HelloComponent extends React.Component {  
      render() {
        return <div>Hello {this.props.name}</div>;
    }
}

})(this, document, Rx, React);

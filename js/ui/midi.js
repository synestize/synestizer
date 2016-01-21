(function (global, document, Rx) {
    'use strict';

    var ui;

    global.ui = ui = global.ui || {};

    class HelloComponent extends React.Component {
        render() {
            return React.createElement(
                'div',
                null,
                'Hello ',
                this.props.name
            );
        }
    }
})(this, document, Rx, React);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3VpLXNyYy9taWRpLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFDLFVBQVUsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7QUFDN0IsZ0JBQVksQ0FBQzs7QUFFYixRQUFJLEVBQUUsQ0FBQzs7QUFFUCxVQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7QUFFakMsVUFBTSxjQUFjLFNBQVMsS0FBSyxDQUFDLFNBQVMsQ0FBQztBQUMzQyxjQUFNLEdBQUc7QUFDUCxtQkFBTzs7OztnQkFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUk7YUFBTyxDQUFDO1NBQzdDO0tBQ0o7Q0FFQSxDQUFBLENBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMiLCJmaWxlIjoibWlkaS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiggZ2xvYmFsLCBkb2N1bWVudCwgUngpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgdmFyIHVpO1xuICAgIFxuICAgIGdsb2JhbC51aSA9IHVpID0gZ2xvYmFsLnVpIHx8IHt9O1xuICAgIFxuICAgIGNsYXNzIEhlbGxvQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHsgIFxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPGRpdj5IZWxsbyB7dGhpcy5wcm9wcy5uYW1lfTwvZGl2PjtcbiAgICB9XG59XG5cbn0pKHRoaXMsIGRvY3VtZW50LCBSeCwgUmVhY3QpO1xuIl19
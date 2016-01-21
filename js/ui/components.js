(function (global, document, Rx, React, ReactDOM) {
  'use strict';

  var ui;

  global.ui = ui = global.ui || {};

  class MidiInComponent extends React.Component {
    render() {
      return React.createElement(
        "div",
        { "class": "Widget" },
        React.createElement(
          "h2",
          null,
          "Midi In"
        ),
        React.createElement(
          "select",
          { name: "midiInDevice", id: "midiInDevice", disabled: "true", "class": "midiselect" },
          React.createElement(
            "option",
            null,
            "none"
          )
        )
      );
    }
  }
})(this, document, Rx, React, ReactDOM);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3VpLXNyYy9jb21wb25lbnRzLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFDLFVBQVUsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUNoRCxjQUFZLENBQUM7O0FBRWIsTUFBSSxFQUFFLENBQUM7O0FBRVAsUUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7O0FBRWpDLFFBQU0sZUFBZSxTQUFTLEtBQUssQ0FBQyxTQUFTLENBQUM7QUFDNUMsVUFBTSxHQUFHO0FBQ1AsYUFBTzs7VUFBSyxTQUFNLFFBQVE7UUFDeEI7Ozs7U0FBZ0I7UUFDZDs7WUFBUSxJQUFJLEVBQUMsY0FBYyxFQUFDLEVBQUUsRUFBQyxjQUFjLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFNLFlBQVk7VUFBQzs7OztXQUFxQjtTQUFTO09BQzNHLENBQUE7S0FFVDtHQUNGO0NBRUYsQ0FBQSxDQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyIsImZpbGUiOiJjb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCBnbG9iYWwsIGRvY3VtZW50LCBSeCwgUmVhY3QsIFJlYWN0RE9NKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgXG4gIHZhciB1aTtcbiAgXG4gIGdsb2JhbC51aSA9IHVpID0gZ2xvYmFsLnVpIHx8IHt9O1xuICBcbiAgY2xhc3MgTWlkaUluQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHsgIFxuICAgIHJlbmRlcigpIHtcbiAgICAgIHJldHVybiA8ZGl2IGNsYXNzPVwiV2lkZ2V0XCI+XG4gICAgICAgIDxoMj5NaWRpIEluPC9oMj5cbiAgICAgICAgICA8c2VsZWN0IG5hbWU9XCJtaWRpSW5EZXZpY2VcIiBpZD1cIm1pZGlJbkRldmljZVwiIGRpc2FibGVkPVwidHJ1ZVwiIGNsYXNzPVwibWlkaXNlbGVjdFwiPjxvcHRpb24+bm9uZTwvb3B0aW9uPjwvc2VsZWN0PlxuICAgICAgICA8L2Rpdj5cblxuICAgIH1cbiAgfVxuXG59KSh0aGlzLCBkb2N1bWVudCwgUngsIFJlYWN0LCBSZWFjdERPTSk7XG4iXX0=
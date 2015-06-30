/*
UI models display params
*/

(function(window, _, d3){
    'use strict';
    var instruments;
    window.instruments = instruments = window.instruments || {};
    instruments.BasicInstView = function (paramset, elem) {
        return {
            render: function () {
                this.$el.append($("<h3></h3>").text(this.className));
                _.each(
                    this.model.controls,
                    function(info, label, controls) {
                        this.$el.append(this.makeWidget(this.model, label));
                    },
                    this);
            },
            update: function () {},
            destroy: {},
        }
    };
})(window, _, d3);

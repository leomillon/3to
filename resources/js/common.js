(function(exports){

    // Constants
    exports.constants = {
        State: {
            X: 'X',
            O: 'O',
            BLANK: null
        },
        MIN_PLAYER: 2,
        MAX_PLAYER: 2,
        MAX_GRID_SIZE: 3
    };

    // Methods
    function Utils() {
        this.isUndefined = function(variable) {
            return typeof variable === 'undefined';
        };

        this.isDefined = function(variable) {
            return !this.isUndefined(variable);
        };
    }

    exports.utils = new Utils();

})(typeof exports === 'undefined' ? this['common']={}: exports);
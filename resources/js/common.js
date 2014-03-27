(function(exports){

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

})(typeof exports === 'undefined' ? this['common']={}: exports);
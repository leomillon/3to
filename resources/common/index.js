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
        var cst = {
            Method: {
                GET: 'GET',
                POST: 'POST'
            }
        };
        // Private
        var isUndefined = function(variable) {
            return typeof variable === 'undefined';
        };

        var isDefined = function(variable) {
            return !isUndefined(variable);
        };

        var isMethod = function(actual, expected) {
            return isDefined(actual) && actual.toUpperCase() === expected.toUpperCase();
        };

        var isPostMethod = function(method) {
            return isMethod(method, cst.Method.POST);
        };

        var isGetMethod = function(method) {
            return isMethod(method, cst.Method.GET);
        };

        // Public
        this.isUndefined = isUndefined;
        this.isDefined = isDefined;

        this.isPost = isPostMethod;
        this.isGet = isGetMethod;
    }

    exports.utils = new Utils();

})(typeof exports === 'undefined' ? this['common']={}: exports);
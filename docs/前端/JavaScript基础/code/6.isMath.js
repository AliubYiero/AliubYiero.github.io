function isMath(value) {
    return Object.prototype.toString.call(value) === '[object Math]';
}
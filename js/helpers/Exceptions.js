export function invalidArgumentException(value) {
    this.value = value;
    this.message = 'Invalid argument exception thrown'
    this.toString = function () {
        return this.value + this.message;
    }
}
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
    if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
    }

    // 创建一个 promise
    var resolvePromise;
    // this.promise = new Promise((resolve) => {
    //     resolvePromise = resolve;
    // })
    // 当前实例暴露出 promise
    this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
    });

    var token = this;
    executor(function cancel(message) {
        if (token.reason) {
            // Cancellation has already been requested
            return;
        }

        token.reason = new Cancel(message);
        resolvePromise(token.reason);
    });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 * 如果 取消 则抛出取消
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
        throw this.reason;
    }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
    var cancel;
    // c = 上面的 executor cancel,当 c 调用的时候，其实是执行 promise.resolve ，之后 promise 的 then 回调会执行
    var token = new CancelToken((callback) => {
        cancel = callback;
    });
    // 将 Token 和 cancle 返回回去，之后调用 cancel() 取消
    return {
        token: token,
        cancel: cancel
    };
};

module.exports = CancelToken;

"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Promise = require("bluebird");
var reqwest = require("reqwest");
var NaminatimError = (function (_super) {
    __extends(NaminatimError, _super);
    function NaminatimError(message, requestData) {
        _super.call(this, message);
        this.requestData = requestData;
    }
    return NaminatimError;
}(Error));
exports.NaminatimError = NaminatimError;
/**
Creates a webrequest to the given path.
*/
function createRequest(method, path, data) {
    if (data === void 0) { data = {}; }
    //Result should be in JSON
    data["format"] = "json";
    var options = {
        url: "https://nominatim.openstreetmap.org/" + path,
        method: method,
        data: data,
        headers: {
            "Accept": "application/json"
        }
    };
    return reqwest(options);
}
;
/**
* Finishes a web request and automatically resolves or rejects it. Pass an optional callback to receive the
* response's string content and the promise resolver.
* @param message The web request method.
* @param resolve The promise resolver.
* @param reject The promise rejecter.
*/
function finishRequest(request) {
    // While it would be nicer to use Bluebird's Promise.resolve here rather than manually resolving and rejecting,
    // we would then lose the error message returned by reqwest.
    return new Promise(function (res, rej) {
        request.then(function (resp) {
            if (request.request.status > 205 || request.request.status < 200) {
                rej(new NaminatimError("Response for request did not indicate success. Status code: " + request.request.status + ".", request.request));
            }
            ;
            res(resp);
        })
            .fail(function (error, message) { return rej(new NaminatimError(message, error)); });
    });
}
;
/**
 * Creates and handles a complete web request.
 * @param method The request's HTTP method.
 * @param path The request's path.
 * @param data The request's optional querystring or body data object.
 */
function handleFullRequest(method, path, data) {
    var request = createRequest(method, path, data);
    return finishRequest(request);
}
;
/**
 * Lookup the latitude and longitude data for a given address.
 */
function geocode(data) {
    return handleFullRequest("GET", "search", data);
}
exports.geocode = geocode;
/**
 * Lookup the address data for a pair of latitude and longitude coordinates.
 */
function reverseGeocode(data) {
    return handleFullRequest("GET", "reverse", data);
}
exports.reverseGeocode = reverseGeocode;
/**
 * Lookup the address of one or multiple OSM objects like node, way or relation.
 */
function lookupAddress(data) {
    return handleFullRequest("GET", "lookup", data);
}
exports.lookupAddress = lookupAddress;

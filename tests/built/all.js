/// <reference path="./../typings/browser.d.ts" />
"use strict";
var nominatim_browser_1 = require("../dist/nominatim-browser");
var expect = chai.expect;
describe(".geocode", function () {
    this.timeout(10000);
    it("should return coordinates for a city/state/country", function (done) {
        nominatim_browser_1.geocode({
            city: "Minneapolis",
            state: "MN",
            country: "US"
        })
            .then(function (results) {
            expect(results.length).to.be.at.least(1);
            var result = results[0];
            expect(result.place_id).to.be.a("string");
            expect(result.licence).to.be.a("string");
            expect(result.lat).to.be.a("string");
            expect(result.lon).to.be.a("string");
            expect(result.display_name).to.equal("Minneapolis, Hennepin County, Minnesota, United States of America");
            done();
        })
            .catch(done);
    });
    it("should return address data with coordinates", function (done) {
        nominatim_browser_1.geocode({
            city: "Minneapolis",
            state: "MN",
            country: "US",
            addressdetails: true
        })
            .then(function (results) {
            expect(results.length).to.be.at.least(1);
            var result = results[0];
            expect(result.place_id).to.be.a("string");
            expect(result.licence).to.be.a("string");
            expect(result.lat).to.be.a("string");
            expect(result.lon).to.be.a("string");
            expect(result.display_name).to.equal("Minneapolis, Hennepin County, Minnesota, United States of America");
            expect(result.address).to.not.be.null;
            var address = result.address;
            expect(address.city).to.equal("Minneapolis");
            expect(address.county).to.equal("Hennepin County");
            expect(address.state).to.equal("Minnesota");
            expect(address.country).to.equal("United States of America");
            done();
        });
    });
});

/// <reference path="./../typings/browser.d.ts" />
/// <reference path="./../dist/nominatim-browser.d.ts" />
"use strict";
var nominatim_browser_1 = require("../dist/nominatim-browser");
var expect = chai.expect;
describe(".lookupAddress", function () {
    this.timeout(10000);
    it("should return data for osm addresses", function (done) {
        nominatim_browser_1.lookupAddress({
            osm_ids: "R146656,W104393803,N240109189"
        })
            .then(function (results) {
            expect(results.length).to.be.at.least(3);
            var result = results[0];
            expect(result.place_id).to.be.a("string");
            expect(result.licence).to.be.a("string");
            expect(result.lat).to.be.a("string");
            expect(result.lon).to.be.a("string");
            expect(result.display_name).to.equal("Manchester, Greater Manchester, North West England, England, United Kingdom");
            expect(result.address).to.not.be.null;
            var address = result.address;
            expect(address.city).to.equal("Manchester");
            expect(address.county).to.equal("Greater Manchester");
            expect(address.state).to.equal("England");
            expect(address.country).to.equal("United Kingdom");
            done();
        })
            .catch(done);
    });
});

/// <reference path="./../typings/browser.d.ts" />
/// <reference path="./../dist/nominatim-browser.d.ts" />
"use strict";
var nominatim_browser_1 = require("../dist/nominatim-browser");
var expect = chai.expect;
describe(".reverseGeocode", function () {
    this.timeout(10000);
    var minneapolisLatLon = {
        lat: "44.9772995",
        lon: "-93.2654691",
    };
    it("should return data for coordinates", function (done) {
        nominatim_browser_1.reverseGeocode(minneapolisLatLon)
            .then(function (result) {
            expect(result.place_id).to.be.a("string");
            expect(result.licence).to.be.a("string");
            expect(result.lat).to.be.a("string");
            expect(result.lon).to.be.a("string");
            expect(result.display_name).to.equal("Minneapolis City Hall, South 4th Street, St Anthony West, Phillips, Minneapolis, Hennepin County, Minnesota, 55415, United States of America");
            done();
        })
            .catch(done);
    });
    it("should return address data for coordinates", function (done) {
        nominatim_browser_1.reverseGeocode({
            lat: minneapolisLatLon.lat,
            lon: minneapolisLatLon.lon,
            addressdetails: true
        })
            .then(function (result) {
            expect(result.place_id).to.be.a("string");
            expect(result.licence).to.be.a("string");
            expect(result.lat).to.be.a("string");
            expect(result.lon).to.be.a("string");
            expect(result.display_name).to.equal("Minneapolis City Hall, South 4th Street, St Anthony West, Phillips, Minneapolis, Hennepin County, Minnesota, 55415, United States of America");
            expect(result.address).to.not.be.null;
            var address = result.address;
            expect(address.city).to.equal("Minneapolis");
            expect(address.county).to.equal("Hennepin County");
            expect(address.state).to.equal("Minnesota");
            expect(address.country).to.equal("United States of America");
            done();
        });
    });
});

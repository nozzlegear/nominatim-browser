/// <reference path="./../typings/browser.d.ts" />

import {geocode} from "../dist/nominatim-browser";
const expect = chai.expect;

describe(".geocode", function ()
{
    this.timeout(10000);
    
    it ("should return coordinates for a city/state/country", function (done)
    {
       geocode({
            city: "Minneapolis",
            state: "MN",
            country: "US"
       })
       .then(function (results)
       {
           expect(results.length).to.be.at.least(1);
           
           var result = results[0];
           
           expect(result.place_id).to.be.a("string");
           expect(result.licence).to.be.a("string");
           expect(result.osm_id).to.be.a("string");
           expect(result.lat).to.be.a("string");
           expect(result.lon).to.be.a("string");
           expect(result.display_name).to.equal("Minneapolis, Hennepin County, Minnesota, United States of America");
           
           done();
       })
       .catch(done);
    })
    
    it ("should return address data with coordinates", function (done)
    {
        geocode({
            city: "Minneapolis",
            state: "MN",
            country: "US",
            addressdetails: true
        })
        .then(function (results)
        {
            expect(results.length).to.be.at.least(1);
            
            var result = results[0];
            
            expect(result.place_id).to.be.a("string");
            expect(result.licence).to.be.a("string");
            expect(result.osm_id).to.be.a("string");
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
        })
    })
});
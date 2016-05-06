/// <reference path="./../typings/browser.d.ts" />
/// <reference path="./../dist/nominatim-browser.d.ts" />

import {reverseGeocode} from "../dist/nominatim-browser";
const expect = chai.expect;

describe(".reverseGeocode", function ()
{
    this.timeout(10000);
    
    const minneapolisLatLon = {
        lat: "44.9772995",
        lon: "-93.2654691",
    }
    
    it ("should return data for coordinates", function (done)
    {
       reverseGeocode(minneapolisLatLon)
       .then(function (result)
       {
           expect(result.place_id).to.be.a("string");
           expect(result.licence).to.be.a("string");
           expect(result.lat).to.be.a("string");
           expect(result.lon).to.be.a("string");
           expect(result.display_name).to.equal("Minneapolis City Hall, South 4th Street, St Anthony West, Phillips, Minneapolis, Hennepin County, Minnesota, 55415, United States of America");
           
           done();
       })
       .catch(done);
    })
    
    it ("should return address data for coordinates", function (done)
    {
        reverseGeocode({
            lat: minneapolisLatLon.lat,
            lon: minneapolisLatLon.lon,
            addressdetails: true
        })
        .then(function (result)
        {
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
        })
    })
});
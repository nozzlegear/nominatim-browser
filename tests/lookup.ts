/// <reference path="./../typings/browser.d.ts" />
/// <reference path="./../dist/nominatim-browser.d.ts" />

import {lookupAddress as lookup} from "../dist/nominatim-browser";
const expect = chai.expect;

describe(".lookupAddress", function ()
{
    this.timeout(10000);
    
    it ("should return data for osm addresses", function (done)
    {
       lookup({
           osm_ids: "R136712" //To determine the osm_id, use a NominatimResponse's 'osm_id' and prefix it with the first letter of its `osm_type`.
       })
       .then(function (results)
       {
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
       })
       .catch(done);
    })
});
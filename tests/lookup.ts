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
           osm_ids: "R146656,W104393803,N240109189"
       })
       .then(function (results)
       {
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
    })
});
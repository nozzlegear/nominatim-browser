import {lookupAddress as lookup} from "../nominatim-browser";
import { Expect, AsyncTest, Timeout, TestFixture } from "alsatian";

@TestFixture(".lookup test fixture")
export class LookupTestFixture {
    @AsyncTest(".lookup(): Should return data for osm addresses")
    @Timeout(5000)
    public async lookup() {
       const results = await lookup({
           osm_ids: "R136712" //To determine the osm_id, use a NominatimResponse's 'osm_id' and prefix it with the first letter of its `osm_type`.
       })

        Expect(results.length >= 1).toBe(true);
        
        const result = results[0];
        
        Expect(typeof(result.place_id)).toBe("number");
        Expect(typeof(result.licence)).toBe("string");
        Expect(typeof(result.lat)).toBe("string");
        Expect(typeof(result.lon)).toBe("string");
        Expect(result.display_name).toEqual("Minneapolis, Hennepin County, Minnesota, United States of America");
        Expect(result.address).not.toBeNull();
        Expect(result.address).toBeDefined();

        const address = result.address;
        
        Expect(address.city).toEqual("Minneapolis");
        Expect(address.county).toEqual("Hennepin County");
        Expect(address.state).toEqual("Minnesota");
        Expect(address.country).toEqual("United States of America");
    }
}
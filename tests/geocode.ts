import { geocode } from "../nominatim-browser";
import { Expect, AsyncTest, TestFixture, Timeout } from "alsatian";

@TestFixture(".geocode test fixture")
export class GeocodeFixture {

    @AsyncTest(".getCoords(): Should return coordinates for a city/state/country")
    @Timeout(5000)
    public async getCoords() {
        const results = await geocode({
            city: "Minneapolis",
            state: "MN",
            country: "US"
        });

        Expect(results.length >= 1).toBe(true);

        const result = results[0];

        Expect(typeof (result.place_id)).toBe("string");
        Expect(typeof (result.licence)).toBe("string");
        Expect(typeof (result.osm_id)).toBe("string");
        Expect(typeof (result.lat)).toBe("string");
        Expect(typeof (result.lon)).toBe("string");
        Expect(result.display_name).toEqual("Minneapolis, Hennepin County, Minnesota, United States of America");
    }

    @AsyncTest(".getAddressWithCoords(): Should return address data with coordinates")
    @Timeout(5000)
    public async getAddressWithCoords() {
        const results = await geocode({
            city: "Minneapolis",
            state: "MN",
            country: "US",
            addressdetails: true
        });

        Expect(results.length >= 1).toBe(true);

        const result = results[0];

        Expect(typeof(result.place_id)).toBe("string");
        Expect(typeof(result.licence)).toBe("string");
        Expect(typeof(result.osm_id)).toBe("string");
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
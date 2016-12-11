import { reverseGeocode } from "../nominatim-browser";
import { Expect, AsyncTest, Timeout, TestFixture } from "alsatian";

@TestFixture(".reverseGeocode test fixture")
export class ReverseGeocodeTestFixture {
    static MINNEAPOLIS_LAT_LONG = {
        lat: "44.9772995",
        lon: "-93.2654691",
    }

    @AsyncTest(".reverseGeocode(): Should return data for coordinates")
    @Timeout(5000)
    public async reverseGeocode() {
        const result = await reverseGeocode(ReverseGeocodeTestFixture.MINNEAPOLIS_LAT_LONG);

        Expect(typeof (result.place_id)).toBe("string");
        Expect(typeof (result.licence)).toBe("string");
        Expect(typeof (result.lat)).toBe("string");
        Expect(typeof (result.lon)).toBe("string");
        Expect(result.display_name).toEqual("Minneapolis City Hall, South 4th Street, St Anthony West, Phillips, Minneapolis, Hennepin County, Minnesota, 55415, United States of America");
    }

    @AsyncTest(".reverseGeocodeWithAddress(): Should return address data for coordinates")
    @Timeout(5000)
    public async reverseGeocodeWithAddress() {
        const result = await reverseGeocode({
            addressdetails: true,
            ...ReverseGeocodeTestFixture.MINNEAPOLIS_LAT_LONG
        });

        Expect(typeof (result.place_id)).toBe("string");
        Expect(typeof (result.licence)).toBe("string");
        Expect(typeof (result.lat)).toBe("string");
        Expect(typeof (result.lon)).toBe("string");
        Expect(result.display_name).toEqual("Minneapolis City Hall, South 4th Street, St Anthony West, Phillips, Minneapolis, Hennepin County, Minnesota, 55415, United States of America");
        Expect(result.address).not.toBeNull();
        Expect(result.address).toBeDefined();

        const address = result.address;

        Expect(address.city).toEqual("Minneapolis");
        Expect(address.county).toEqual("Hennepin County");
        Expect(address.state).toEqual("Minnesota");
        Expect(address.country).toEqual("United States of America");
    }
}
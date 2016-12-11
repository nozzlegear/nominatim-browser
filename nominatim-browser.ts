import * as Bluebird from "bluebird";

export class NominatimError extends Error {
    constructor(message: string, public requestData) {
        super(message);
    }
}

export interface Viewbox {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export interface Request {
    /**
     * Include a breakdown of the address into elements
     */
    addressdetails?: boolean;

    /**
     * If you are making large numbers of requests please include a valid email address or alternatively include 
     * your email address as part of the User-Agent string. This information will be kept confidential and only 
     * used to contact you in the event of a problem.
     */
    email?: string;

    /**
     * Include additional information in the result if available, e.g. wikipedia link, opening hours.
     */
    extratags?: boolean;

    /**
     * Include a list of alternative names in the results. These may include language variants, references, 
     * operator and brand.
     */
    namedetails?: boolean;
}

export interface BaseGeocodeRequest extends Request {
    /**
     * Output geometry of results in geojson format.
     */
    polygon_geojson?: boolean;

    /**
     * Output geometry of results in kml format.
     */
    polygon_kml?: boolean;

    /**
     * Output geometry of results in svg format.
     */
    polygon_svg?: boolean;

    /**
     * Output geometry of results as a WKT.
     */
    polygon_text?: boolean;
}

export interface GeocodeRequest extends BaseGeocodeRequest {
    /**
     * House number and street name.
     */
    street?: string;

    city?: string;

    county?: string;

    state?: string;

    country?: string;

    postalcode?: string;

    /**
     * Limit search results to the given 2-digit country codes.
     */
    countrycodes?: string[];

    /**
     * The preferred area to find search results
     */
    viewbox?: Viewbox;

    /**
     * The preferred area to find search results
     */
    viewboxlbrt?: Viewbox;

    /**
     * Restrict the results to only items contained with the bounding box. Restricting the results to the bounding 
     * box also enables searching by amenity only. 
     */
    bounded?: boolean;

    /**
     * If you do not want certain openstreetmap objects to appear in the search result, give a comma separated 
     * list of the place_id's you want to skip.
     */
    exclude_place_ids?: string[];

    /**
     * Limit the number of returned results.
     */
    limit?: number;

    /**
     * No explanation yet.
     */
    dedupe?: boolean;

    /**
     * No explanation yet.
     */
    debug?: boolean;
}

export interface ReverseGeocodeRequest extends BaseGeocodeRequest {
    osm_type?: string[];

    /**
     * A specific osm node / way / relation to return an address for. Please use this in preference to 
     * lat/lon where possible.
     */
    osm_id?: string;

    lat?: string;

    lon?: string;

    /**
     * Level of detail required where 0 is country and 18 is house/building.
     */
    zoom?: number;
}

export interface LookupRequest extends Request {
    /**
     * A list of up to 50 specific osm node, way or relations ids separated by commas and prefixed by 'N', 'W' or 'R'.
     * To determine the osm_id, use a NominatimResponse's 'osm_id' and prefix it with the first letter of its `osm_type`.
     */
    osm_ids: string;
}

export interface GeocodeAddress {
    "county": string;
    "city": string;
    "city_district": string;
    "construction": string;
    "continent": string;
    "country": string;
    "country_code": string;
    "house_number": string;
    "neighbourhood": string;
    "postcode": string;
    "public_building": string;
    "state": string;
    "suburb": string;
}

export interface NominatimResponse {
    address: GeocodeAddress;

    boundingbox: string[];

    class: string;

    display_name: string;

    importance: number;

    lat: string;

    /**
     * [sic]
     */
    licence: string;

    lon: string;

    osm_id: string;

    osm_type: string;

    place_id: string;

    svg: string;

    type: string;
}

/**
Creates a webrequest to the given path.
*/
function createRequest<T>(method: string, path: string, data: Object = {}) {
    //Result should be in JSON
    data["format"] = "json";

    

    const options = {
        url: "https://nominatim.openstreetmap.org/" + path,
        method: method,
        data: data,
        headers: {
            "Accept": "application/json"
        }
    };

    return reqwest<T>(options);
};

/**
* Finishes a web request and automatically resolves or rejects it. Pass an optional callback to receive the 
* response's string content and the promise resolver.
* @param message The web request method.
* @param resolve The promise resolver.
* @param reject The promise rejecter.
*/
function finishRequest<T>(request: reqwest.ReqwestPromise<T>) {
    // While it would be nicer to use Bluebird's Promise.resolve here rather than manually resolving and rejecting,
    // we would then lose the error message returned by reqwest.

    return new Bluebird<T>((res, rej) => {
        request.then((resp) => {
            if (request.request.status > 205 || request.request.status < 200) {
                rej(new NominatimError(`Response for request did not indicate success. Status code: ${request.request.status}.`, request.request));
            };

            res(resp as T);
        })
            .fail((error, message) => rej(new NominatimError(message, error)));
    });
};

/**
 * Creates and handles a complete web request.
 * @param method The request's HTTP method.
 * @param path The request's path.
 * @param data The request's optional querystring or body data object.
 */
function handleFullRequest<T>(method: string, path: string, data?: any) {
    var request = createRequest(method, path, data);

    return finishRequest<T>(request);
};

/**
 * Lookup the latitude and longitude data for a given address.
 */
export function geocode(data: GeocodeRequest) {
    return handleFullRequest<NominatimResponse[]>("GET", "search", data);
}

/**
 * Lookup the address data for a pair of latitude and longitude coordinates.
 */
export function reverseGeocode(data: ReverseGeocodeRequest) {
    return handleFullRequest<NominatimResponse>("GET", "reverse", data);
}

/**
 * Lookup the address of one or multiple OSM objects like node, way or relation. 
 */
export function lookupAddress(data: LookupRequest) {
    return handleFullRequest<NominatimResponse[]>("GET", "lookup", data);
}
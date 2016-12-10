import * as Promise from "bluebird";
export declare class NaminatimError extends Error {
    requestData: XMLHttpRequest;
    constructor(message: string, requestData: XMLHttpRequest);
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
     * If you are making large numbers of request please include a valid email address or alternatively include
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
 * Lookup the latitude and longitude data for a given address.
 */
export declare function geocode(data: GeocodeRequest): Promise<NominatimResponse[]>;
/**
 * Lookup the address data for a pair of latitude and longitude coordinates.
 */
export declare function reverseGeocode(data: ReverseGeocodeRequest): Promise<NominatimResponse>;
/**
 * Lookup the address of one or multiple OSM objects like node, way or relation.
 */
export declare function lookupAddress(data: LookupRequest): Promise<NominatimResponse[]>;

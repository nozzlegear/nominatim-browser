# nominatim-browser

A browser-usable client for [Open Street Map's **Nominatim** service](http://wiki.openstreetmap.org/wiki/Nominatim). It can be used to lookup the latitude and longitude coordinates for an address and
to lookup the address for a pair of latitude and longitude coordinates.

### Goals

While there are plenty of Nominatim clients available on NPM, none of them are currently built for use in the browser. Instead, they rely on Node's `http` module, or other Node-only http frameworks. On top of that,
none of those clients offer TypeScript definitions.

The goal of `nominatim-browser` is to fill both of those holes by providing a Nominatim client that can be used from the browser with TypeScript definitions.

## Installing

You can install this package from [NPM](https://npmjs.com/package/nominatim-browser):

```bash
npm install nominatim-browser --save
```

Use [`typings`](https://github.com/typings/typings) to install the TypeScript definition from GitHub:

```bash
typings install github:nozzlegear/nominatim-browser --save

#It's a good idea to lock a GitHub-installed typings file to a certain hash
typings install github:nozzlegear/nominatim-browser#COMMITHASH
```

(This package will soon be added to the `typings` registry.)

## Usage

Import the lib:

```js
// With ES6-style imports
import * as Nominatim from "nominatim-browser";

// With node-style requires:
var Nominatim = require("nominatim-browser";
```

If you can't use `require` or ES6-imports, this package [also provides a webpacked version](https://github.com/nozzlegear/nominatim-browser/blob/master/dist/nominatim-browser.webpacked.js) which bundles all of the necessary dependencies.
Once loaded, the bundled script will make all `nominatim-browser` functions available under the `Nominatim` variable.

```html
<script type="text/javascript" src="dist/nominatim-browser.webpacked.js" ></script>
<script type="text/javascript">
//Nominatim is now available
console.log("Nominatim is", Nominatim);
</script>
```

### Nominatim.geocode(request: GeocodeRequest): Promise\<NominatimResponse[]\>

Looks up the latitude and longitude data for a given address, returning an array of `NominatimResponse` objects found for the address.

(Please [review the TypeScript definition file](https://github.com/nozzlegear/nominatim-browser/blob/master/dist/nominatim-browser.d.ts) for full documentation on `GeocodeRequest`, `NominatimResponse` and all other object types.)

```js
Nominatim.geocode({
    city: "Minneapolis",
    state: "MN",
    country: "US",
    addressdetails: true
})
.then((results: NominatimResponse[]) =>
{
    var result = results[0];
    
    console.log(result.lat);          // '44.9772995'
    console.log(result.lon);          // '-93.2654691'
    console.log(result.display_name); // 'Minneapolis, Hennepin County, Minnesota, United States of America'
    
    // result.address is only returned when 'addressdetails: true' is sent in the geocode request
    console.log(result.address.city);    // 'Minneapolis'
    console.log(result.address.county);  // 'Hennepin County'
    console.log(result.address.state);   // 'Minnesota'
    console.log(result.address.country); // 'United States of America'
    
})
.catch((error) =>
{
    console.error(error);
});
```

### Nominatim.reverseGeocode(request: ReverseGeocodeRequest): Promise\<NominatimResponse\>

Looks up the address data for a pair of latitude and longitude coordinates.

```js
Nominatim.reverseGeocode({
    lat: "44.9772995",
    lon: "-93.2654691",
    addressdetails: true
})
.then((result : NominatimResponse) =>
{
    console.log(result.display_name); // 'Minneapolis City Hall, South 4th Street, St Anthony West, Phillips, Minneapolis, Hennepin County, Minnesota, 55415, United States of America'
    
    // result.address is only returned when 'addressdetails: true' is sent in the request
    console.log(result.address.city);    // 'Minneapolis'
    console.log(result.address.county);  // 'Hennepin County'
    console.log(result.address.state);   // 'Minnesota'
    console.log(result.address.country); // 'United States of America'
})
.catch((error) =>
{
    console.error(error); 
});
```

### Nominatim.lookupAddress(request: LookupRequest): Promise\<NominatimResponse[]\>

Looks up the address for multiple Open Street Maps objects like node, way or relation.

```js
Nominatim.lookupAddress({
    osm_ids: "R136712,R146656" //A list of OSM ids separated by comma
})
.then((results: NominatimResponse[]) =>
{
    // First result will be the R136712 (Minneapolis) id. 
    var result = results[0];
    
    console.log(result.display_name);    // 'Minneapolis, Hennepin County, Minnesota, United States of America'
    console.log(result.address.city);    // 'Minneapolis'
    console.log(result.address.county);  // 'Hennepin County'
    console.log(result.address.state);   // 'Minnesota'
    console.log(result.address.country); // 'United States of America'
})
.catch((error) =>
{
    console.error(error); 
});
```

## Types

Please [review the TypeScript definition file](https://github.com/nozzlegear/nominatim-browser/blob/master/dist/nominatim-browser.d.ts) for full documentation on `GeocodeRequest`, `NominatimResponse` and all other object types.

## Contributing to nominatim-browser

In order to build `nominatim-browser`, ensure that you have [git](http://git-scm.com/downloads), [Node.js](https://nodejs.org), [NPM](https://npmjs.com) and [gulp-cli](https://npmjs.com/package/gulp-cli) installed.

Clone a copy of the master `nominatim-browser` git repo:

```bash
git clone https://github.com/nozzlegear/nominatim-browser.git
```

Change to the `nominatim-browser` directory:

```bash
cd nominatim-browser
```

Install the necessary NPM packages:

```bash
npm install
```

Run `gulp` to build the TypeScript lib and test files:

```bash
gulp
```

Run tests via NPM's `test` command:

```bash
npm run test
```

While I really appreciate any contribution, please make sure that they have test coverage, and that all tests are written in TypeScript with [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/).

When you're ready to contribute, [make a pull request](https://github.com/nozzlegear/nominatim-browser/pull/new/master)!

## License

MIT © [Joshua Harms](https://nozzlegear.com)

# cuttly

Unofficial promise based Cuttly API wrapper for node.js

## Installing

Using npm:

```bash
$ npm install cuttly
```

Using yarn:

```bash
$ yarn add cuttly
```

## Usage

```
cuttly.shortenUrl(
    <CUTTLY_KEY>,
  <url_to_shorten>
).then(
  (response) => console.log(response),
  (error) => console.log(error)
)
```

## Documentation

### Response

The response object provided has the following attributes :


| Parameter | Description                 |
|-----------|-----------------------------|
| date      | date of shortening the link |
| shortLink | shortened link              |
| fullLink  | original link               |
| title     | website title               |


	see https://cutt.ly/api-documentation/cuttly-links-api
	
### Error

Upon rejection, the error type is ```CuttlyError```

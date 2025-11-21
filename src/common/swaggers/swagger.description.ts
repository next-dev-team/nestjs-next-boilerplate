export const swaggerDescription = `
## API Documentation Overview
___
### Authorization
The API uses the standard HTTP \`Authorization\` header to pass authentication information.


### Parameters
Many API methods take optional parameters.
* For \`GET\` and \`DELETE\` requests, parameters are passed as query string in the url.
* For \`POST\` and \`PUT\` requests, parameters are encoded as JSON with a Content-Type of \`application/json\` in the header.
* For \`Device Info\` & \`App Info\` in \`headers\`, are demanded such:\`x-device-[brand,model,id,generated-id,system-version,type,token,os], x-app-uid, x-app-type,x-ref-id\`.
### Supported Request & Response Format
JSON Only -- [No XML](http://s2.quickmeme.com/img/72/72e5b8f58c83b44f09e83ebf05920eeb234d1719ce8911d6e898e46562c47710.jpg) here';

### Response format
There are two types of response
* For \`ERROR\` response: \`{statusCode:http_status_code, message: error_message, code: key_for_translate(default:"UNKNOWN")}\`

* For \`OK\` response: \`{message: "success", data:{}|[], meta:{}}\`
`;

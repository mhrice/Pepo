
export function token(id){

var AccessToken = require('twilio').AccessToken;
var IpMessagingGrant = AccessToken.IpMessagingGrant;

// You will need your Account Sid, Programmable Chat Service instance Sid and a API Key Sid and Secret
// to generate an Access Token for your Programmable Chat endpoint to connect to Twilio.

// Can be found on https://www.twilio.com/console/account/settings
var accountSid = 'AC5d3fec7d11171c71dc228f26d54abf5d';

// Should be created on https://www.twilio.com/console/chat/runtime/api-keys
var apiKeySid = 'SKb3ed58fce7e9c87e0abff58a5569d744';
var apiKeySecret = '2zlhwl4m4OprPE6YnQcOR4JcIjp6EVVy';

// Can be found on https://www.twilio.com/console/chat/services
var serviceSid = 'IS4166fe1c1f58483385e24736b55fa9f3';

var identity = id;

var endpointId = 'ip-messaging-demo:' + identity + ':demo-device';

var token = new AccessToken(apiKeySid, accountSid, apiKeySecret);

var ipmGrant = new IpMessagingGrant({
  serviceSid: serviceSid,
  endpointId: endpointId
});

token.addGrant(ipmGrant);
token.identity = identity;
console.log(token.toJwt());
}

const {RBU} = require('hubot-doge-utility-functions')

/**
 * Sets up websocket with rocket.chat server and runs "getUserRoles" method.
 *
 * I modified the original version by John Szaszvari <jszaszvari@gmail.com>
 * Git Repo:  https://github.com/jszaszvari/rocketchat-ddp-listener
 *
 */

//authToken that we got from the Rocket.Chat API (requires
//process.env.ROCKETCHAT_PASSWORD, process.env.ROCKETCHAT_USER and process.env.ROCKETCHAT_URL to be set)

RBU.getAuthToken().then(res => {
  const authToken = res.data.authToken

  console.log('authTOken ----->', authToken)
  const DDP = require("ddp");
  const login = require("ddp-login");
  process.env.METEOR_TOKEN = authToken;

  const ddpClient = new DDP({

    // Address of the Rocket.Chat server you want to connect to
    host: process.env.ROCKETCHAT_WEBSOC_URL,

    // Port of the Rocket.Chat server.
    port: process.env.ROCKETCHAT_WEBSOC_PORT,

    // if server doesn't have ssl remove line below
    ssl: true,
    maintainCollections: true
  });

  ddpClient.connect(function(err) {
    if (err) throw err;


    login(ddpClient, {
      env: "METEOR_TOKEN",
      method: "token",
      retry: 5

    },



      function(error, userInfo) {


        if (error) {
        // Something went wrong...
      } else {
        // We are now logged in, with userInfo.token as our session auth token.
        token = userInfo.token;
        console.log("Authentication Sucessful.\n");

        // .call (methodName, params, callback)
        ddpClient.call('getUserRoles', [], function(error, resp) {
          console.log('here', error)
          console.log('here', resp)
        })
        }
      }
    );
  })
})

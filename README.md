![twilioflexlogo](/media/extendingflex.png?raw=true, "Extending Flex-Salesforce Integration")

# Extending Flex-Salesforce Integration

This repository is part of a blog post to demonstrate how to customize the [Integration of Twilio Flex and Salesforce](https://www.twilio.com/docs/flex/integrations/salesforce). It gives an overview how to implement custom logging, record creation and popping of records in response to events on the Flex Platform.


# Related repositories
- [Salesforce (Apex)](https://github.com/andrej-s/flex-sfdc-apex) used to create and lookup records needed on Salesforce Side

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards, install the dependencies by running `npm install`:

```bash
cd 

# If you use npm
npm install
```

## Config
To configure your Flex plugin, modify the file `/public/appConfig.example.js` and rename it to `/public/appConfig.js`

## Development

In order to develop locally, you can run the server by running:

```bash
npm start
```

This will automatically start up the express server and open the browser for you. Your app will run on `http://localhost:8080`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

When you make changes to your code, nodemon will automatically reload your server.


## Deploy

Once you are happy with your plugin, you have to bundle it in order to deploy it to Twilio Flex.

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin project. For example, `plugin-example.js`. Take this file and upload it into the Assets part of your Twilio Runtime.

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.
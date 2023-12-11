# @react-ion/cli (CLI for creating, running and building @react-ion apps)

## Getting started:
To install the cli tool run `npm i @react-ssr/cli --global`.
Then to create an `@react-ssr` app run `ion new project {PROJECT_NAME}` which will create an app in the `{PROJECT_NAME}` folder.
To run/watch the app while developing run `npm run watch/dev` or `ion watch/dev`.
To build the final app run `npm run build` or `ion build`.

## Documentation:
The whole app is based on the `ion.json` config. The CLI tool will read it and build/link the app based on the settings.
All the pages will be bundled seperately as if they were totally different apps.
To set the global.api/window.api object an entry point to the api exports is needed.
```json
{
	"pages": {
		"app": {
			"path": "/",
			"src": "./src/pages/app"
		},
		"admin": {
			"path": "/admin",
			"src": "./src/pages/admin"
		}
	},
	"server": {
		"api": {
			"src": "./src/server/api",
			"path": "/api"
		},
		"session": {
			"resave": false,
			"rolling": true,
  			"saveUninitialized": true,
  			"cookie": {
				"maxAge": 86400000,
				"httpOnly": true,
				"path": "/"
			}
		}
	}
}
``````

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  jsapi_config: {url: 'https://js.arcgis.com/4.14/'},
  maxAttachments: 4,
  name: 'Innovate!',
  portal_setting : {
    url: 'https://portal.innovateteam.com/arcgis',
    appId: '5d2rgNDIEPIHgjwj'
  },
  rest_setting : {
    url: 'https://arcserver.innovateteam.com/arcgis/rest/services/TCRIS/TCRIS/FeatureServer/',
    report: 'https://arcserver.innovateteam.com/arcgis/rest/services/TCRIS/'
  }
};


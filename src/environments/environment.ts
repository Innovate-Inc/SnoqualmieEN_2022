// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  jsapiConfig: {url: 'https://js.arcgis.com/4.15/'},
  maxAttachments: 4,
  name: 'Innovate!',
  portalSetting : {
    url: 'https://portal.innovateteam.com/arcgis',
    appId: '5d2rgNDIEPIHgjwj',
    mapId_1: '839f096da1a94ebb8ec5323a2d166193',
    mapId_2: 'c838538b432943508f2a7fd568b0a161',
    mapId: '63b1c93bfe8e42dca58459f47db6ebe0'
  },
  restSetting : {
    url: 'https://arcserver.innovateteam.com/arcgis/rest/services/TCRIS/TCRIS/FeatureServer/',
    report: 'https://arcserver.innovateteam.com/arcgis/rest/services/TCRIS/'
  }
};


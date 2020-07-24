const url = 'https://arcserver.innovateteam.com/arcgis/rest/services/Snoq_demo/Snoq_Survey/FeatureServer';

export const environment = {
  production: true,
  jsapiConfig: { url: 'https://js.arcgis.com/4.15/' },
  maxAttachments: 4,
  name: 'Innovate!',
  portalSetting: {
    url: 'https://portal.innovateteam.com/arcgis',
    appId: '5d2rgNDIEPIHgjwj',
    mapId_1: '839f096da1a94ebb8ec5323a2d166193',
    mapId_2: 'c838538b432943508f2a7fd568b0a161',
    mapId_3: '63b1c93bfe8e42dca58459f47db6ebe0',
    mapId: '01d331569c8b4127829d21eac99d20b4'
  },
  layers: {
    review: `${url}/0`,
    call: `${url}/1`,
    comm: `${url}/2`,
    docu: `${url}/3`,
    field: `${url}/5`,
    hearing: `${url}/6`,
    meet: `${url}/7`,
    site: `${url}/8`,
    violation: `${url}/9`,
    walk: `${url}/10`,
    // url: 'https://arcserver.innovateteam.com/arcgis/rest/services/TCRIS/TCRIS/FeatureServer/',
    // report: 'https://arcserver.innovateteam.com/arcgis/rest/services/TCRIS/'
  }
};


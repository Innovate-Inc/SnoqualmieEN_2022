export const url = 'https://arcserver.innovateteam.com/arcgis/rest/services/Snoq_demo/Snoq_Survey/FeatureServer';

export const environment = {
  production: true,
  jsapiConfig: {url: 'https://js.arcgis.com/4.15/'},
  maxAttachments: 4,
  name: 'Assert',
  portalSetting : {
    url: 'https://maps.snoqualmietribe.us/portal',
    appId: 'diCIRzmGi5yW8nVJ',
    mapId: 'b24d6d7642a24c2c821e1e78eaf0719a'
  },
  layers: {
    review: `${url}/0`,
    call: `${url}/1`,
    ce: `${url}/3`,
    comm: `${url}/4`,
    docu: `${url}/5`,
    field: `${url}/6`,
    hearing: `${url}/7`,
    meet: `${url}/8`,
    site: `${url}/9`,
    violation: `${url}/10`
    // url: 'https://arcserver.innovateteam.com/arcgis/rest/services/TCRIS/TCRIS/FeatureServer/',
    // report: 'https://arcserver.innovateteam.com/arcgis/rest/services/TCRIS/'
  }
};


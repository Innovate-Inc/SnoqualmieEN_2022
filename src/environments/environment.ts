// export const url = 'https://arcserver.innovateteam.com/arcgis/rest/services/Snoq_demo/Snoq_survey/FeatureServer';

// export const environment = {
//   production: false,
//   jsapiConfig: { url: 'https://js.arcgis.com/4.17/' },
//   maxAttachments: 4,
//   name: 'Innovate!',
//   portalSetting: {
//     url: 'https://portal.innovateteam.com/arcgis',
//     appId: '5d2rgNDIEPIHgjwj',
//     mapId: '01d331569c8b4127829d21eac99d20b4'
//   },
//   layers: {
//     review: `${url}/0`,
//     activities: `${url}/1`,
//     call: `${url}/2`,
//     ce: `${url}/3`,
//     comm: `${url}/4`,
//     docu: `${url}/5`,
//     field: `${url}/6`,
//     hearing: `${url}/7`,
//     meet: `${url}/8`,
//     site: `${url}/9`,
//     violation: `${url}/10`
//   },
//   reportService: {
//     url: 'https://arcserver.innovateteam.com/arcgis/rest/services/Snoq_demo/GenerateReport/GPServer/generateReport',
//     surveyItem: '42ce8a3fd58741e680f5a62bb8f5cc82',
//     surveyTemplate: 2
//   },
//   mapLayerName: 'Snoq_Survey - Review Tracking',
//   helpUrl: '//tempUrl'
// };

export const url = 'https://maps.snoqualmietribe.us/server/rest/services/Assert/ASSERT/FeatureServer';

export const environment = {
  production: true,
  jsapiConfig: {url: 'https://js.arcgis.com/4.17/'},
  maxAttachments: 4,
  name: 'Assert',
  portalSetting : {
    url: 'https://maps.snoqualmietribe.us/portal',
    appId: 'kdUmjgmiOPWq3Mpe',
    mapId: '7340bca6d42446fda17a1510d1c13f30'
  },
  layers: {
    review: `${url}/0`,
    activities: `${url}/1`,
    call: `${url}/2`,
    ce: `${url}/3`,
    comm: `${url}/4`,
    docu: `${url}/5`,
    field: `${url}/6`,
    hearing: `${url}/7`,
    meet: `${url}/8`,
    site: `${url}/9`,
    violation: `${url}/10`
  },
  reportService: {
    url: '',
    surveyItem: '',
    surveyTemplate: 2
  },
  mapLayerName: 'Review Tracking',
  helpUrl: ''
};


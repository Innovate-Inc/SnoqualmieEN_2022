export const url = 'https://maps.snoqualmietribe.us/server/rest/services/Assert/Assert_Review_Tracking/FeatureServer';

export const environment = {
  production: true,
  jsapiConfig: {url: 'https://js.arcgis.com/4.17/'},
  maxAttachments: 4,
  name: 'Assert',
  portalSetting : {
    url: 'https://maps.snoqualmietribe.us/portal',
    appId: 'diCIRzmGi5yW8nVJ',
    mapId: 'b24d6d7642a24c2c821e1e78eaf0719a'
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
    url: 'https://arcserver.innovateteam.com/arcgis/rest/services/Snoq_demo/GenerateReport/GPServer/generateReport',
    surveyItem: '42ce8a3fd58741e680f5a62bb8f5cc82',
    surveyTemplate: 2
  },
  mapLayerName: 'Assert_Review_Tracking',
  helpUrl: ''
};


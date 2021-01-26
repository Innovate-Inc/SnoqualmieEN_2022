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
    call: `${url}/1`,
    ce: `${url}/2`,
    comm: `${url}/3`,
    docu: `${url}/4`,
    field: `${url}/5`,
    hearing: `${url}/6`,
    meet: `${url}/7`,
    site: `${url}/8`,
    violation: `${url}/9`,
    activities: `${url}/11`
  },
  reportService: {
    url: 'https://arcserver.innovateteam.com/arcgis/rest/services/Snoq_demo/GenerateReport/GPServer/generateReport',
    surveyItem: '42ce8a3fd58741e680f5a62bb8f5cc82',
    surveyTemplate: 0
  },
  mapLayerName: 'Assert_Review_Tracking'
};


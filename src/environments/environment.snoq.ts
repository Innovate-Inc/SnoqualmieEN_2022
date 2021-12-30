export const url =
  "https://maps.snoqualmietribe.us/server/rest/services/Assert/ASSERT/FeatureServer";

export const environment = {
  production: true,
  jsapiConfig: { url: "https://js.arcgis.com/4.17/" },
  maxAttachments: 4,
  name: "Assert",
  portalSetting: {
    url: "https://maps.snoqualmietribe.us/portal",
    appId: "kdUmjgmiOPWq3Mpe",
    mapId: "7340bca6d42446fda17a1510d1c13f30",
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
    violation: `${url}/10`,
    links: `${url}/11`,
  },
  reportService: {
    url: "https://maps.snoqualmietribe.us/server/rest/services/Assert/generateReport/GPServer/generateReport",
    surveyItem: "b5a7172f7fef479a8596bbad17a0025c",
    surveyTemplate: 0,
  },
  mapLayerName: "Review Tracking",
  helpUrl: "",
};

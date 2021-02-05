// import {loadModules} from 'esri-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import Geoprocessor from 'esri/tasks/Geoprocessor';
import esriRequest from 'esri/request';

import symbolsObjectSymbol3DLayer = __esri.symbolsObjectSymbol3DLayer;

export class ArcGpService {
  gp: Geoprocessor;
  gpg: Geoprocessor;
  genComplete = false;

  constructor(gpurl: string, public snackBar: MatSnackBar) {
    this.gp = new Geoprocessor({
      url: `${gpurl}`
    });

    // gpg used to generate invoice
    this.gpg = new Geoprocessor({
      url: `${gpurl}`
    });
  }

  openSnackBar(message: string, action: string) {
    const vm = this;
    vm.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  public generate(params: any) {
    const vm = this;
    return new Observable(obs => {
      vm.gpg.submitJob(params).then((e: any) => {
        vm.gpg.waitForJobCompletion(e.jobId).then((a: any) => {
          if (a.jobStatus === 'esriJobFailed') {
            vm.openSnackBar(`Error: ` + a.message, '');
            obs.complete();
          } else {
            vm.openSnackBar(`Generation Complete`, '');
            obs.complete();
            vm.genComplete = true;
          }
        }, (err: any) => {
          vm.openSnackBar(err.toString() + ' ' + err.details[0], '');
          obs.error(err);
        }).catch(err => {
          vm.openSnackBar(err, '');
        });
      }
        , (err: any) => {
          vm.openSnackBar(err.toString() + ' ' + err.details[0], '');
          obs.error(err);
        }
      ).catch(error => {
        vm.openSnackBar(error, '');
      });
    });
  }

  public submit(params: any, resultParam: string) {
    const vm = this;
    return new Observable(obs => {
      vm.gp.submitJob(params).then((e: any) => {
        vm.gp.waitForJobCompletion(e.jobId).then((a: any) => {
          if (a.jobStatus === 'esriJobFailed') {
            this.snackBar.dismiss();
            vm.openSnackBar(`Error: ` + a.message, '');
            obs.complete();
          } else {
            vm.gp.getResultData(a.jobId, resultParam).then((result: any) => {
              const resultUrl = `${vm.gp.url}/jobs/${a.jobId}/results/docId`;
              console.log(resultUrl);
              const options: __esri.RequestOptions = {
                query: {
                  f: 'json'
                },
                responseType: 'json'
              };

              esriRequest(resultUrl, options).then((response: any) => {
                console.log('response', response);
                window.open(`${params.portal_url}/sharing/rest/content/items/${response.data.value}/data?token=${params.survey_token}`);
                obs.complete();
              });
            });
          } // );
        }, (err: any) => {
          vm.openSnackBar(err.toString() + ' ' + err.details[0], '');
          obs.error(err);
        }).catch(err => {
          vm.openSnackBar(err, '');
        });
      }
        , (err: any) => {
          vm.openSnackBar(err.toString() + ' ' + err.details[0], '');
          obs.error(err);
        }
      ).catch(error => {
        vm.openSnackBar(error, '');
      });
    });
  }





  //       ;

  //     }, (err: any) => {
  //       vm.openSnackBar(err.toString() + ' ' + err.details[0], '');
  //       obs.error(err);
  //     }
  //     );
  //   });
  // }
}




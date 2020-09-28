import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../services/project.service';
import {LoadingService} from '../services/loading.service';

@Component({
  selector: 'app-support-docs-form',
  templateUrl: './support-docs-form.component.html',
  styleUrls: ['./support-docs-form.component.css']
})
export class SupportDocsFormComponent implements OnInit {
displayColumns = ['Task', 'Start_Date', 'Assigned_To'];
projectId: string;

  constructor(public projectService: ProjectService, public  loadingService: LoadingService) { }

  ngOnInit(): void {
  }

}

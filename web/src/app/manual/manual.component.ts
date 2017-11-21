import { Component, OnInit } from '@angular/core';
import {ManualService} from '../services/manual.service';

import {Manual} from '../services/manual';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {

  manual: Manual;

  constructor(private service: ManualService) { }

  ngOnInit() {
    this.service.getManual('dde-file-manager', 'en_US')
      .subscribe((manual: Manual) => {
        this.manual = manual;
        const iframe = document.querySelector('iframe');
        // iframe.srcdoc = parseResult.html;
        // iframe.setAttribute('srcdoc', iframe.srcdoc);
      });
  }


}

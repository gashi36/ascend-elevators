import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-superadmin-panel',
  templateUrl: './superadmin-panel.component.html',
  imports: [
    RouterModule],
  styleUrls: ['./superadmin-panel.component.scss'],
  standalone: true,
})
export class SuperadminPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

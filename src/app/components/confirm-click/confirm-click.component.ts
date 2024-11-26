import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-click',
  templateUrl: './confirm-click.component.html',
  styleUrls: ['./confirm-click.component.scss'],
})
export class ConfirmClickComponent  implements OnInit {
  alertButtons:any[] = [];
  isConfirmAlert:boolean=true;
  @Input() message: string = 'Are you sure?';
  @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() {
    this.alertButtons=[{
      text: 'Cancel',
      handler: () => {
        this.isConfirmAlert=false;

      },
    },
    {
      text: 'OK',
      handler: () => {
        this.isConfirmAlert=false;

      },
    },]
  }

}

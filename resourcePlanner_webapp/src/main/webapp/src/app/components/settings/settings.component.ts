import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ExchangeService } from 'src/app/services/exchange/exchange.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  obj: any;

  constructor(public exchangeService: ExchangeService) {}

  ngOnInit(): void {
    this.getData();
  }

  /**
   * Get and set debug data
   */
  private getData(): void {
    AppComponent.data.recalculate();
    this.obj = AppComponent.data.getSafeData();
  }
}

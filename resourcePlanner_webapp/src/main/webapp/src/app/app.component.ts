import { Component, HostListener } from '@angular/core';
import packageJson from '../../package.json';
import { LocalConfig } from './models/config.model';
import { Data } from './models/data.model';
import { Theme } from './models/theme.model';
import { ThemeService } from './services/theme/theme.service';
import { XsltService } from './services/xslt/xslt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Ressourcenplaner';
  version = packageJson.version;

  /**
   * Catch close event and show confirmation message if data changed
   * @param event Event
   */
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: any) {
    localStorage[LocalConfig.data] = new XMLSerializer().serializeToString(
      new XsltService().saveXML(AppComponent.data.getSafeData())
    );
  }

  /**
   * Global data stack. Contains `Events` and `Habits`.
   */
  public static data: Data;

  /**
   * Load data with XSLT Service
   * @param xml Path to XML
   * @param xsl Path to XSL
   */
  static loadData(xsl: string, xml: string | Document): void {
    var obj = new XsltService().transformJSON(xsl, xml);
    AppComponent.setData(obj.root);
  }

  /**
   * Set global data
   * @param data Data to load
   */
  static setData(data: any): void {
    AppComponent.data = new Data(data);
    AppComponent.data.recalculate();
  }

  constructor(public themeService: ThemeService) {
    // If localstorage has data, load it
    if (localStorage[LocalConfig.data]) {
      var doc = new DOMParser().parseFromString(
        localStorage[LocalConfig.data],
        'application/xml'
      );
      AppComponent.loadData('res/json.xsl', doc);
    }
    // Else load default data
    else AppComponent.loadData('res/json.xsl', 'res/data.xml');
  }


  get theme() {
    return Theme;
  }
}

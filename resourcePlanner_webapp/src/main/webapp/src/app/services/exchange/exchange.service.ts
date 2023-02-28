import {Injectable} from '@angular/core';
import {saveAs} from 'file-saver';
import { AppComponent } from 'src/app/app.component';
import { XsltService } from '../xslt/xslt.service';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  constructor(private xsltService: XsltService) {
  }

  /**
   * Function to download data
   */
  public download(): void {
    // XML to string
    var text = new XMLSerializer().serializeToString(
      this.xsltService.saveXML(AppComponent.data.getSafeData())
    );

    // String to `Blob`
    var blob = new Blob([text], {type: 'text/xml'});

    // Save data
    saveAs(blob, 'data.xml');
  }

  /**
   * Function to upload data
   * @param event DOM input event
   */
  public upload(event: Event) {
    // Get file
    let file: any = (event.target as HTMLInputElement).files![0];
    var reader: FileReader = new FileReader();
    var text: string = '';

    // Read file
    reader.readAsArrayBuffer(file);

    // After read
    reader.onloadend = function (res) {
      // If complete
      if (res.target?.readyState != FileReader.DONE) return;

      // Bytes to string
      var arrayBuffer = res.target.result;
      var buffer = new Uint8Array(arrayBuffer as any);
      for (const byte of buffer) {
        text += String.fromCharCode(byte);
      }

      // Remove `Processing Instructions`
      text = text.replace(/<\?.*\?>/, '');

      // String to XML Document
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, 'text/xml');

      // Load data
      AppComponent.loadData('res/json.xsl', doc);
    };
  }
}

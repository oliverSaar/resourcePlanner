import { Component, HostListener, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

import { XsltService } from 'src/app/services/xslt/xslt.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private xsltService: XsltService) {}

  ngOnInit(): void {
    this.xsltService
      .asyncTransform('res/dashboard.xsl', this.getDashboardXML())
      .then((frag) => {
        var element = document.createElement("div");
        element.classList.add(((frag as Node).firstChild as Element).classList[0]);
        element.innerHTML = ((frag as Node).firstChild as Element).innerHTML;
        document.getElementById('container')?.appendChild(element);
      });
  }

  /**
   * Generate XML for dashboard
   * @returns Generated XML
   */
  getDashboardXML(): any {
    return this.xsltService.saveXML(this.getDashboardData(), true);
  }

  /**
   * Get data to display for dashboard
   * @returns Sanitized copy of data
   */
  getDashboardData(): any {
    const data = {
      events: AppComponent.data.events,
      habits: AppComponent.data._habits,
    };

    for (const habit of data.habits) {
      for (const alternate of habit.alternateEvents) {
        alternate.reference = undefined;
      }
    }

    for (const event of data.events) {
      event.reference = undefined;
    }

    return data;
  }

  /**
   * Listen to external event `toggle-expand-habits`
   * @param event Window event
   */
  @HostListener('window:toggle-expand-habits', ['$event'])
  toggleExpandHabits(event: any) {
    var node = event.detail;
    const expanded = this.toggleExpandBody(node);
    this.changeIcon(node, expanded);
  }

  /**
   * Toggle expanding of body node
   * @param node Starting node
   * @returns `true` if expanded
   */
  toggleExpandBody(node: any): boolean {
    // Find expansion panel parent
    while (
      Array.from(node.classList).find((x) => x == 'mat-expansion-panel') ==
      undefined
    ) {
      node = node.parentNode;
    }
    // Find childs
    var childs = Array.from(node.childNodes as NodeList).filter(
      (x) => x.nodeName != '#text'
    );
    // Get dody element
    node = childs.find(
      (x) =>
        Array.from((x as HTMLElement).classList).find(
          (x) => x == 'mat-expansion-panel-body'
        ) != undefined
    );
    var classes = node.classList;
    // Check minimized state
    var index = Array.from(classes).indexOf('minimized');
    if (index == -1) {
      classes.add('minimized');
      return false;
    } else {
      classes.remove('minimized');
      return true;
    }
  }

  /**
   * Change navigation icon
   * @param node Starting node
   * @param isExpanded If is expanding icon
   */
  changeIcon(node: any, isExpanded: boolean): void {
    // Find icon element
    node = (node as HTMLElement).getElementsByClassName('mat-icon')[0];
    // Set state
    if (isExpanded) node.innerHTML = 'expand_more';
    else node.innerHTML = 'navigate_before';
  }
}

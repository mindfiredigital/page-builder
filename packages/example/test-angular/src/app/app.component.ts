import { Component } from '@angular/core';
import { PageBuilderComponent } from '@mindfiredigital/page-builder-angular';

@Component({
  selector: 'app-test',
  template: `
    <mf-page-builder
      [onInitialize]="handleInitialize"
      [customStyles]="customStyles"
    ></mf-page-builder>
  `,
  standalone: true,
  imports: [PageBuilderComponent],
})
export class AppComponent {
  customStyles = {
    wrapper: {
      border: '1px solid #ccc',
    },
  };

  handleInitialize(pageBuilder: any) {
    console.log('PageBuilder initialized:', pageBuilder);
  }
}

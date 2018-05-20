import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, NgZone, Input } from '@angular/core';

@Component({
  selector: 'ngx-sketch-dropzone',
  template: `

  <mat-icon class="mode__mini" *ngIf="mode === 'mini' else large" (drop)="onFileDrop($event)" (dragover)="dragOverHandler($event)" (click)="openFileBrowser()">cloud_upload</mat-icon>

  <ng-template #large>
    <section (drop)="onFileDrop($event)" (dragover)="dragOverHandler($event)">
    <mat-icon class="mode__large">cloud_upload</mat-icon>
    <h2 class="mat-headline">Drag&Drop your Sketch file here</h2>
    <span class="mat-subheading-1">Or</span>
    <button color="accent" class="mat-headline" mat-button (click)="openFileBrowser()">BROWSE FILES</button>
    </section>
  </ng-template>
  
  <input #fileBrowserRef type="file" (change)="onFileChange($event)" accept=".sketch">
  `,
  styles: [
    `
  section {
    width: 600px;
    height: 400px;
    border-radius: 2px;
    border: 1px solid #bcbcbc;
    background: #eaeaea;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 20px auto;
  }

  input[type="file"] {
    display: none;
  }

  .mode__large {
    font-size: 7em;
    color: #b0b0b0;
    width: 200px;
    height: 120px;
  }

  .mode__mini {
    cursor: pointer;
  }
  `
  ]
})
export class SketchDropzoneComponent implements OnInit {
  @Input() mode: 'mini|large';
  @Output() changed: EventEmitter<File>;
  @ViewChild('fileBrowserRef') fileBrowserRef: ElementRef;
  constructor() {
    this.changed = new EventEmitter();
  }

  ngOnInit() {}

  openFileBrowser() {
    this.fileBrowserRef.nativeElement.click();
  }

  onFileDrop(event) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          const file = event.dataTransfer.items[i].getAsFile() as File;
          this.changed.emit(file);

          // we only accept one file (for now)
          return true;
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        const file = event.dataTransfer.files[i];
        this.changed.emit(file);

        // we only accept one file (for now)
        return true;
      }
    }

    // Pass event to removeDragData for cleanup
    this.removeDragData(event);
  }

  dragOverHandler(event) {
    event.preventDefault();
  }

  onFileChange(e) {
    const files = e.target.files || e.dataTransfer.files;
    if (!files.length) {
      return;
    }
    const file = files[0];
    this.changed.emit(file);
  }

  private removeDragData(event) {
    console.log('Removing drag data');

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      event.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      event.dataTransfer.clearData();
    }
  }
}

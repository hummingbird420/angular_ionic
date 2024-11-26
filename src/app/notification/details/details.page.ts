import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { Store } from '@ngxs/store';
import { UpdateHeader } from '../../states/user-state';
import { ViewDidEnter } from '@ionic/angular';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements ViewDidEnter {
  param_notice_id: string = '';
  noticeDetails$!: Observable<any>;
  imgUrl: string = '';
  isModalOpen = false;
  isToastOpen = false;
  errMessage: string = '';
  constructor(private route: ActivatedRoute, private noticeService: NotificationService, private router: Router, private store: Store) {

  }
  ionViewDidEnter(): void {
    this.store.dispatch([new UpdateHeader('Notice Details', false, '')]);
    const param = this.route.snapshot.paramMap.get('key');
    if (param) {
      this.param_notice_id = atob(param);
    }
    if (this.param_notice_id) {
      this.onLoad();
    }
    else {
      this.router.navigate(['notification']);
    }
  }
  onLoad() {
    this.noticeDetails$ = this.noticeService.getById(Number(this.param_notice_id));
    this.noticeDetails$.subscribe();
  }
  doRefresh(event: any) {
    this.onLoad();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  backToNotice() {
    this.router.navigate(['notification']);
  }
  viewFile(notice: any) {
    if (!notice.base64_file) {
      this.setToastOpen(true);
      this.errMessage = 'No file found in the notification';
      return;
    }
    else {
      const key = this.checkFileType(notice.file_name);
      if (key == 'jpg') {
        this.imgUrl = 'data:image/jpg;base64, ' + notice.base64_file;
        this.isModalOpen = true;
      }
      else if (key == 'png') {
        this.imgUrl = 'data:image/png;base64, ' + notice.base64_file;
        this.isModalOpen = true;
      }
      else if (key == 'gif') {
        this.imgUrl = 'data:image/gif;base64, ' + notice.base64_file;
        this.isModalOpen = true;
      }
      else {
        this.downLoadFile(notice.file_name, notice.base64_file);
      }
    }

  }
  async downLoadFile(fileName: string, value: string) {
    const result = await Filesystem.writeFile({
      path: fileName,
      data: value,
      directory: FilesystemDirectory.Documents
    });

    let fileOpener: FileOpener = new FileOpener();
    fileOpener.open(result.uri, 'application/pdf')
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    await Filesystem.readFile({
      path: fileName,
      directory: FilesystemDirectory.Documents
    });

  }
  checkFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    let fileType: string;

    switch (extension) {
      case 'jpg':
      case 'jpeg':
        fileType = 'jpg';
        break;
      case 'png':
        fileType = 'png';
        break;
      case 'gif':
        fileType = 'gif';
        break;
      case 'pdf':
        fileType = 'pdf';
        break;
      default:
        fileType = 'attachment';
        break;
    }

    return fileType;
  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  setToastOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}



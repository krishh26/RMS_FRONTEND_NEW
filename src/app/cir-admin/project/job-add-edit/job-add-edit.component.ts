import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcrServiceService } from 'src/app/services/acr-service/acr-service.service';
import { CirSericeService } from 'src/app/services/cir-service/cir-serice.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Patterns } from 'src/app/shared/constant/validation-patterns.const';

@Component({
  selector: 'app-job-add-edit',
  templateUrl: './job-add-edit.component.html',
  styleUrls: ['./job-add-edit.component.scss']
})
export class JobAddEditComponent implements OnInit {
  jobForm!: FormGroup;
  file: any;
  showLoader: boolean = false;
  jobID: string = '';
  fileUploadProcess: boolean = true;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private acrservice: AcrServiceService,
    private cirservice: CirSericeService,
  ) {
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate);

    this.jobForm = new FormGroup({
      job_title: new FormControl('', [Validators.required, Validators.pattern(Patterns.name)]),
      no_of_roles: new FormControl('', [Validators.required]),
      job_type: new FormControl('', [Validators.required]),
      start_date: new FormControl('', [Validators.required]),
      jobExpireDate: new FormControl('', [Validators.required]),
      publish_date: new FormControl(formattedDate, [Validators.required]),
      client_name: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      day_rate: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      upload: new FormControl('', [Validators.required]),
      job_id: new FormControl({ value: null, disabled: true })
    });

    this.jobForm.get('status')?.valueChanges.subscribe(status => {
      const jobIDControl = this.jobForm.get('job_id');

      if (status === 'Active') {
        jobIDControl?.enable();
        jobIDControl?.setValue(this.jobID);
      } else {
        jobIDControl?.disable();
        jobIDControl?.setValue(null);
      }
    });
  }


  ngOnInit() {
    this.getJobIDList();
  }

  getJobIDList() {
    this.showLoader = true;
    this.acrservice.getCirJobIdList().subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.jobID = response?.data?.job_id;
        console.log(this.jobID);
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message);
      this.showLoader = false;
    });
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  fileUpload(event: any): void {
    const file = event.target.files[0];

    // Check if file exists
    if (file) {
      // Rename the file to "readme" with the same extension
      const newFileName = 'readme' + file.name.substring(file.name.lastIndexOf('.'));
      const renamedFile = new File([file], newFileName, { type: file.type });

      const data = new FormData();
      data.append('files', renamedFile);
      this.fileUploadProcess = false;

      this.cirservice.fileUpload(data).subscribe(
        (response) => {
          if (response?.status) {
            this.file = response?.data;
            console.log(this.file);
            this.fileUploadProcess = true;
            this.notificationService.showSuccess(response?.message || 'File successfully uploaded.');
          } else {
            this.notificationService.showError(response?.message || 'File not uploaded.');
            this.fileUploadProcess = true;
          }
        },
        (error) => {
          this.notificationService.showError(error?.error?.message || 'File not uploaded.');
          this.fileUploadProcess = true;
        }
      );
    }
  }


  submit() {
    if (!this.jobForm.valid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    const uploadFile = this.file;

    const cvObject = {
      key: uploadFile?.key,
      url: uploadFile?.url,
    };

    let formData = {
      ...this.jobForm.value,
      upload: cvObject
    };

    if (this.jobForm.get('status')?.value !== 'Active') {
      delete formData['job_id'];
    }

    this.cirservice.Circreatejob(formData).subscribe(
      (response) => {
        if (response?.status) {
          this.notificationService.showSuccess(response?.message, 'Success!');
          this.jobForm.reset();
          this.getJobIDList();
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        const errorMessage = error?.error?.message || 'An unexpected error occurred.';
        this.notificationService.showError(errorMessage);
      }
    );
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


}

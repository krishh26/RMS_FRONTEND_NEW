import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Patterns } from 'src/app/shared/constant/validation-patterns.const';
import { ActivatedRoute, Router } from '@angular/router';
import { CirSericeService } from 'src/app/services/cir-service/cir-serice.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-cir-register',
  templateUrl: './cir-register.component.html',
  styleUrls: ['./cir-register.component.scss']
})
export class CirRegisterComponent implements OnInit {
  // Stepper properties
  currentStep = 1;

  // Form groups
  personalDetailForm!: FormGroup;
  otherDetailForm!: FormGroup;

  // Password visibility
  password = 'password';
  showPassword = false;
  confirmPassword = 'password';
  confirmShowPassword = false;

  // Personal details properties
  showUKVisaType: boolean = false;
  lookingFor: any[] = [];
  workPreference: any[] = [];

  // Additional details properties
  userID!: string;
  userdata: any = [];
  referredByOptions: any = [];
  dropdownSettings = {};
  showValidUptoDate: boolean = false;
  file: any;

  // Multi-select dropdown properties
  selectedPreferredRoles: any[] = [];
  selectedCallTime: any[] = [];
  selectedCallDay: any[] = [];

  // Time slots and days
  timeSlots = [
    { label: '1-2 AM', value: 1 },
    { label: '2-3 AM', value: 2 },
    { label: '3-4 AM', value: 3 },
    { label: '4-5 AM', value: 4 },
    { label: '5-6 AM', value: 5 },
    { label: '6-7 AM', value: 6 },
    { label: '7-8 AM', value: 7 },
    { label: '8-9 AM', value: 8 },
    { label: '9-10 AM', value: 9 },
    { label: '10-11 AM', value: 10 },
    { label: '11-12 AM', value: 11 },
    { label: '12-1 PM', value: 12 },
    { label: '1-2 PM', value: 13 },
    { label: '2-3 PM', value: 14 },
    { label: '3-4 PM', value: 15 },
    { label: '4-5 PM', value: 16 },
    { label: '5-6 PM', value: 17 },
    { label: '6-7 PM', value: 18 },
    { label: '7-8 PM', value: 19 },
    { label: '8-9 PM', value: 20 },
    { label: '9-10 PM', value: 21 },
    { label: '10-11 PM', value: 22 },
    { label: '11-12 PM', value: 23 }
  ];

  daysOfWeek = [
    { label: 'Anyday', value: 'Anyday' },
    { label: 'Mon', value: 'Mon' },
    { label: 'Tue', value: 'Tue' },
    { label: 'Wed', value: 'Wed' },
    { label: 'Thu', value: 'Thu' },
    { label: 'Fri', value: 'Fri' },
    { label: 'Sat', value: 'Sat' },
    { label: 'Sun', value: 'Sun' }
  ];

  preferredRoles = [
    { label: 'Programme Test Manager', value: 'Programme Test Manager' },
    { label: 'QA/Test Manager', value: 'QA/Test Manager' },
    { label: 'NFT Manager', value: 'NFT Manager' },
    { label: 'Automation Manager', value: 'Automation Manager' },
    { label: 'QA/Test Lead (Functional)', value: 'QA/Test Lead (Functional)' },
    { label: 'QA/Test Lead (Non-Functional)', value: 'QA/Test Lead (Non-Functional)' },
    { label: 'Automation Lead', value: 'Automation Lead' },
    { label: 'Performance Test Lead', value: 'Performance Test Lead' },
    { label: 'UAT Test Lead', value: 'UAT Test Lead' },
    { label: 'SIT Test Lead', value: 'SIT Test Lead' },
    { label: 'NFT Lead', value: 'NFT Lead' },
    { label: 'Test Analyst', value: 'Test Analyst' },
    { label: 'Senior Test Analyst', value: 'Senior Test Analyst' },
    { label: 'QA Tester', value: 'QA Tester' },
    { label: 'Automation Analyst / Engineer', value: 'Automation Analyst / Engineer' },
    { label: 'Performance Test Analyst', value: 'Performance Test Analyst' },
    { label: 'Performance Test Engineer', value: 'Performance Test Engineer' },
    { label: 'Security Analyst / Security Test Engineer', value: 'Security Analyst / Security Test Engineer' },
    { label: 'UAT Test Analyst', value: 'UAT Test Analyst' },
    { label: 'SIT Test Analyst', value: 'SIT Test Analyst' },
    { label: 'Test Data / Environment Analyst', value: 'Test Data / Environment Analyst' },
    { label: 'Defect Analyst / Manager', value: 'Defect Analyst / Manager' },
    { label: 'Accessibility Test Engineer', value: 'Accessibility Test Engineer' },
    { label: 'AI/ML Test Engineer', value: 'AI/ML Test Engineer' },
    { label: 'QA/Test Architect', value: 'QA/Test Architect' },
    { label: 'QA Tooling Specialist', value: 'QA Tooling Specialist' },
    { label: 'Release QA Coordinator', value: 'Release QA Coordinator' },
    { label: 'Risk & Issue Manager', value: 'Risk & Issue Manager' },
    { label: 'Continuous Improvement Lead', value: 'Continuous Improvement Lead' },
    { label: 'Service Transition Lead', value: 'Service Transition Lead' },
    { label: 'Knowledge Transfer Lead', value: 'Knowledge Transfer Lead' },
    { label: 'Graduate Enablement Coach', value: 'Graduate Enablement Coach' },
    { label: 'Training & Capability Lead', value: 'Training & Capability Lead' },
    { label: 'QA Career Pathway Manager', value: 'QA Career Pathway Manager' },
    { label: 'QA Coach / QA Enablement Coach', value: 'QA Coach / QA Enablement Coach' },
    { label: 'Trainee Tester', value: 'Trainee Tester' }
  ];

  bannerDetails: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cirservice: CirSericeService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
  ) {
    this.initializeForms();
    this.loadStoredData();
    this.setupReferredByOptions();
    this.route.queryParams.pipe().subscribe((params) => {
      if (params['code']) {
        localStorage.setItem('referCode', params['code'])
      }
    });
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'label',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.otherDetailForm.get('sc_dv_clearance_hold')?.valueChanges.subscribe((value) => {
      this.setWillingToUndertakeVisibility();
      if (value === 'yes') {
        this.otherDetailForm.get('sc_dv_valid_upto')?.setValidators([Validators.required]);
      } else {
        this.otherDetailForm.get('sc_dv_valid_upto')?.clearValidators();
        this.otherDetailForm.get('sc_dv_valid_upto')?.setValue('');
      }
      this.otherDetailForm.get('sc_dv_valid_upto')?.updateValueAndValidity();
    });

    this.getBanerDetails();
  }

  private setupReferredByOptions() {
    for (let i = 0; i <= 50; i++) {
      this.referredByOptions.push(i);
    }
  }

  private loadStoredData() {
    const localData: any = localStorage.getItem('rmsPersonalDetails');
    if (localData && localData !== 'undefined') {
      this.setFormValues(JSON.parse(localData));
    }
  }

  private initializeForms() {
    // Personal Details Form
    this.personalDetailForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern(Patterns.name)]),
      email: new FormControl('', [Validators.required, Validators.pattern(Patterns.email)]),
      countrycode: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      nationality: new FormControl('', [Validators.required]),
      UKVisaType: new FormControl(''), // Not required by default, will be set conditionally
      UKDrivinglicense: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      currentWork: new FormControl('', [Validators.required]),
      lookingFor: new FormControl([], [Validators.required]),
      workPreference: new FormControl([], [Validators.required]),
      noticePeriodDay: new FormControl('', [Validators.required]),
    });

    // Other Details Form
    this.otherDetailForm = new FormGroup({
      workLocation: new FormControl([]),
      currency: new FormControl('', [Validators.required]),
      expectedDayRate: new FormControl(''),
      referredBy: new FormControl(String(localStorage.getItem('referCode') || null)),
      callDay: new FormControl([], [Validators.required]),
      callTime: new FormControl([], [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(Patterns.password)]),
      anyQuestion: new FormControl(''),
      cv: new FormControl('', [Validators.required]),
      preferredRoles: new FormControl([], [Validators.required]),
      sc_dv_clearance_hold: new FormControl('', [Validators.required]),
      sc_dv_valid_upto: new FormControl(''),
      willing_to_undertake: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      eligible_for_SC: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator });

    this.otherDetailForm.get('referredBy')?.disable();
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const form = control as FormGroup;
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ notSame: true });
      return { notSame: true };
    }

    if (confirmPassword && confirmPassword.errors) {
      delete confirmPassword.errors['notSame'];
    }

    return null;
  }

  setFormValues(data: any) {
    this.personalDetailForm.patchValue({
      name: data?.name || '',
      email: data?.email || '',
      countrycode: data?.countrycode || '',
      phoneNumber: data?.phoneNumber || '',
      nationality: data?.nationality || '',
      UKVisaType: data?.UKVisaType || '',
      UKDrivinglicense: (data?.UKDrivinglicense ? 'yes' : 'no'),
      postalCode: data?.postalCode || '',
      currentWork: data?.currentWork || '',
      noticePeriodDay: data?.noticePeriodDay || '',
    });

    // Handle array fields
    if (data?.lookingFor) {
      this.lookingFor = Array.isArray(data.lookingFor) ? data.lookingFor : data.lookingFor.split(',');
      this.selectedRoles = [...this.lookingFor];
      this.personalDetailForm.patchValue({
        lookingFor: this.lookingFor
      });
    }

    if (data?.workPreference) {
      this.workPreference = Array.isArray(data.workPreference) ? data.workPreference : data.workPreference.split(',');
      this.workPreferenceSelection = [...this.workPreference];
      this.personalDetailForm.patchValue({
        workPreference: this.workPreference
      });
    }

    this.showUKVisaType = data?.nationality === 'other';

    // Set validation for UKVisaType based on nationality
    if (data?.nationality === 'other') {
      this.personalDetailForm.get('UKVisaType')?.setValidators([Validators.required]);
    } else {
      this.personalDetailForm.get('UKVisaType')?.clearValidators();
    }
    this.personalDetailForm.get('UKVisaType')?.updateValueAndValidity();
  }

  selectedLookingFor(type: string): boolean {
    return this.selectedRoles?.includes(type);
  }

  selectedWorkPreference(type: string): boolean {
    return this.workPreferenceSelection?.includes(type);
  }

  // Number only validation
  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  selectedRoles: string[] = [];

  onCheckboxChange(event: any) {
    const value = event.target.value;

    if (event.target.checked) {
      if (!this.selectedRoles.includes(value)) {
        this.selectedRoles.push(value);
      }
    } else {
      this.selectedRoles = this.selectedRoles.filter(role => role !== value);
    }

    // Update the form control
    this.personalDetailForm.patchValue({
      lookingFor: this.selectedRoles
    });
  }

  workPreferenceSelection: string[] = [];

  onCheckboxWorkPReference(event: any) {
    const value = event.target.value;

    if (event.target.checked) {
      if (!this.workPreferenceSelection.includes(value)) {
        this.workPreferenceSelection.push(value);
      }
    } else {
      this.workPreferenceSelection = this.workPreferenceSelection.filter(role => role !== value);
    }

    // Update the form control
    this.personalDetailForm.patchValue({
      workPreference: this.workPreferenceSelection
    });
  }

  public showHidePass(type: string): void {
    if (type == 'password' && this.password === 'password') {
      this.password = 'text';
      this.showPassword = true;
    } else {
      this.password = 'password';
      this.showPassword = false;
    }

    if (type !== 'password' && this.confirmPassword === 'password') {
      this.confirmPassword = 'text';
      this.confirmShowPassword = true;
    } else {
      this.confirmPassword = 'password';
      this.confirmShowPassword = false;
    }
  }

  onNationalityChange(event: Event): void {
    const selectedNationality = (event.target as HTMLSelectElement).value;
    this.showUKVisaType = selectedNationality === 'other';

    // Set validation for UKVisaType based on nationality
    if (selectedNationality === 'other') {
      this.personalDetailForm.get('UKVisaType')?.setValidators([Validators.required]);
    } else {
      this.personalDetailForm.get('UKVisaType')?.clearValidators();
      this.personalDetailForm.get('UKVisaType')?.setValue('');
    }
    this.personalDetailForm.get('UKVisaType')?.updateValueAndValidity();
  }

  submitPersonalDetail() {
    this.personalDetailForm.markAllAsTouched();

    // Update form controls with current selections
    this.personalDetailForm.patchValue({
      lookingFor: this.selectedRoles,
      workPreference: this.workPreferenceSelection
    });

    // Check if at least one option is selected for each required field
    const lookingForValid = this.selectedRoles.length > 0;
    const workPreferenceValid = this.workPreferenceSelection.length > 0;

    // Clear previous errors first
    this.personalDetailForm.get('lookingFor')?.setErrors(null);
    this.personalDetailForm.get('workPreference')?.setErrors(null);

    if (!lookingForValid) {
      this.personalDetailForm.get('lookingFor')?.setErrors({ required: true });
    }

    if (!workPreferenceValid) {
      this.personalDetailForm.get('workPreference')?.setErrors({ required: true });
    }

    // Check basic form validity (excluding the array fields we handle separately)
    const basicFormValid = this.personalDetailForm.get('name')?.valid &&
                          this.personalDetailForm.get('email')?.valid &&
                          this.personalDetailForm.get('countrycode')?.valid &&
                          this.personalDetailForm.get('phoneNumber')?.valid &&
                          this.personalDetailForm.get('nationality')?.valid &&
                          this.personalDetailForm.get('UKDrivinglicense')?.valid &&
                          this.personalDetailForm.get('postalCode')?.valid &&
                          this.personalDetailForm.get('currentWork')?.valid &&
                          this.personalDetailForm.get('noticePeriodDay')?.valid;

    // Check UKVisaType only if nationality is 'other'
    const ukVisaValid = this.personalDetailForm.get('nationality')?.value !== 'other' ||
                        this.personalDetailForm.get('UKVisaType')?.valid;

    console.log('Form validation check:', {
      basicFormValid,
      ukVisaValid,
      lookingForValid,
      workPreferenceValid,
      selectedRoles: this.selectedRoles,
      workPreferenceSelection: this.workPreferenceSelection,
      nationality: this.personalDetailForm.get('nationality')?.value,
      showUKVisaType: this.showUKVisaType
    });

    if (basicFormValid && ukVisaValid && lookingForValid && workPreferenceValid) {
      const data = {
        name: this.personalDetailForm.controls['name'].value || '',
        email: this.personalDetailForm.controls['email'].value || '',
        countrycode: this.personalDetailForm.controls['countrycode'].value || '',
        phoneNumber: this.personalDetailForm.controls['phoneNumber'].value || '',
        nationality: this.personalDetailForm.controls['nationality'].value || '',
        UKVisaType: this.personalDetailForm.controls['UKVisaType'].value || '',
        UKDrivinglicense: this.personalDetailForm.controls['UKDrivinglicense'].value || '',
        postalCode: this.personalDetailForm.controls['postalCode'].value || '',
        currentWork: this.personalDetailForm.controls['currentWork'].value || '',
        lookingFor: this.selectedRoles,
        workPreference: this.workPreferenceSelection,
        noticePeriodDay: this.personalDetailForm.controls['noticePeriodDay'].value || '',
      }
      localStorage.setItem('rmsPersonalDetails', JSON.stringify(data));
      console.log('Form is valid, moving to step 2');
      this.currentStep = 2;
    } else {
      console.log('Form validation failed:', {
        basicFormValid,
        ukVisaValid,
        lookingForValid,
        workPreferenceValid,
        formErrors: this.personalDetailForm.errors,
        controlErrors: {
          name: this.personalDetailForm.get('name')?.errors,
          email: this.personalDetailForm.get('email')?.errors,
          countrycode: this.personalDetailForm.get('countrycode')?.errors,
          phoneNumber: this.personalDetailForm.get('phoneNumber')?.errors,
          nationality: this.personalDetailForm.get('nationality')?.errors,
          UKVisaType: this.personalDetailForm.get('UKVisaType')?.errors,
          UKDrivinglicense: this.personalDetailForm.get('UKDrivinglicense')?.errors,
          postalCode: this.personalDetailForm.get('postalCode')?.errors,
          currentWork: this.personalDetailForm.get('currentWork')?.errors,
          noticePeriodDay: this.personalDetailForm.get('noticePeriodDay')?.errors,
          lookingFor: this.personalDetailForm.get('lookingFor')?.errors,
          workPreference: this.personalDetailForm.get('workPreference')?.errors
        }
      });
    }
  }


  goToPreviousStep() {
    this.currentStep = 1;
  }

  // Removed multi-select dropdown event handlers; ng-select binds directly via reactive forms

  setWillingToUndertakeVisibility(): void {
    const scDvClearanceValue = this.otherDetailForm.get('sc_dv_clearance_hold')?.value;
    if (scDvClearanceValue !== 'no') {
      this.otherDetailForm.get('willing_to_undertake')?.reset();
    }
  }


  fileUpload(event: any): void {
    const file = event.target.files[0];
    const data = new FormData();
    data.append('files', file || '');

    this.cirservice.fileUpload(data).subscribe((response) => {
      if (response?.status) {
        this.file = response?.data;
        console.log(this.file);
        this.notificationService.showSuccess(response?.message || 'File successfully uploaded.')
      } else {
        this.notificationService.showError(response?.message || 'File not uploaded.')
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'File not uploaded.')
    })
  }

  submit() {
    const localData: any = localStorage.getItem('rmsPersonalDetails');

    if (!this.file) {
      return this.notificationService.showError('Please upload file');
    }

    if (!localData || localData == undefined || localData == 'undefined') {
      return this.submitotherDetail();
    }

    console.log("localDatalocalDatalocalDatalocalData", localData);
    console.log("this.otherDetailForm.value", this.otherDetailForm.value, String(localStorage.getItem('referCode')) || null,);

    this.cirservice.register(JSON.parse(localData)).subscribe((response) => {
      if (response?.status) {
        console.log('response?.data', response?.data);
        this.localStorageService.setLogger(response?.data);
        setTimeout(() => {
          localStorage.removeItem('rmsPersonalDetails');
          this.submitotherDetail();
        }, 300);
      } else {
        this.notificationService.showError(response?.message || 'Fill all the fields of register page to proceed to next Page');
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Fill all the fields of register page to proceed to next Page');
    });
  }

  submitotherDetail() {
    if (!this.file) {
      return this.notificationService.showError('Please upload file');
    }

    // Extract values from ng-select reactive controls (arrays of primitive values)
    const selectedDays = this.otherDetailForm.get('callDay')?.value || [];
    const selectedTimes = this.otherDetailForm.get('callTime')?.value || [];
    const selectedRoles = this.otherDetailForm.get('preferredRoles')?.value || [];

    const cvObject = {
      key: this.file?.key,
      url: this.file?.url,
      name: this.file?.name
    };

    const formData = {
      ...this.otherDetailForm.value,
      callDay: selectedDays,
      callTime: selectedTimes,
      preferredRoles: selectedRoles,
      cv: cvObject,
      referredBy: String(localStorage.getItem('referCode')) || null,
    };

    console.log('Form data being sent:', formData);

    this.userdata = this.localStorageService.getLogger();
    this.userID = this.userdata?.user?._id;
    this.otherDetailForm.controls['cv'].patchValue(cvObject);
    this.cirservice.updateregister(this.userID, formData).subscribe(
      (response) => {
        if (response?.status == true) {
          this.router.navigate(['/cir/cir-thankyou']);
          this.notificationService.showSuccess(response?.message, 'Success !');
          localStorage.removeItem('rmsRolesDetails');
        } else {
          this.notificationService.showError(response?.message, 'Select different Username!');
        }
        localStorage.removeItem('referCode');
      },
      (error) => {
        this.notificationService.showError(error?.error?.message, 'Select different Username!');
      }
    );
  }

  onSCDVChange(event: any) {
    this.showValidUptoDate = event.target.value === 'yes';
  }

  getBanerDetails(): void {
    this.cirservice.getBanerDetails('cir_user_registration').subscribe((response) => {
      if (response?.status) {
        this.bannerDetails = response?.data || null;
      } else {
        this.bannerDetails = null;
      }
    });
  }
}

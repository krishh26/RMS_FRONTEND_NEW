import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-send-job',
  templateUrl: './send-job.component.html',
  styleUrls: ['./send-job.component.scss']
})
export class SendJobComponent implements OnInit {
  sendJobForm: FormGroup;
  selectedJob: any = {
    id: 1,
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'New York'
  };

  candidates = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' }
  ];

  constructor(private fb: FormBuilder) {
    this.sendJobForm = this.fb.group({
      selectedCandidates: [[], [Validators.required]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      includeJobDescription: [true]
    });
  }

  ngOnInit(): void {
    // Pre-fill the subject and message
    this.sendJobForm.patchValue({
      subject: `Job Opportunity: ${this.selectedJob.title} at Our Company`,
      message: `Dear [Candidate Name],

We have an exciting job opportunity that matches your profile. We would like to invite you to apply for the position of ${this.selectedJob.title} in our ${this.selectedJob.department} department.

Please review the job details and submit your application if you're interested.

Best regards,
[Your Name]`
    });
  }

  onSubmit(): void {
    if (this.sendJobForm.valid) {
      console.log('Form submitted:', this.sendJobForm.value);
      // Here you would typically send the job invitations
    }
  }

  onSelectAll(): void {
    const allCandidateIds = this.candidates.map(c => c.id);
    this.sendJobForm.patchValue({
      selectedCandidates: allCandidateIds
    });
  }

  onClearAll(): void {
    this.sendJobForm.patchValue({
      selectedCandidates: []
    });
  }

  onCandidateSelect(candidateId: number, checked: boolean): void {
    const currentSelection = this.sendJobForm.get('selectedCandidates')?.value || [];
    if (checked) {
      currentSelection.push(candidateId);
    } else {
      const index = currentSelection.indexOf(candidateId);
      if (index > -1) {
        currentSelection.splice(index, 1);
      }
    }
    this.sendJobForm.patchValue({ selectedCandidates: currentSelection });
  }
}

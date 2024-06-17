import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-add-trip', // Changed to standard single quotes
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css'] // Corrected to styleUrls
})
export class AddTripComponent implements OnInit {
  addForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) {
  }

  ngOnInit(): void { // Added void return type
    this.addForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required], // Fixed quotes
      name: ['', Validators.required], // Fixed quotes
      length: ['', Validators.required], // Fixed quotes
      start: ['', Validators.required], // Fixed quotes
      resort: ['', Validators.required], // Fixed quotes
      perPerson: ['', Validators.required], // Fixed quotes
      image: ['', Validators.required], // Fixed quotes
      description: ['', Validators.required], // Fixed quotes
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.addForm.valid) {
      this.tripService.addTrip(this.addForm.value)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.log('Error: ' + error);
          }
        });
    }
  }

  // Get the form short name to access the form fields
  get f() { return this.addForm.controls; }
}
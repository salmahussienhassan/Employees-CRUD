import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseEmployee, Employee } from '../../core/model/employee';
import { EmployeeService } from '../../core/service/employee.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-edit-employee',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-edit-employee.component.html',
  styleUrl: './add-edit-employee.component.css'
})
export class AddEditEmployeeComponent {
// I used a single EmployeeAddEditComponent to avoid code duplication since Add and Edit use nearly the same form and validation. 
// This makes the code cleaner and easier to maintain, and both modes are handled dynamically based on modal parameters. 
  addEmployeeForm!: FormGroup;
  employee?: Employee;
  isSaveBtnDisabled!:boolean
  editMode!:boolean
  get empName() { return this.addEmployeeForm.get('empName')!; }
  get empEmail() { return this.addEmployeeForm.get('empEmail')!; }
  get empPhone() { return this.addEmployeeForm.get('empPhone')!; }
  get empAddress() { return this.addEmployeeForm.get('empAddress')!; }

  constructor(private fb: FormBuilder, private employeeService: EmployeeService, private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.addEmployeeForm = this.fb.group({
      empName: ['', Validators.required],
      empEmail: ['', [Validators.required, Validators.email]],
      empPhone: ['', [Validators.required, Validators.pattern(/^(010|011|012)\d{8}$/)]],
      empAddress: ['', Validators.required]
    });
    if (this.employee) {
      this.editMode=true
      this.addEmployeeForm.patchValue(this.employee);
    }
  }
  AddEmployee() {
    this.isSaveBtnDisabled=true
    if (this.addEmployeeForm.invalid) {
      this.addEmployeeForm.markAllAsTouched(); 
      return;
    }
    if (this.addEmployeeForm.valid) {   
       this.employeeService.createEmployee(this.addEmployeeForm?.value as BaseEmployee).subscribe({
        next:()=>{
          this.isSaveBtnDisabled=false
          this.closeModal(true);
        }
       })
    }
  }
  EditEmployee(){
    this.isSaveBtnDisabled=true
    if (this.addEmployeeForm.invalid) {
      this.addEmployeeForm.markAllAsTouched(); 
      return;
    }
    if (this.employee) {
      const updatedEmployee: Employee = {
        empId: this.employee.empId, 
        ...this.addEmployeeForm.value as BaseEmployee
      }

       this.employeeService.updateEmployee(updatedEmployee).subscribe({
        next:()=>{
          this.isSaveBtnDisabled=false
          this.closeModal(true);
        }
       })
    }
  }
  closeModal(refresh: boolean = false) {
    this.activeModal.close(refresh ? 'refresh' : undefined);
  }
  
}

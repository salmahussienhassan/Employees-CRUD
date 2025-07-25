import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Employee } from '../../core/model/employee';
import { EmployeeService } from '../../core/service/employee.service';
import { AddEditEmployeeComponent } from '../add-edit-employee/add-edit-employee.component';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employee-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-index.component.html',
  styleUrl: './employee-index.component.css'
})
export class EmployeeIndexComponent {
  employees: Employee[] = [];
  pagedEmployees: Employee[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  isLoading = false;
  selectedEmployeeIds: number[] = [];
  allSelected: boolean = false;
  employeeToDeleteId?: number;
  @ViewChild('confirmModal') confirmModal!: TemplateRef<any>;

  constructor(private employeeService: EmployeeService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.totalPages = Math.ceil(this.employees.length / this.pageSize);
        this.setPage(1);
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      },
      complete: () => {
        this.isLoading = false;
  }})
  }

  setPage(page: number) {
    this.currentPage = page;

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
  
    let pageSlice = this.employees.slice(start, end);
  
    // to keep sort for the new page if a sort is active
    if (this.sortColumn) {
      pageSlice = [...pageSlice].sort((a, b) => {
        const valA = a[this.sortColumn as keyof Employee]?.toString().toLowerCase() || '';
        const valB = b[this.sortColumn as keyof Employee]?.toString()|| '';
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }
  
    this.pagedEmployees = pageSlice;
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.getAllEmployees();
      });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.setPage(this.currentPage + 1);
  }

  prevPage() {
    if (this.currentPage > 1) this.setPage(this.currentPage - 1);
  }


sortData(column: 'empName' | 'empAddress') {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  this.sortColumn = column;

  const sorted = [...this.pagedEmployees].sort((a, b) => {
    const valA = a[column].toLowerCase();
    const valB = b[column].toLowerCase();
    return this.sortDirection === 'asc'
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  this.pagedEmployees = sorted;
}

toggleAll(event: any) {
  this.allSelected = event.target.checked;
  if (this.allSelected) {
    this.selectedEmployeeIds = this.pagedEmployees.map(emp => emp.empId);
  } else {
    this.selectedEmployeeIds = [];
  }
}

toggleSingle(id: number, event: any) {
  const checked = event.target.checked;
  if (checked) {
    this.selectedEmployeeIds.push(id);
  } else {
    this.selectedEmployeeIds = this.selectedEmployeeIds.filter(empId => empId !== id);
    this.allSelected = false;
  }

  if (this.selectedEmployeeIds.length === this.pagedEmployees.length) {
    this.allSelected = true;
  }
}

openAddEditEmployeeModal(emp?: Employee){
  const modalRef = this.modalService.open(AddEditEmployeeComponent,{windowClass:'sm', backdrop:'static'});
  if (emp) {
    modalRef.componentInstance.employee = emp;
  }
  modalRef.result.then(
    (result) => {
      if (result === 'refresh') {
        this.getAllEmployees();
      }
    }
  );
}

openDeleteConfirmModal(id: number) {
  this.employeeToDeleteId = id;
  this.modalService.open(this.confirmModal, { centered: true, backdrop: 'static' });
}

confirmDelete() {
  if (!this.employeeToDeleteId) return;

  this.employeeService.deleteEmployee(this.employeeToDeleteId).subscribe(() => {
    this.getAllEmployees();
    this.modalService.dismissAll();
  });
}

cancelDelete() {
  this.employeeToDeleteId = undefined;
  this.modalService.dismissAll();
}
}

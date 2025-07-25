import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseEmployee, Employee } from '../model/employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://task.soft-zone.net/api/Employees'; 

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/getAllEmployees`);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/getEmpByID/${id}`);
  }

  createEmployee(employee: BaseEmployee): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/addEmployee`, employee);
  }

  updateEmployee(employee: Employee): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/editEmployee`, employee);
  }

  deleteEmployee(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/deleteEmpByID/${id}`);
  }
}

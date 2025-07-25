import { Routes } from '@angular/router';
import { EmployeeIndexComponent } from './feature/employee-index/employee-index.component';

export const routes: Routes = [   
    { path: '', redirectTo: 'employee', pathMatch: 'full' },
    { path: 'employee', component: EmployeeIndexComponent },];

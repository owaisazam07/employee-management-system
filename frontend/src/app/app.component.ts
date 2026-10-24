import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Employee, EmployeePayload } from './employee.model';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  employees: Employee[] = [];
  search = '';
  loading = false;
  saving = false;
  message = '';
  error = '';
  editingId: number | null = null;
  form: EmployeePayload = this.emptyForm();

  ngOnInit(): void { this.loadEmployees(); }

  emptyForm(): EmployeePayload {
    return { firstName: '', lastName: '', email: '', department: '', salary: 0 };
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAll(this.search).subscribe({
      next: (data) => { this.employees = data; this.loading = false; },
      error: (err: HttpErrorResponse) => { this.error = this.errorMessage(err); this.loading = false; }
    });
  }

  searchEmployees(): void { this.loadEmployees(); }

  submit(formDirective: NgForm): void {
    if (formDirective.invalid) {
      formDirective.control.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.message = '';
    this.error = '';
    const request = this.editingId === null
      ? this.employeeService.create(this.form)
      : this.employeeService.update(this.editingId, this.form);

    request.subscribe({
      next: () => {
        this.message = this.editingId === null ? 'Employee added successfully.' : 'Employee updated successfully.';
        this.resetForm(formDirective);
        this.loadEmployees();
        this.saving = false;
      },
      error: (err: HttpErrorResponse) => { this.error = this.errorMessage(err); this.saving = false; }
    });
  }

  edit(employee: Employee): void {
    this.editingId = employee.id ?? null;
    this.form = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      salary: employee.salary
    };
    this.message = '';
    this.error = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteEmployee(employee: Employee): void {
    if (employee.id == null || !confirm(`Delete ${employee.firstName} ${employee.lastName}?`)) return;
    this.employeeService.delete(employee.id).subscribe({
      next: () => { this.message = 'Employee deleted successfully.'; this.loadEmployees(); },
      error: (err: HttpErrorResponse) => { this.error = this.errorMessage(err); }
    });
  }

  resetForm(formDirective?: NgForm): void {
    this.editingId = null;
    this.form = this.emptyForm();
    formDirective?.resetForm(this.form);
  }

  private errorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Cannot connect to the backend. Check that Spring Boot is running on port 8082.';
    if (err.status === 409) return err.error?.message ?? 'This email is already registered.';
    if (err.status === 400 && err.error && typeof err.error === 'object') {
      return Object.values(err.error).join(' ');
    }
    return err.error?.message ?? 'Something went wrong. Please try again.';
  }
}

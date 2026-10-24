package com.employee.management.service;

import com.employee.management.dto.EmployeeRequest;
import com.employee.management.dto.EmployeeResponse;
import com.employee.management.entity.Employee;
import com.employee.management.exception.ResourceNotFoundException;
import com.employee.management.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmployeeService {
    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAll(String search) {
        List<Employee> employees;
        if (search == null || search.isBlank()) {
            employees = repository.findAll();
        } else {
            String q = search.trim();
            employees = repository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
                    q, q, q, q);
        }
        return employees.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public EmployeeResponse create(EmployeeRequest request) {
        Employee employee = new Employee();
        copyRequestToEntity(request, employee);
        return toResponse(repository.save(employee));
    }

    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = findEntity(id);
        copyRequestToEntity(request, employee);
        return toResponse(repository.save(employee));
    }

    public void delete(Long id) {
        repository.delete(findEntity(id));
    }

    private Employee findEntity(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
    }

    private void copyRequestToEntity(EmployeeRequest request, Employee employee) {
        employee.setFirstName(request.getFirstName().trim());
        employee.setLastName(request.getLastName().trim());
        employee.setEmail(request.getEmail().trim());
        employee.setDepartment(request.getDepartment().trim());
        employee.setSalary(request.getSalary());
    }

    private EmployeeResponse toResponse(Employee employee) {
        return new EmployeeResponse(
            employee.getId(),
            employee.getFirstName(),
            employee.getLastName(),
            employee.getEmail(),
            employee.getDepartment(),
            employee.getSalary()
        );
    }
}

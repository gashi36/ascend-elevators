import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { take, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  CreateUserGQL,
  UpdateUserGQL,
  DeleteUserGQL,
  UserRole,
  GetAllUsersGQL,
  GetAllUsersQuery,
  GetUserByIdGQL,
  UpdateUserInput,
} from '../../../../graphql/generated/graphql';
import { CommonModule, NgIf } from '@angular/common';

type UsersConnection = NonNullable<GetAllUsersQuery['users']>;
type UserNode = NonNullable<UsersConnection['nodes']>[0];

@Component({
  selector: 'app-users-superadmin',
  templateUrl: './users-superadmin.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  styleUrls: ['./users-superadmin.component.scss']
})
export class UsersSuperadminComponent implements OnInit {

  createUserForm: FormGroup;
  editUserForm: FormGroup;
  searchControl = new FormControl('');
  isLoading = false;
  isLoadingUsers = false;
  statusMessage: string | null = null;
  statusType: 'success' | 'error' | 'info' = 'info';
  UserRole = UserRole;
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showSuccessAnimation = false;
  selectedUser: UserNode | null = null;

  users: UserNode[] = [];
  pageSize = 20;
  currentSearchTerm = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private createUserGQL: CreateUserGQL,
    private updateUserGQL: UpdateUserGQL,
    private deleteUserGQL: DeleteUserGQL,
    private getUsersGQL: GetAllUsersGQL,
    private userByIdGQL: GetUserByIdGQL
  ) {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: [UserRole.Admin, Validators.required]
    });

    this.editUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      role: [UserRole.Admin, Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();

    // Set up search subscription with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.currentSearchTerm = searchTerm || '';
        this.loadUsers(this.currentSearchTerm);
      });
  }

  loadUsers(searchTerm: string = '') {
    this.isLoadingUsers = true;
    this.getUsersGQL.fetch({
      variables: {
        first: this.pageSize,
        firstName: searchTerm
      }
    })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isLoadingUsers = false;
          const usersConnection = result.data?.users;
          this.users = usersConnection?.nodes?.filter((u): u is UserNode => u !== null) || [];
        },
        error: (error) => {
          this.isLoadingUsers = false;
          this.showStatusMessage('Failed to load users.', 'error');
          console.error('Error loading users:', error);
        }
      });
  }

  showStatusMessage(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.statusMessage = message;
    this.statusType = type;

    if (type === 'success') {
      setTimeout(() => {
        if (this.statusMessage === message) {
          this.statusMessage = null;
        }
      }, 5000);
    } else if (type === 'error') {
      setTimeout(() => {
        if (this.statusMessage === message) {
          this.statusMessage = null;
        }
      }, 10000);
    }
  }

  openCreateUserModal() {
    this.showCreateModal = true;
    this.statusMessage = null;
  }

  closeCreateUserModal() {
    this.showCreateModal = false;
    this.showSuccessAnimation = false;
    this.createUserForm.reset({ role: UserRole.Admin });
  }

  openEditUserModal(user: UserNode) {
    this.selectedUser = user;
    this.editUserForm.patchValue({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
    this.showEditModal = true;
    this.statusMessage = null;
  }

  closeEditUserModal() {
    this.showEditModal = false;
    this.selectedUser = null;
    this.editUserForm.reset({ role: UserRole.Admin });
  }

  openDeleteUserModal(user: UserNode) {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeDeleteUserModal() {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  viewUserDetails(user: UserNode) {
    this.router.navigate(['/superadmin-panel/users', user.id]);
  }

  handleCreateUser() {
    if (this.createUserForm.invalid) {
      this.showStatusMessage('Please fill all required fields correctly.', 'error');
      return;
    }

    this.isLoading = true;
    this.showStatusMessage('Creating user...', 'info');

    this.createUserGQL.mutate({
      variables: {
        input: this.createUserForm.value
      }
    })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isLoading = false;

          const createUserResponse = result.data?.createUser;

          if (createUserResponse?.token || createUserResponse?.user?.id) {
            this.showSuccessAnimation = true;
            this.showStatusMessage('User created successfully!', 'success');

            setTimeout(() => {
              this.showSuccessAnimation = false;
              this.closeCreateUserModal();
              this.loadUsers(this.currentSearchTerm);
            }, 1500);
          } else {
            this.showStatusMessage('Failed to create user.', 'error');
          }
        },
        error: (err) => {
          this.isLoading = false;
          const errorMessage = this.extractErrorMessage(err);
          this.showStatusMessage(`Error creating user: ${errorMessage}`, 'error');
          console.error('Error creating user:', err);
        }
      });
  }

  handleUpdateUser() {
    if (this.editUserForm.invalid || !this.selectedUser) {
      this.showStatusMessage('Please fill all required fields correctly.', 'error');
      return;
    }

    this.isLoading = true;
    this.showStatusMessage('Updating user...', 'info');

    const updateInput: UpdateUserInput = {
      id: this.selectedUser.id,
      email: this.editUserForm.value.email,
      firstName: this.editUserForm.value.firstName,
      lastName: this.editUserForm.value.lastName,
      role: this.editUserForm.value.role
    };

    this.updateUserGQL.mutate({
      variables: {
        input: updateInput
      }
    })
      .pipe(take(1))
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;

          const updateUserResponse = result.data?.updateUser;

          if (updateUserResponse?.token || updateUserResponse?.user?.id) {
            this.showStatusMessage('User updated successfully!', 'success');
            this.closeEditUserModal();
            this.loadUsers(this.currentSearchTerm);
          } else {
            this.showStatusMessage('Failed to update user.', 'error');
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          const errorMessage = this.extractErrorMessage(err);
          this.showStatusMessage(`Error updating user: ${errorMessage}`, 'error');
          console.error('Error updating user:', err);
        }
      });
  }

  handleDeleteUser() {
    if (!this.selectedUser) return;

    this.isLoading = true;
    this.showStatusMessage('Deleting user...', 'info');

    this.deleteUserGQL.mutate({
      variables: {
        id: this.selectedUser.id
      }
    })
      .pipe(take(1))
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;

          const deleteUserResponse = result.data?.deleteUser;

          if (deleteUserResponse?.success) {
            this.showStatusMessage('User deleted successfully!', 'success');
            this.closeDeleteUserModal();
            this.loadUsers(this.currentSearchTerm);
          } else {
            this.showStatusMessage('Failed to delete user.', 'error');
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          const errorMessage = this.extractErrorMessage(err);
          this.showStatusMessage(`Error deleting user: ${errorMessage}`, 'error');
          console.error('Error deleting user:', err);
        }
      });
  }

  private extractErrorMessage(error: any): string {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message || 'Unknown GraphQL error';
    }
    if (error.networkError) {
      return 'Network error. Please check your connection.';
    }
    if (error.message) {
      return error.message;
    }
    return 'Unknown error occurred';
  }
}

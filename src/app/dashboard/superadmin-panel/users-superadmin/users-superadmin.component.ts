import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { take, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  CreateUserGQL,
  UserRole,
  GetAllUsersGQL,
  GetAllUsersQuery
} from '../../../../graphql/generated/graphql';
import { CommonModule, NgIf } from '@angular/common';

type UsersConnection = NonNullable<GetAllUsersQuery['users']>;
type UserNode = NonNullable<UsersConnection['nodes']>[0];

@Component({
  selector: 'app-users-superadmin',
  templateUrl: './users-superadmin.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  styleUrls: ['./users-superadmin.component.css']
})
export class UsersSuperadminComponent implements OnInit {

  createUserForm: FormGroup;
  searchControl = new FormControl('');
  isLoading = false;
  statusMessage: string | null = null;
  UserRole = UserRole;
  showCreateModal = false;

  users: UserNode[] = [];
  pageSize = 20;

  constructor(
    private fb: FormBuilder,
    private createUserGQL: CreateUserGQL,
    private getUsersGQL: GetAllUsersGQL
  ) {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: [UserRole.Admin, Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();

    this.setupSearchSubscription();

    // finally, a proper debounce instead of duct-tape hacks
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.loadUsers(value || "");
      });
  }
  setupSearchSubscription() {
    this.searchControl.valueChanges
      .pipe(
        // Wait 300ms after the user stops typing
        debounceTime(300),
        // Only trigger search if the new value is different from the last
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        // Pass the new search term to your primary loading function
        // Reset the cursor to start the search from page 1
        this.loadUsers(searchTerm || '');
      });
  }
  loadUsers(searchTerm: string = "") {
    const trimmedSearch = searchTerm.trim();

    this.getUsersGQL.fetch({
      variables: {
        first: this.pageSize
      }
    })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          const usersConnection = result.data?.users;
          this.users = usersConnection?.nodes?.filter((u): u is UserNode => u !== null) || [];
        },
        error: (error) => {
          this.statusMessage = 'Failed to load users.';
          console.error('Error loading users:', error);
        }
      });
  }

  openCreateUserModal() {
    this.showCreateModal = true;
    this.statusMessage = null;
  }

  closeCreateUserModal() {
    this.showCreateModal = false;
    this.createUserForm.reset({ role: UserRole.Admin });
  }

  handleCreateUser() {
    if (this.createUserForm.invalid) {
      this.statusMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.statusMessage = null;

    this.createUserGQL.mutate({ variables: { input: this.createUserForm.value } })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isLoading = false;

          const token = result.data?.createUser.token;
          if (token) {
            this.statusMessage = 'Admin created successfully!';
            this.closeCreateUserModal();
            this.loadUsers();
          } else {
            this.statusMessage = 'Failed to create admin.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.statusMessage = 'Error creating admin.';
          console.error(err);
        }
      });
  }
}

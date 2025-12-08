// users-details-superadmin.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { GetUserByIdGQL } from '../../../../graphql/generated/graphql';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-users-details-superadmin',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './users-details-superadmin.component.html',
  styleUrls: ['./users-details-superadmin.component.css']
})
export class UsersDetailsSuperadminComponent implements OnInit {
  userId: string | null = null;
  user: any = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userByIdGQL: GetUserByIdGQL,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.loadUserDetails();
    } else {
      this.error = 'No user ID provided';
      this.isLoading = false;
    }
  }

  loadUserDetails() {
    this.isLoading = true;
    this.userByIdGQL.fetch({
      variables: { id: this.userId! }
    })
      .pipe(take(1))
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;
          this.user = result.data?.userById;

          if (!this.user) {
            this.error = 'User not found';
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          this.error = 'Failed to load user details';
          console.error('Error loading user:', err);
        }
      });
  }

  goBack() {
    this.router.navigate(['/superadmin-panel/users']);
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'medium') || '';
  }

  formatShortDate(date: string): string {
    return this.datePipe.transform(date, 'shortDate') || '';
  }
}

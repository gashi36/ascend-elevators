import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { BlogService } from '../blog.service';
import { BlogPost } from '../blog-data';

@Component({
    selector: 'app-blog-list',
  imports: [RouterModule],
    standalone: true,
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {

  posts: BlogPost[] = [];
  categories: string[] = [];
  tags: string[] = [];
  activeFilter: string = 'Të Gjitha';
  noResultsMessage: string | null = null; // NEW: Message when filter returns 0 posts

  // Inject ChangeDetectorRef
  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  ngOnInit() {
    // 1. Load static data for filter buttons
    this.categories = ['Të Gjitha', ...this.blogService.getCategories()];
    this.tags = this.blogService.getTags();

    // 2. CRITICAL FIX: Subscribe to query parameters to handle filtering.
    this.route.queryParamMap.subscribe(params => {
      const filterType = params.get('type');
      const filterValue = params.get('value');

      // DEBUG: Log the filter values being received from the URL
      console.log('Applying filter from URL:', { type: filterType, value: filterValue });

      if (!filterType || !filterValue || filterValue === 'Të Gjitha') {
        // If no filter or 'Të Gjitha' is selected, show all posts
        this.applyFilter('Të Gjitha', 'all');
      } else {
        // Apply the filter received from the URL (from the Detail Page sidebar click)
        this.applyFilter(filterValue, filterType as 'category' | 'tag');
      }

      // FORCED DOM UPDATE: Manually trigger change detection to ensure the view updates
      // after the posts array is modified by applyFilter().
      this.cdr.detectChanges();
    });
  }

  /**
   * Applies the filter based on category or tag and updates the posts array.
   */
  applyFilter(filterValue: string, filterType: 'category' | 'tag' | 'all') {
    this.activeFilter = filterValue;
    this.noResultsMessage = null; // Reset message when applying a new filter

    if (filterType === 'all') {
      this.posts = this.blogService.getAllPostsSortedByDate();
    } else if (filterType === 'category') {
      this.posts = this.blogService.getPostsByCategory(filterValue);
    } else if (filterType === 'tag') {
      this.posts = this.blogService.getPostsByTag(filterValue);
    }

    // Check if the filter returned no posts
    if (this.posts.length === 0 && filterType !== 'all') {
      this.noResultsMessage = `Nuk u gjetën postime për filtrin '${filterValue}'.`;
    }

    // DEBUG: Log how many posts were found after filtering
    console.log(`Filter applied: ${filterValue} (${filterType}). Found ${this.posts.length} posts.`);
  }

  /**
   * Used by the filter buttons on the Blog List page itself.
   * Clears existing filters and navigates with the new one.
   */
  navigateAndApplyFilter(filterValue: string, filterType: 'category' | 'tag' | 'all') {
    if (filterType === 'all') {
      // Navigate to /blog with no query parameters
      this.router.navigate(['/blog']);
    } else {
      // Navigate to /blog with new query parameters
      this.router.navigate(['/blog'], {
        queryParams: { type: filterType, value: filterValue }
      });
    }
  }
}

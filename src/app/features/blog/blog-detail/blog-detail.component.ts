import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogService } from '../blog.service';
import { BlogPost } from '../blog-data';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs'; // Needed for switchMap fallback

@Component({
    selector: 'app-blog-detail',
    templateUrl: './blog-detail.component.html',
    standalone: true,
  imports: [RouterModule, CommonModule],
    styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {

  post?: BlogPost;
  relatedPosts: BlogPost[] = [];
  categories: string[] = [];
  tags: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit() {
    // 1. Load static sidebar data once
    this.categories = this.blogService.getCategories();
    this.tags = this.blogService.getTags();

    // 2. Subscribe to route parameters to handle component reuse
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadPostData(slug);
      }
    });
  }

  /**
   * Loads the current post and related posts based on the slug.
   * This logic is now outside ngOnInit and is called every time the slug changes.
   */
  loadPostData(slug: string): void {
    // Fetch the main post
    this.post = this.blogService.getPostBySlug(slug);

    if (this.post) {
      // 1. Get related posts based on the category of the current post
      this.relatedPosts = this.blogService.getRelatedPosts(slug, this.post.category);
    } else {
      // Reset if the slug is invalid
      this.post = undefined;
      this.relatedPosts = [];
    }

    // 2. Fallback: If not enough related posts are found, fill with the latest posts
    if (this.relatedPosts.length < 2) {
      this.relatedPosts = this.blogService.getLatestPostsExcluding(slug, 2);
    }
  }

  /**
   * Navigates the user to the main blog list page and passes filter parameters.
   * This part remains unchanged and works correctly.
   */
  navigateToBlogWithFilter(filterType: 'category' | 'tag', filterValue: string): void {
    this.router.navigate(['/blog'], {
      queryParams: {
        type: filterType,
        value: filterValue
      },
      replaceUrl: true
    });
  }
}

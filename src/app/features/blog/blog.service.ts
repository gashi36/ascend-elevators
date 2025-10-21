// blog.service.ts

import { Injectable } from '@angular/core';
// Ensure all necessary structures are imported from your data file
import { BlogPost, BLOG_POSTS, CATEGORIES, TAGS } from './blog-data';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor() { }

  // --- 1. CORE UTILITY METHODS (Sorting) ---

  /**
   * Returns all blog posts, sorted by date (newest first).
   */
  getAllPostsSortedByDate(): BlogPost[] {
    // Return a sorted copy of the main data array
    return [...BLOG_POSTS].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  // --- 2. SINGLE POST ACCESS ---

  /**
   * Finds a single post by its unique slug for the detail view.
   */
  getPostBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find(post => post.slug === slug);
  }

  // --- 3. FILTERING METHODS (Used by the Blog List Component) ---

  /**
   * Returns posts filtered by a specific category, sorted by date.
   */
  getPostsByCategory(category: string): BlogPost[] {
    const sortedPosts = this.getAllPostsSortedByDate();
    return sortedPosts.filter(post => post.category === category);
  }

  /**
   * NEW METHOD: Returns posts that contain a specific tag, sorted by date.
   * This is essential for filtering when a tag is clicked on the sidebar.
   */
  getPostsByTag(tag: string): BlogPost[] {
    const sortedPosts = this.getAllPostsSortedByDate();
    return sortedPosts.filter(post => {
      // Check if the post has a 'tags' array AND if that array includes the filter tag
      return post.tags && post.tags.includes(tag);
    });
  }

  // --- 4. SIDEBAR DATA METHODS ---

  /**
   * Returns the master list of all available blog categories.
   */
  getCategories(): string[] {
    return CATEGORIES;
  }

  /**
   * Returns the master list of all available tags.
   */
  getTags(): string[] {
    return TAGS;
  }

  // --- 5. RELATED POSTS / LATEST POSTS METHODS (Used by the Detail Component) ---

  /**
   * Gets a limited number of related posts, excluding the current one and prioritizing by category.
   */
  getRelatedPosts(currentSlug: string, category: string | undefined): BlogPost[] {
    let related = this.getAllPostsSortedByDate();

    // 1. Exclude the current post
    related = related.filter(post => post.slug !== currentSlug);

    // 2. Apply category filtering for relevance
    if (category) {
      related = related.filter(post => post.category === category);
    }

    // 3. Limit to the desired amount (e.g., 3)
    return related.slice(0, 3);
  }

  /**
   * Gets the 'latest' posts (newest) up to a specified count.
   */
  getLatestPosts(count: number): BlogPost[] {
    return this.getAllPostsSortedByDate().slice(0, count);
  }

  /**
   * Gets the 'latest' posts, explicitly excluding one by its slug. Used as a fallback for related posts.
   */
  getLatestPostsExcluding(currentSlug: string | null, count: number): BlogPost[] {
    const sortedPosts = this.getAllPostsSortedByDate();
    let posts = sortedPosts.filter(post => post.slug !== currentSlug);
    return posts.slice(0, count);
  }
}

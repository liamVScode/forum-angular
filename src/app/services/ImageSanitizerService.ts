import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ImageSanitizerService {
  constructor(private sanitizer: DomSanitizer) {}

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(imageUrl)) || '';
  }
}

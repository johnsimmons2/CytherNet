import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map, Observable, tap } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { Capacitor } from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  constructor(private apiService: ApiService) {
  }

  public get isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  public get isDesktop(): boolean {
    return !this.isMobile;
  }

  public get platform(): string {
    return Capacitor.getPlatform();
  }

  public get operatingSystem(): string {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/Windows NT/i.test(userAgent)) {
      return 'Windows';
    } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
      return 'macOS';
    } else if (/Linux/i.test(userAgent)) {
      return 'Linux';
    } else if (/Android/i.test(userAgent)) {
      return 'Android';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      return 'iOS';
    } else if (/webOS/i.test(userAgent)) {
      return 'webOS';
    } else if (/BlackBerry/i.test(userAgent)) {
      return 'BlackBerry';
    } else if (/IEMobile/i.test(userAgent)) {
      return 'Windows Phone';
    } else if (/Opera Mini/i.test(userAgent)) {
      return 'Opera Mini';
    } else {
      return 'Unknown';
    }
  }

  public get browser(): string {
    if (/Chrome/i.test(navigator.userAgent)) {
      return 'Chrome';
    } else if (/Firefox/i.test(navigator.userAgent)) {
      return 'Firefox';
    } else if (/Safari/i.test(navigator.userAgent)) {
      return 'Safari';
    } else if (/Opera/i.test(navigator.userAgent)) {
      return 'Opera';
    } else if (/MSIE/i.test(navigator.userAgent)) {
      return 'Internet Explorer';
    } else {
      return 'Unknown';
    }
  }

  public get browserVersion(): string {
    const userAgent = navigator.userAgent;
    const start = userAgent.indexOf(this.browser) + this.browser.length + 1;
    return userAgent.substring(start, userAgent.indexOf(' ', start));
  }

  public getIpAddress(): Observable<string> {
    return this.apiService.healthCheck().pipe(
      map((res: HttpResponse<any>) => {
        console.log(res);
        let result = res.headers.get('X-Client-Ip') || 'Unkown';
        console.log(result);
        return result;
      })
    );
  }
}

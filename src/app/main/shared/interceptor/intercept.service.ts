import { inject, Injectable } from '@angular/core';
import
{
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { tap, retry, catchError, finalize } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenStorageService } from '../service/token-storage.service';
import { GeneralService } from '../service/general.service';
@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor
{
  constructor(private tokenStorageService: TokenStorageService, private router: Router) { }

  totalRequests = 0;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
  {
    const generalService = inject(GeneralService);
    this.totalRequests++;
    generalService.setLoading(true);

    const authToken = this.tokenStorageService.getToken();
    const authReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next.handle(authReq).pipe(
      finalize(() =>
      {
        this.totalRequests--;
        if (this.totalRequests == 0)
        {
          generalService.setLoading(false);
        }
      }),
      catchError((error: HttpErrorResponse) =>
      {
        if (error.status === 401)
        {
          // handle the 401 error here, for example, redirect to login page
          this.tokenStorageService.deleteLoginData()
          this.router.navigate([ '' ])
        }
        return throwError(() => error);
      })
    );
  }
}

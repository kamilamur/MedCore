import { HttpInterceptorFn } from '@angular/common/http';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const publicUrls = [
    'http://127.0.0.1:8000/api/doctors/',
    'http://127.0.0.1:8000/api/queue/'
  ];
  const isPublic = publicUrls.some(url => req.url.startsWith(url));
  if (isPublic) {
    return next(req);
  }
  const token = localStorage.getItem('access');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};
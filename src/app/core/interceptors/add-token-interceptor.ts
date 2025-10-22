import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token: string | null = localStorage.getItem(environment.tokenKey);
  if(!token){
    return next(req);
  }
  const newReq = req.clone({
    setHeaders:{
      Authorization: `Bearer ${token}`
    }
  })
  return next(newReq);
};

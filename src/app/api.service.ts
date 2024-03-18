import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {

  }

  get(path: string, options?: APIOptions) {
    const url = environment.basePath + path;
    let httpParams = new HttpParams();
    if (options && options.select) {
      httpParams = httpParams.append('select', options.select);
    }
    if (options && options.sort) {
      httpParams = httpParams.append('sort', options.sort);
    }
    if (options && options.count) {
      httpParams = httpParams.append('count', options.count);
    }
    if (options && options.page) {
      httpParams = httpParams.append('page', options.page);
    }
    if (options && options.filter) {
      httpParams = httpParams.append('filter', JSON.stringify(options.filter));
    }
    if (options && options.unscape) {
      httpParams = httpParams.append('unscape', options.unscape);
    }
    return this.http.get(url, { params: httpParams, headers: { 'Content-Type': 'application/json' } });
  }

  post(path: string, data: any) {
    const url = environment.basePath + path;
    return this.http.post(url, data, { headers: { 'Content-Type': 'application/json' } });
  }

  put(path: string, data: any) {
    const url = environment.basePath + path;
    return this.http.put(url, data, { headers: { 'Content-Type': 'application/json' } });
  }

  delete(path: string) {
    const url = environment.basePath + path;
    return this.http.delete(url, { headers: { 'Content-Type': 'application/json' } });
  }

  uploadFile(path: string, formData: FormData) {
    const url = environment.basePath + path;
    let req = new HttpRequest('POST', url, formData, { reportProgress: true });
    return this.http.request(req);
  }

  getErrorMessage(err: any, defaultMessage?: string) {
    let message;
    if (!defaultMessage) {
      defaultMessage = 'Something Went Wrong';
    }
    if (typeof err == 'object') {
      if (err.body) {
        if (err.body.message) {
          message = err.body.message;
        } else {
          message = JSON.stringify(err.body);
        }
      } else if (err.message) {
        message = err.message;
      } else {
        message = JSON.stringify(err);
      }
    } else if (typeof err == 'string') {
      message = err;
    } else {
      message = defaultMessage;
    }
    return message;
  }
}

export class APIOptions {
  select!: string;
  sort!: string;
  count!: number;
  page!: number;
  filter!: any;
  unscape: boolean;
  constructor(data?: any) {
    if (data) {
      if (data.select) {
        this.select = data.select;
      }
      if (data.sort) {
        this.sort = data.sort;
      }
      if (data.count) {
        this.count = data.count;
      }
      if (data.page) {
        this.page = data.page;
      }
      if (data.filter) {
        this.filter = data.filter;
      }
    } else {
      this.select = '';
      this.sort = '';
      this.count = 30;
      this.page = 1;
      this.filter = {};
    }
    this.unscape = true;
  }
}

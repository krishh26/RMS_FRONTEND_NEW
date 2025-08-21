import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export enum CirEndPoint {
  LOGIN_USER = '/user/login',
  REGISTER = '/user/register',
  UPDATE_REGISTER = '/user/update/',
  SEND_DATA = '/card/create',
  FILE_UPLOAD = "/upload",
  FORGOT_PASSWORD = '/user/forgot',
  RESET_PASSWORD = '/user/reset',
  REFER_EARN = '/user/refer',
  ADD_CLIENT_ROLES = '/client/',
  GET_CLIENT_ROLES = '/client/',
  USER_CLIENT_UPDATE = '/user/update/',
  CREATE_CIR_JOB = '/acr/jobs/cir',
  FUTURE_CARD = '/futures/card/',
  PUBLIC_FUTURE_CARD = '/futures/card/public',
  JOB_ROLE = '/futures/card/',
  JOB_ROLE_LIST = '/futures/card/'
}

@Injectable({
  providedIn: 'root'
})
export class CirSericeService {

  baseUrl!: string;

  constructor(  
    private httpClient: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  getHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return headers;
  }

  loginUser(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + CirEndPoint.LOGIN_USER, payload, { headers: this.getHeader() });
  }

  register(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + CirEndPoint.REGISTER, payload);
  }

  updateregister(user_id: string, payload: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + CirEndPoint.UPDATE_REGISTER + user_id, payload, { headers: this.getHeader() });
  }

  sendResume(payload: any) {
    return this.httpClient
      .post<any>(this.baseUrl + CirEndPoint.SEND_DATA, payload);
  }

  Circreatejob(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + CirEndPoint.CREATE_CIR_JOB, payload);
  }

  fileUpload(payload: any) {
    return this.httpClient
      .post<any>(this.baseUrl + CirEndPoint.FILE_UPLOAD, payload);
  }

  forgotpassword(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + CirEndPoint.FORGOT_PASSWORD, payload);
  }

  resetpassword(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + CirEndPoint.RESET_PASSWORD, payload);
  }

  referAndEarn(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + CirEndPoint.REFER_EARN, payload);
  }

  addClientRoles(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + CirEndPoint.ADD_CLIENT_ROLES, payload);
  }

  updateUserClient(payload: any, id: string): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + CirEndPoint.USER_CLIENT_UPDATE + id, payload);
  }

  getClientRoles(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + CirEndPoint.GET_CLIENT_ROLES);
  }

  getFutureCard(params?: { page?: string | number, limit?: string | number, keyword?: string, status?: string, job_type?: string, active?: number }): Observable<any> {
    let queryParams = new HttpParams();
    if (params?.page) {
      queryParams = queryParams.set('page', params?.page);
    }
    if (params?.limit) {
      queryParams = queryParams.set('limit', params?.limit);
    }
    if (params?.keyword) {
      queryParams = queryParams.set('keyword', params?.keyword);
    }
    if (params?.job_type) {
      queryParams = queryParams.set('job_type', params?.job_type);
    }
    if (params?.active) {
      queryParams = queryParams.set('active', params?.active);
    }

    return this.httpClient
      .get<any>(this.baseUrl + CirEndPoint.FUTURE_CARD, { params: queryParams });
  }

  getPublicFutureCard(params?: { page?: string | number, limit?: string | number, keyword?: string, status?: string, job_type?: string, active?: number }): Observable<any> {
    let queryParams = new HttpParams();
    if (params?.page) {
      queryParams = queryParams.set('page', params?.page);
    }
    if (params?.limit) {
      queryParams = queryParams.set('limit', params?.limit);
    }
    if (params?.keyword) {
      queryParams = queryParams.set('keyword', params?.keyword);
    }
    if (params?.job_type) {
      queryParams = queryParams.set('job_type', params?.job_type);
    }
    if (params?.active) {
      queryParams = queryParams.set('active', params?.active);
    }

    return this.httpClient
      .get<any>(this.baseUrl + CirEndPoint.PUBLIC_FUTURE_CARD, { params: queryParams });
  }

  createFutureCard(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + CirEndPoint.FUTURE_CARD, payload);
  }

  deleteFutureCard(id: string): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseUrl + CirEndPoint.FUTURE_CARD + id);
  }

  updateFutureCardStatus(id: string, payload: any): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + CirEndPoint.FUTURE_CARD + id, payload);
  }

  createJobRole(payload: any, id: string): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + CirEndPoint.JOB_ROLE + id, payload);
  }

  getJobRoleList(params: any, id: any): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + CirEndPoint.JOB_ROLE_LIST + id, { params: params });
  }

}

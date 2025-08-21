import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export enum CirEndPoint {
  DATABASE_LOGIN = '/user/login/db',
  GET_MODEL = '/model/list',
  GET_ACR_USER = '/user/acr/list',
  GET_ACR_JOB = '/acr/jobs',
  GET_CIR_JOB_APPLICANT = '/acr/jobs/cir/',
  ACR_USER_WITH_APPLICANT = "/user/acr/user-with-applicant",
  ACR_SEND_MAIL = "/user/acr/send-mail",
  CIR_USER_WITH_APPLICANT = "/user/cir-user-with-applicant",
  CIR_SEND_MAIL = "/user/send-mail",
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

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
      .post<any>(this.baseUrl + CirEndPoint.DATABASE_LOGIN, payload, { headers: this.getHeader() });
  }

  getModelData(payload: any, filter: any): Observable<any> {
    const filteredData: any = Object.fromEntries(
      Object.entries({
        ...filter,
        modelName: payload?.modelName,
        page: payload?.page,
        limit: payload?.limit,
        type: payload?.type
      }).filter(
        ([key, value]) => value !== undefined && value !== ""
      )
    );

    const params = new URLSearchParams(filteredData);

    const apiUrl = `${this.baseUrl}${CirEndPoint.GET_MODEL}?${params.toString()}`;

    return this.httpClient.get<any>(apiUrl, { headers: this.getHeader() })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching model data:', error);
          return throwError(error);
        })
      );
  }

  ExportToExcel(json: any[], excelfileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelfileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  // getUserList(page:number): Observable<any> {
  //   return this.httpClient
  //     .get<any>(this.baseUrl + CirEndPoint.GET_ACR_USER+'?page='+page+'&limit=10',{ headers: this.getHeader() })
  //     .pipe(
  //       catchError((error: any) => {
  //         console.error('Error fetching model data:', error);
  //         return throwError(error);
  //       })
  //     );
  // }

  getUserList(payload: any, filter: any): Observable<any> {
    const filteredData: any = Object.fromEntries(
      Object.entries({
        ...filter,
        page: payload?.page,
        limit: payload?.limit,
        type: payload?.type,
        keyword: payload?.keyword
      }).filter(
        ([key, value]) => value !== undefined && value !== ""
      )
    );

    const params = new URLSearchParams(filteredData);

    const apiUrl = `${this.baseUrl}${CirEndPoint.GET_ACR_USER}?${params.toString()}`;

    return this.httpClient.get<any>(apiUrl, { headers: this.getHeader() })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching model data:', error);
          return throwError(error);
        })
      );
  }

  getJobList(payload: any, filter: any): Observable<any> {
    const filteredData: any = Object.fromEntries(
      Object.entries({
        ...filter,
        page: payload?.page,
        limit: payload?.limit,
        type: payload?.type,
        keyword: payload?.keyword
      }).filter(
        ([key, value]) => value !== undefined && value !== ""
      )
    );

    const params = new URLSearchParams(filteredData);

    const apiUrl = `${this.baseUrl}${CirEndPoint.GET_ACR_JOB}?${params.toString()}`;

    return this.httpClient.get<any>(apiUrl, { headers: this.getHeader() })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching model data:', error);
          return throwError(error);
        })
      );
  }

  getCIRJobApplicant(jobId: string): Observable<any> {
    const apiUrl = `${this.baseUrl}${CirEndPoint.GET_CIR_JOB_APPLICANT}${jobId}`;

    return this.httpClient.get<any>(apiUrl, { headers: this.getHeader() })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching model data:', error);
          return throwError(error);
        })
      );
  }

  getACRUserWithJobApplication(jobId: any): Observable<any> {
    const apiUrl = `${this.baseUrl}${CirEndPoint.ACR_USER_WITH_APPLICANT}`;

    return this.httpClient.post<any>(apiUrl, { job_id: jobId }, { headers: this.getHeader() })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching model data:', error);
          return throwError(error);
        })
      );
  }

  getCIRUserWithJobApplication(jobId: any): Observable<any> {
    const apiUrl = `${this.baseUrl}${CirEndPoint.CIR_USER_WITH_APPLICANT}`;

    return this.httpClient.post<any>(apiUrl, { job_id: jobId }, { headers: this.getHeader() })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching model data:', error);
          return throwError(error);
        })
      );
  }

  sendAcrJobPostMail(payload: any): Observable<any> {
    const apiUrl = `${this.baseUrl}${CirEndPoint.ACR_SEND_MAIL}`;

    return this.httpClient.post<any>(apiUrl, payload, { headers: this.getHeader() })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching model data:', error);
          return throwError(error);
        })
      );
  }

  sendCIRJobPostMail(payload: any): Observable<any> {
    const apiUrl = `${this.baseUrl}${CirEndPoint.CIR_SEND_MAIL}`;

    return this.httpClient.post<any>(apiUrl, payload, { headers: this.getHeader() })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching model data:', error);
          return throwError(error);
        })
      );
  }
}

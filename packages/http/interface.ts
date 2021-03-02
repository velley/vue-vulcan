export interface HttpIntercept {
  requestIntercept?: (request: RequestOptions) => Promise<RequestOptions>;
  responseIntercept?: (res: any) => Promise<any>;
}

export interface HttpResponse extends Response {  
  data: any;
}

export interface RequesterFunc {
  (input: RequestInfo, init?: RequestOptions): Promise<HttpResponse>
}

export interface RequestOptions<B = any> {
  baseUrl?: string;
  body?: B;
  data?: B;
  auto?: boolean;
  pluck?: string[];
  method?: 'GET' | 'POST' | 'PUT' | 'HEAD' | 'DELETE';
  headers?: any;
  tips?: {
    success?: string;
    failed?: string
  }
}

export type RequestStatus = 'ready' | 'pending' | 'failed' | 'success';
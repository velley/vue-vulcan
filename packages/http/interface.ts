export interface HttpIntercept {
  requestIntercept?: (request: RequestOptions) => Promise<RequestOptions>;
  responseIntercept?: (res: any) => Promise<any>;
}

export interface RequesterFunc {
  (input: RequestInfo, init?: RequestInit): Promise<Response>
}

export interface RequestOptions<B = any> {
  baseUrl?: string;
  body?: B;
  auto?: boolean;
  pluck?: string[];
  method?: 'GET' | 'POST' | 'PUT' | 'HEAD' | 'DELETE';
  headers?: any;
}

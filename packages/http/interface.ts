export interface HttpIntercept {
  requestIntercept?: (request: RequestOptions) => Promise<RequestOptions>;
  responseIntercept?: (res: any) => Promise<any>;
}

export interface RequesterFunc {
  (input: RequestInfo, init?: RequestInit): Promise<Response>
}

export interface RequestOptions extends RequestInit {
  baseUrl?: string;
  auto?: boolean;
  pluck?: string[];
  method?: 'GET' | 'POST' | 'PUT';
  body?: any;
}

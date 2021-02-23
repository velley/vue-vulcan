import { onMounted, Ref, UnwrapRef } from "vue";
import { pluckObj } from "../utils/pluckObj";
import { useState } from "../common/useState";
import { useInjector } from "../ioc/useInjector";
import { RequesterFunc, HttpIntercept, RequestOptions } from "./interface";
import { CUSTOME_REQUESTER, HTTP_INTERCEPT, HTTP_OPTIONS } from "./token";

const defaultOptions: RequestOptions = {
  auto: true,
  pluck: ['data'],
  method: 'POST'
};

export function useRequest<D, R>(
  url: string, 
  body?: R, 
  options?: RequestOptions
): [Ref<UnwrapRef<D>>, () => Promise<UnwrapRef<D>>] {
  const [resData, setData]   = useState<D>(null);
  const intercept            = useInjector<HttpIntercept>(HTTP_INTERCEPT, 'optional');  
  const globalOptions        = useInjector<RequestOptions>(HTTP_OPTIONS, 'optional');
  const customeRequester     = useInjector<RequesterFunc>(CUSTOME_REQUESTER, 'optional');

  const myOptions: RequestOptions = Object.assign(defaultOptions, globalOptions, options);

  const request = () => {
    const req  = customeRequester || fetch;
    return new Promise<RequestInit>((resolve, reject) => {
      if(!intercept) {
        resolve(myOptions)
      } else {        
        intercept?.requestIntercept({method: myOptions.method, headers: {}, body})
          .then( reqData => resolve(reqData), _ => reject(null) );
      }      
    }).then( (reqData: RequestInit) => {
      if(reqData.method === 'POST') {
        reqData.body = JSON.stringify(reqData.body)
      }
      return req(myOptions.baseUrl + url, reqData)
    }).then( res => {
      if(intercept) intercept?.responseIntercept(res);
      const data = pluckObj(res.body, ...myOptions.pluck) as UnwrapRef<D>;
      setData(data);
      return data;      
    })
  }

  onMounted( () => {
    if(myOptions.auto) request();
  })

  return [resData, request]
}

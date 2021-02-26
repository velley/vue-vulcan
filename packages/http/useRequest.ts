import { onMounted, Ref, UnwrapRef } from "vue";
import { pluckObj } from "../utils/pluckObj";
import { useState } from "../common/useState";
import { useInjector } from "../ioc/useInjector";
import { RequesterFunc, HttpIntercept, RequestOptions } from "./interface";
import { CUSTOME_REQUESTER, HTTP_INTERCEPT, HTTP_OPTIONS } from "./token";
import { objectToUrlSearch } from "../utils/objectToUrlSearch";

const defaultOptions: RequestOptions = {
  auto: true,
  pluck: ['data'],
  method: 'GET',
  baseUrl: ''
};

export function useRequest<D>(
  url: string, 
  options?: RequestOptions
): [Ref<UnwrapRef<D>>, () => Promise<UnwrapRef<D>>] {
  const [resData, setData]   = useState<D>(null);
  const intercept            = useInjector<HttpIntercept>(HTTP_INTERCEPT, 'optional');  
  const globalOptions        = useInjector<RequestOptions>(HTTP_OPTIONS, 'optional');
  const customeRequester     = useInjector<RequesterFunc>(CUSTOME_REQUESTER, 'optional');

  const myOptions: RequestOptions = Object.assign(defaultOptions, globalOptions, options);

  const request = () => {
    const req  = customeRequester || fetch;
    return new Promise<RequestOptions>((resolve, reject) => {
      if(!intercept) {
        resolve(myOptions)
      } else {        
        intercept?.requestIntercept(myOptions)
          .then( reqOptions => resolve(reqOptions), _ => reject(null) );
      }      
    }).then( reqOptions => {     
      let f_url = myOptions.baseUrl + url;
      if(reqOptions.method === 'GET') { 
        const searchKeys = `?${objectToUrlSearch(reqOptions.body)}`;
        f_url += searchKeys;
        delete reqOptions.body;
      } else {
        intercept && (reqOptions.body = JSON.stringify(reqOptions.body))      
      }
      
      return req(f_url, reqOptions);
    }).then( res => {
      if(res.ok) {
        if(intercept) intercept?.responseIntercept(res);
        const data = pluckObj(res.body, ...myOptions.pluck) as UnwrapRef<D>;
        setData(data);
        return data;
      } else {
        console.error(res.statusText)
      }      
    })
  }

  onMounted( () => {
    if(myOptions.auto) request();
  })

  return [resData, request]
}

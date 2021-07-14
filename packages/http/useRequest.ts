import { onMounted, Ref, UnwrapRef } from "vue";
import { pluckObj } from "../utils/pluckObj";
import { useState } from "../common/useState";
import { useInjector } from "../ioc/useInjector";
import { RequesterFunc, HttpIntercept, RequestOptions, RequestStatus } from "./domain";
import { CUSTOME_REQUESTER, HTTP_INTERCEPT, HTTP_OPTIONS } from "./token";
import { objectToUrlSearch } from "../utils/objectToUrlSearch";

export function useRequest<D>(
  url: string, 
  options?: RequestOptions
): [Ref<UnwrapRef<D>>, (data?: any) => Promise<UnwrapRef<D>>, Ref<RequestStatus>] {
  const [resData, setData]         = useState<D>(null);
  const [requestStatus, setStatus] = useState<RequestStatus>('ready');
  const intercept                  = useInjector<HttpIntercept>(HTTP_INTERCEPT, 'optional');  
  const globalOptions              = useInjector<RequestOptions>(HTTP_OPTIONS, 'optional');
  const customeRequester           = useInjector<RequesterFunc>(CUSTOME_REQUESTER, 'optional');

  const myOptions: RequestOptions = Object.assign({
    auto: true,
    pluck: ['data'],
    method: 'GET',
    baseUrl: '',
    data: {},
    headers: {}  
  }, globalOptions, options);

  const request = (newData: object = {}) => {
    setStatus('pending');
    const req  = customeRequester || (fetch as RequesterFunc) ;
    return new Promise<RequestOptions>((resolve, reject) => {
      if(!intercept) {
        resolve(myOptions)
      } else {        
        intercept?.requestIntercept({ ...myOptions, path: url })
          .then( reqOptions => resolve(reqOptions), err => {reject(err); setStatus('failed')} );
      }      
    }).then( reqOptions => {           
      let f_url = reqOptions.baseUrl + url;
      let data = Object.assign(reqOptions.data, newData)
      if(['GET', 'HEAD'].includes(reqOptions.method)) { 
        const searchKeys = `?${objectToUrlSearch(data)}`;
        f_url += searchKeys;        
      } else {
        !customeRequester && (reqOptions.body = JSON.stringify(data))
      }      
      reqOptions.data = data;
      return req(f_url, reqOptions);
    }).then( res => {
      if(intercept && intercept?.responseIntercept) {  
        return intercept.responseIntercept(res).then( data => {
          console.log('inte res data', data) 
          setData(data);
          return data
        })
      };

      if(customeRequester) {
        console.log('custome res', res)
        const data = pluckObj(res.data, ...myOptions.pluck) as UnwrapRef<D>;
        console.log('filter', data)
        setData(data);
        return data; 
      } else {
        res.json().then( body => {
          console.log('body', body)
          const data = pluckObj(body, ...myOptions.pluck) as UnwrapRef<D>;
          console.log('filter', data)
          setData(data);
          return data; 
        })
      }               
    })
  }

  onMounted( () => {
    if(myOptions.auto) request();
  })

  return [resData, request, requestStatus]
}

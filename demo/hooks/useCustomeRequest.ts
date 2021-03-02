import axios from 'axios';
import { RequestOptions, CUSTOME_REQUESTER, RequesterFunc } from "../../packages";

export function useCustomeRequest(): RequesterFunc {
	return function (url: string, options: RequestOptions) {		
		return axios({ url, ...options }) as Promise<any>
	}
}

useCustomeRequest.token = CUSTOME_REQUESTER;
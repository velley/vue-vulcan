import { HTTP_INTERCEPT } from "../../packages";
import { HttpIntercept, HttpResponse, RequestOptions } from "../../packages/http/domain";

export function useHttpIntercept(): HttpIntercept {

	const requestIntercept = (request: RequestOptions) => {
		return new Promise((resolve, reject) => {
			request.data.intercept = true;
			request.headers.token = 'xxxtoken'
			resolve(request)
		})
	}

	const responseIntercept = (response: HttpResponse) => {
		checkCode(response.status);
		console.log('res inte used')
		return response.json().then(res => res.data);
		// return new Promise( resolve => {
		// 	console.log(response)
		// 	resolve(response.data.data)
		// })
	}

	const checkCode = (code: number) => {

	}

	return {
		requestIntercept,
		responseIntercept
	}
}

useHttpIntercept.token = HTTP_INTERCEPT;
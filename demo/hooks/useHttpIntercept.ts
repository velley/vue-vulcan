import { HttpIntercept, HttpResponse, HTTP_INTERCEPT, RequestOptions } from "../../packages";

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
import { reactive, Ref, toRaw, UnwrapRef } from "vue";
import { useRequest, RequestStatus } from "../http";

interface FormOption {
  loadingTip?: string;
  successTip?: string;
  callback?: (res?: any) => void;
}

interface FormAction<T> {
  submit: (data?: any) => void,
  patchValues: (data: T, keys?: Array<keyof T>) => void
}

interface FormStates {
  valid: boolean;
  httpStatus: Ref<RequestStatus>;
}

export function useForm<T extends object, R = object>(
  url: string, formData: T , option?: FormOption
): [T, FormAction<T>, FormStates, Ref<UnwrapRef<R>> ] {

  const formDataRef = reactive<T>(formData) as T;

  const [res, doRequest, httpStatus] = useRequest<R>(url, { auto: false, method: 'POST' });

  /** 
  * @param data 要并入的表单对象
  * @param keys 指定data哪些属性会被并入表单对象，若不传则会并入data对象所有属性  
  */
  const patchValues = (data: T , keys?: Array<keyof T>) => {
    const patchkeys = keys ? keys : Object.keys(data)
    for (const key of patchkeys) {
      if (data[key as string]) {
        formDataRef[key as keyof T] = data[key as string]
      }
    }
  }

  // 提交表单请求
  const submit = (params: any = {}) => {
    doRequest({...toRaw(formDataRef), ...params})
  }

  return [
    formDataRef,
    {
      submit,
      patchValues
    },
    {
      valid: true,
      httpStatus
    },
    res
  ]
}

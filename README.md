
# <center><font color=yellowgreen>vue-vulcan</font></center>
### <center>一个为vue3定制的依赖注入解决方案</center>
### <center><button>license</button><button>MIT</button></center>
***
### <center>设计理念</center>
#### 本方案充分将vue3组合函数的特性与依赖注入思想相结合，形成了一套较为工程化的开发范式，并能在一定程度上替代vuex等状态管理方案。
#### 参考文章[https://zhuanlan.zhihu.com/p/351519484]
***
### <center>核心API</center>

### 1. useProvider/useInjector
#### 该api基于vue3内置的provide/inject实现。用法如下：
#### 步骤一： 将项目的一段业务逻辑放进vue组合函数，例如用户的相关业务逻辑（业务数据与方法统一聚合在组合函数内）
``` ts
export function useAuthInfo() {
    const userData = ref(null);
    const token    = ref(null);

    const login    = (loginData: LoginData) => {
			fetch('/login', {body: loginData, method: 'POST'})
				.then(res => res.json())
				.then(res => {
						userData.value = res.data.userData;
						token.value = res.data.token;
				})
    }

    const logOut = () => {
			fetch('logout')
				.then(_ => { userData.value = null; token.value = null })
    }

    return {
			userData,
			token,
			login,
			logout
    }
}
```
#### 步骤二： 在app.vue中引用该组合函数，通过useProvider提供该函数。将该函数作为参数传入userProvider后，该函数会直接调用，返回的值将作为依赖提供给下层组件。
``` ts
//app.vue
import { useAuthInfo } from 'src/vca';
import { useProvider } from 'vue-vulcan';

<script lang="ts" setup>
	useProvider(useAuthInfo);
</script>
```

#### 步骤三：在下层的子孙组件中通过useInjector获取useAuthInfo调用后返回的依赖值。
``` ts
//userData.vue
import { useAuthInfo } from 'src/vca';
import { useInjector } from 'vue-vulcan';

<script lang="ts" setup>
	const { userData } = useInjector(useAuthInfo);
</script>

<template>
	<div>
		<span>userData.username</span>
		<span>userData.age</span>
	</div>	
</template>
```
***
### <center>扩展API</center>
#### 1. useRequest
#### 基于fetch封装的http请求函数，使用示例：
``` ts
	export function useBookList() {
		const [ bookList ] = useRequest('/getBookList', { data: {groupId: '1'} });

		return {
			bookList
		}
	}
```
### useRequest调用后，会默认发起请求，若想控制发送请求的时机，可在第二参数内传入{auto: false}

``` ts
	export function useBookList() {
		const [bookList, getBookList] = useRequest('/getBookList', { data: {groupId: '1'}, auto: false });

		return {
			bookList,
			getBookList
		}
	}
```
#### 该情况下，你必须手动调用getBookList方法才会触发请求。请求成功后，bookList会自动获得响应值。
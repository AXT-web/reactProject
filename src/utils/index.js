import axios from 'axios'

export const getCurrentCity = () => {
    // 获取本地存储中是否有
    let localCity = JSON.parse(localStorage.getItem('localCity'))
    if (!localCity) {
        // 如果没有，就需要获取当前定位城市
        // 利用 promis 来解决异步数据的返回
        return new Promise((resolve, reject) => {
            try {
                // 获取当前城市信息
                var myCity = new window.BMap.LocalCity();
                myCity.get(async res => {
                    // 当获取到对应的城市信息了后，我们需要请求我们自己的服务器
                    const { data: infoRes } = await axios.get('http://localhost:8080/area/info', {
                        params: {
                            name: res.name
                        }
                    })
                    if (infoRes.status !== 200) {
                        console.error(infoRes.description)
                        return
                    }
                    console.log(infoRes);

                    // res.data.body
                    // 保存在本地存储中
                    localStorage.setItem('localCity', JSON.stringify(infoRes.body))
                        // 返回城市的数据
                    resolve(infoRes.body)
                });
            } catch (error) {
                // 进入到catch代码块 说明调用失败了
                reject(error)
            }
        })

    }
    // 如果有，我们直接返回城市信息就好,返回一个成功的promis对象即可
    return Promise.resolve(localCity)
}
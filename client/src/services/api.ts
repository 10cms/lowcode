import { getScenarioName } from "src/common";

const baseUri = location.port ? `http://localhost:3000/api` : '/api'
const projectSlug = getScenarioName()

export const getConfig = async (configSlug: string) => {
  const res = await fetch(`${baseUri}/project/${projectSlug}/config/${configSlug}`)
  try {
    const config = await res.json();
    return JSON.parse(config.value)
  } catch (e) {
    return null
  }
}

// Api存储对象数据的时候，会删除子节点中的空对象。所以这里需要转换成字符串
export const setConfig = async (configSlug: string, value: any) => {
  const res = await fetch(`${baseUri}/project/${projectSlug}/config/${configSlug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      value: JSON.stringify(value)
    })
  })
  return res
}
import { useEffect, useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios'

const apiFake = axios.create({
  baseURL: 'http://localhost:7010',
})

function useRequestData<T = unknown>(
  url: string,
  options?: AxiosRequestConfig,
) {
  const [data, setData] = useState<T | null>(null) // <T | null> is a generic type that can be any type or null
  const [isFetching, setIsFetching] = useState<boolean>(true) // loading state for the request
  const [error, setError] = useState<Error | null>(null) // error state for the request

  useEffect(() => {
    apiFake
      .get(url)
      .then((response) => {
        setData(response.data)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        // finally is called after the request is done, regardless of success or failure
        setIsFetching(false) // set loading state to false after the request is done
      })
  }, [url]) // useEffect will run when the url changes

  return { data, error, isFetching }
}

export default useRequestData

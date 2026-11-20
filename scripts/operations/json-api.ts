import { Result } from '@adrienlcp/result'

export type JsonRecord = Record<string, unknown>

export const isJsonRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const readString = (record: JsonRecord, key: string) => {
  const value = record[key]

  return typeof value === 'string' ? value : undefined
}

type JsonRequest = {
  body?: JsonRecord
  method?: 'GET' | 'POST'
  token: string
}

/** Calls a JSON API with a bearer token; the token never reaches the console. */
export const requestJson = async (
  url: string,
  { body, method = 'GET', token }: JsonRequest
): Promise<Result<unknown, string>> => {
  const response = await fetch(url, {
    body: body && JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    method
  })
  const text = await response.text()
  const parsed: unknown = text ? JSON.parse(text) : null

  return response.ok
    ? Result.success(parsed)
    : Result.failure(`${method} ${url} answered ${response.status}: ${text}`)
}

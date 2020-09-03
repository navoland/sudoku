export default function<T>(): [Promise<T>, (v?: any) => void, (v?: any) => void] {
  let reject: (v?: any) => void
  let resolve: (v?: any) => void

  const promise = new Promise<T>((_resolve, _reject) => {
    reject = _reject
    resolve = _resolve
  })

  return [promise, resolve, reject]
}

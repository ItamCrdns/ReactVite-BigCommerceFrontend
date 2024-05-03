export const saveCookie = (name: string, value: string) => {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 7) // 7 days from now

  document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}`
}

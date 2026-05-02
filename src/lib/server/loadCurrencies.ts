export async function loadCurrencies() {
  const url =
    "https://api.frankfurter.app/latest?base=USD&symbols=AUD,BRL,CAD,CHF,CNY,CZK,DKK,EUR,GBP,HKD,HUF,IDR,ILS,INR,ISK,JPY,KRW,MXN,MYR,NOK,NZD,PHP,PLN,RON,SEK,SGD,THB,TRY,ZAR"

  const response = await fetch(url)
  const data: { rates: Record<string, number> } = await response.json()

  // Mapping currency symbols to ISO codes
  const symbolMap: Record<string, string> = {
    "€": "EUR",
    $: "USD",
  }

  // Copy only the ones that exist in rates
  const currList = Object.fromEntries(
    Object.entries(data.rates).map(([key, value]) => [key, value])
  )

  // Add symbols if needed
  for (const [symbol, iso] of Object.entries(symbolMap)) {
    if (currList[iso]) {
      currList[symbol] = currList[iso]
    }
  }

  return currList
}

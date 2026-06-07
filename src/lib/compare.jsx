import { createContext, useContext, useState, useCallback } from 'react'

const CompareCtx = createContext(null)
const MAX = 2

export function CompareProvider({ children }) {
  const [slugs, setSlugs] = useState([])

  const toggle = useCallback((slug) => {
    setSlugs((cur) => {
      if (cur.includes(slug)) return cur.filter((s) => s !== slug)
      // Cap at 2 — picking a third swaps out the oldest selection.
      if (cur.length >= MAX) return [...cur.slice(1), slug]
      return [...cur, slug]
    })
  }, [])

  const add = useCallback((slug) => {
    setSlugs((cur) => (cur.includes(slug) || cur.length >= MAX ? cur : [...cur, slug]))
  }, [])
  const remove = useCallback((slug) => setSlugs((cur) => cur.filter((s) => s !== slug)), [])
  const clear = useCallback(() => setSlugs([]), [])

  return (
    <CompareCtx.Provider value={{ slugs, toggle, add, remove, clear, max: MAX, has: (s) => slugs.includes(s) }}>
      {children}
    </CompareCtx.Provider>
  )
}

export const useCompare = () => useContext(CompareCtx)

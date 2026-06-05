// Single formatting layer for weights. Internally everything is kilograms;
// this is the one place a future unit (lbs) would be added (see CLAUDE.md).

export function useWeightFormat() {
  const { locale } = useI18n()

  const numberFmt = computed(
    () =>
      new Intl.NumberFormat(locale.value, {
        maximumFractionDigits: 0
      })
  )

  /** e.g. 1234.5 -> "1,235 kg" */
  const formatKg = (kg: number): string => `${numberFmt.value.format(Math.round(kg))} kg`

  /** Signed variant for "remaining"/"over by" readouts, e.g. -91 -> "-91 kg". */
  const formatKgSigned = (kg: number): string => {
    const rounded = Math.round(kg)
    const sign = rounded > 0 ? '+' : ''
    return `${sign}${numberFmt.value.format(rounded)} kg`
  }

  /** e.g. 84.6 -> "85%" */
  const formatPercent = (percent: number): string => `${Math.round(percent)}%`

  return { formatKg, formatKgSigned, formatPercent }
}

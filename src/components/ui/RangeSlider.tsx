interface RangeSliderProps {
  min: number
  max: number
  step: number
  valueMin: number
  valueMax: number
  onChangeMin: (v: number) => void
  onChangeMax: (v: number) => void
}

export function RangeSlider({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
}: RangeSliderProps) {
  const minPercent = ((valueMin - min) / (max - min)) * 100
  const maxPercent = ((valueMax - min) / (max - min)) * 100

  return (
    <div className="relative h-[20px] flex items-center">
      {/* Ray */}
      <div className="absolute w-full h-[5px] rounded-full bg-gray-200 dark:bg-dark-700" />
      {/* Dolgu */}
      <div
        className="absolute h-[5px] rounded-full bg-primary transition-all duration-150"
        style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
      />
      {/* Min thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMin}
        onChange={(e) => {
          const v = Math.min(Number(e.target.value), valueMax - step)
          onChangeMin(v)
        }}
        className="range-thumb"
        aria-label="En düşük değer"
      />
      {/* Max thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMax}
        onChange={(e) => {
          const v = Math.max(Number(e.target.value), valueMin + step)
          onChangeMax(v)
        }}
        className="range-thumb"
        aria-label="En yüksek değer"
      />
    </div>
  )
}
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]
  const steps = max - min
  const tickCount = steps > 0 ? steps + 1 : 1

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative pt-6 pb-1 data-horizontal:w-full data-vertical:h-full data-vertical:py-0 data-vertical:pr-6 data-vertical:pl-1",
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="group/track relative grow overflow-hidden rounded-full bg-muted select-none transition-all data-horizontal:h-1.5 data-horizontal:w-full data-horizontal:hover:h-2 data-horizontal:data-[dragging=true]:h-2 data-vertical:h-full data-vertical:w-1.5 data-vertical:hover:w-2 data-vertical:data-[dragging=true]:w-2"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-between px-[2px] data-[orientation=vertical]:flex-col data-[orientation=vertical]:justify-between data-[orientation=vertical]:px-0 data-[orientation=vertical]:py-[2px]"
          >
            {Array.from({ length: tickCount }).map((_, i) => (
              <span
                key={i}
                className="block size-1.5 rounded-full bg-muted-foreground/50 transition-colors group-data-[dragging=true]/track:bg-muted-foreground/70"
              />
            ))}
          </div>
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="relative bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="relative block size-3.5 shrink-0 rounded-full border-2 border-primary bg-white shadow-md ring-ring/50 transition-[box-shadow,transform] select-none after:absolute after:-inset-2 hover:ring-3 hover:scale-110 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 active:scale-110 disabled:pointer-events-none disabled:opacity-50"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-bold text-background tabular-nums shadow-sm after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-4 after:border-x-transparent after:border-b-transparent after:border-t-foreground"
            >
              {_values[index]}
            </span>
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }

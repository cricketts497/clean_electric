import { IntensityIndex } from "./intensity-index";

export interface Intensity {
  forecast: number,
  actual: number,
  index: IntensityIndex,
}
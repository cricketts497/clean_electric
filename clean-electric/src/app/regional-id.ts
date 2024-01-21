import { IntensityPeriod } from "./intensity-period";
import { Region } from "./region";

export interface RegionalId {
  regionid: Region,
  dnoRegion: string,
  shortName: string,
  data: IntensityPeriod[],
}

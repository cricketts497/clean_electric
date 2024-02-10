import { IntensityPeriodDto } from "./intensity-period-dto";
import { Region } from "./region";

export interface RegionalIdDto {
  regionid: Region,
  dnoRegion: string,
  shortName: string,
  data: IntensityPeriodDto[],
}

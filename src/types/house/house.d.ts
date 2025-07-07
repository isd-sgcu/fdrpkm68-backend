import { Group } from "@prisma/client";

export interface House {
  id: string;
  nameThai: string;
  nameEnglish: string;
  descriptionThai: string;
  descriptionEnglish: string;
  sizeLetter: string;
  chosenCount: number;
  capacity: number;
  instagram: string;
  facebook: string;
  tiktok: string;
  groupsRank1?: Group[];
  groupsRank2?: Group[];
  groupsRank3?: Group[];
  groupsRank4?: Group[];
  groupsRank5?: Group[];
  groupsSub?: Group[];
}

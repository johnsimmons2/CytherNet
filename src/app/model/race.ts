import { Feat } from "./feat";


export interface Race {
    id?: number;
    name: string;
    description: string;
    size: string;
    languages: string;
    alignment: string;
    feats: number[];
}
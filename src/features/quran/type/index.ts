export interface IAyahs {
  number: number,
  text: string,
  numberInSurah: number,
  juz: number,
  manzil: number,
  page: number,
  ruku: number,
  hizbQuarter: number,
  sajda: boolean
}

export interface IFullQuranSurah {
  number: number,
  name: string,
  englishName: string,
  englishNameTranslation: string,
  revelationType: string,
  numberOfAyahs: number,
  ayahs: IAyahs[]

}
export interface IFullQuranResponse {
  code: number;
  status: string;
  data: {
    edition: {
      identifier: string;
      language: string;
      name: string;
      englishName: string;
      format: string;
      type: string;
      direction: string;
    };
    surahs: IFullQuranSurah[];
  };
}


export interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
  startingPage: number;
  endingPage: number;
}

export interface JuzSection {
  juzNumber: number;
  surahs: Surah[];
}

type PageSection = {
  header?: {
    surahName: string,
    showBismillah: boolean
  }
  ayahs: {
    text: string,
    ayahNumber: string,
    sajdah: boolean
  }[]
}

export type Page = {
  pageNumber: number,
  juz: number,
  hizb: number,
  surahName: string,
  sections:PageSection[]
}

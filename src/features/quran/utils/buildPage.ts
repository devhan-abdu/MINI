import { IFullQuranSurah, Page } from "../type"


export const buildPages = (surahs: IFullQuranSurah[]): Page[] => {
  const pageMap: Record<number, Page> = {}
  
  for (const surah of surahs) {

    for (const ayah of surah.ayahs) {
      const pageNum = ayah.page
      
      if (!pageMap[pageNum]) {
        pageMap[pageNum] = {
          pageNumber: pageNum,
          juz: ayah.juz,
          hizb: ayah.hizbQuarter,
          sections: [],
          surahName: surah.englishName
        }
      }
      const page = pageMap[pageNum]

      let currentSection = page.sections[page.sections.length - 1]
      const isNewSurah = ayah.numberInSurah === 1

      if (!currentSection || isNewSurah) {
        currentSection = {
          ayahs: []
        }
        if (isNewSurah) {
          currentSection.header = {
            surahName: surah.name,
            showBismillah: surah.number !== 1 && surah.number !== 9
          }
        }

        page.sections.push(currentSection)
      }

        currentSection.ayahs.push({
          text: ayah.text,
          ayahNumber: toArebicNumber(ayah.numberInSurah),
          sajdah: ayah.sajda
        })
      

    }


  }

   return Object.values(pageMap).sort(
      (a, b) => a.pageNumber - b.pageNumber
    )
}

export const toArebicNumber = (num: number) => {
  return num.toLocaleString('ar-EG')
}
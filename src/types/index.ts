import * as Yup from "yup"
import type { InferType } from "yup";

export interface IWeeklyMurajaDay {
    id?: number,
    weekly_plan_id: number,
    date: string,
    day_of_week: string,
    planned_start_page: number,
    planned_end_page: number,
    planned_pages: number
} 



export const WeeklyMurajaSchema = Yup.object({
  id: Yup.number()
    .min(1, "Invalid ID")
    .transform((value, originalValue) => originalValue === "" ? undefined : Number(originalValue)),



 week_start_date: Yup.string().required("Week start date is required"),

 planned_pages: Yup.number()
    .nullable()
    .transform((value, originalValue) => originalValue === "" ? undefined : Number(originalValue))
    .typeError('Planned pages must be a number') 
    .required("Planned pages required")
    .integer("Planned pages must be a whole number") 
    .min(1, "Planned pages must be greater than zero"), 

  start_surah: Yup.number()
    .nullable()
    .transform((value, originalValue) => originalValue === "" ? undefined : Number(originalValue))
    .typeError('Start surah must be a number')
    .required("Start surah required")
    .integer("Start surah must be a whole number")
    .min(1, "Start surah must be greater than zero"),

  start_page: Yup.number()
    .nullable()
    .transform((value, originalValue) => originalValue === "" ? undefined : Number(originalValue))
    .typeError('Start page must be a number')
    .required("Start page required")
    .integer("Start page must be a whole number")
    .min(1, "Start page must be greater than zero"),

  estimated_time_min: Yup.number()
    .nullable()
    .transform((value, originalValue) => originalValue === "" ? undefined : Number(originalValue))
    .typeError('Estimated time must be a number')
    .required("Estimated time required")
    .integer("Estimated time must be a whole number")
    .min(1, "Estimated time must be greater than zero"),

  selectedDays: Yup.array()
    .of(Yup.number())
    .min(1, "select at least one day")
    .required("please select days"),

  place: Yup.string().nullable(),
  note: Yup.string().nullable(),
});

export type WeeklyMurajaFormType = InferType<typeof WeeklyMurajaSchema>;
export type WeeklyMurajaType = Omit<WeeklyMurajaFormType, "selectedDays"> & {
  user_id: string;
};

export interface ISurah {
  number: number,
  startingPage: number,
  endingPage: number,
  name: string,
  englishName: string,
  revelationType: string,
  numberOfAyahs: string,
  revelationOrder: number,
}
import { en } from "./en";
import '@/index.css';
type DeepString<T> = {
  [Key in keyof T]: T[Key] extends string ? string : DeepString<T[Key]>;
};

export type Translation = DeepString<typeof en>;

export const translations = {
  en,
} satisfies Record<string, Translation>;

export type Locale = keyof typeof translations;

export function getLabels(locale: Locale = "en"): Translation {
  return translations[locale];
}

export function formatLabel(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}


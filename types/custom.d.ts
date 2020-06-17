type i18nTranslate = (key: string, options?: any) => string
declare namespace NodeJS {
  export interface Global {
    __: i18nTranslate
  }
}

declare const __: i18nTranslate;
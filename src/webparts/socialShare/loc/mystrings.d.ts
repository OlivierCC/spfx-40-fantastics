declare interface ISocialShareStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Pubid: string;
  Style: string;
  Size: string;
  Yammer: string;
  Linkedin: string;
  Twitter: string;
  Facebook: string;
  GooglePlus: string;
  More: string;
  Count: string;
  Services: string;
}

declare module 'SocialShareStrings' {
  const strings: ISocialShareStrings;
  export = strings;
}

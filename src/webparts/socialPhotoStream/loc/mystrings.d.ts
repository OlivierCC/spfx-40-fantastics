declare interface ISocialPhotoStreamStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  network: string;
  userName: string;
  accessKey: string;
  limit: string;
  overlay: string;
  dimension: string;
  spacing: string;
}

declare module 'SocialPhotoStreamStrings' {
  const strings: ISocialPhotoStreamStrings;
  export = strings;
}

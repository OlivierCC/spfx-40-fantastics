declare interface IImageColorStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Image: string;
  Color: string;
  ErrorSelectImage: string;
  Alt: string;
  LinkText: string;
  LinkUrl: string;
}

declare module 'ImageColorStrings' {
  const strings: IImageColorStrings;
  export = strings;
}

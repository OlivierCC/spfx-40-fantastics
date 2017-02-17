declare interface IImagePuzzleStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Image: string;
  ErrorSelectImage: string;
  Alt: string;
  LinkText: string;
  LinkUrl: string;
  Dimension: string;
  PuzzleGroupName: string;
  Frequence: string;
  Columns: string;
  Rows: string;
  Distinct: string;
  Margin: string;
}

declare module 'ImagePuzzleStrings' {
  const strings: IImagePuzzleStrings;
  export = strings;
}

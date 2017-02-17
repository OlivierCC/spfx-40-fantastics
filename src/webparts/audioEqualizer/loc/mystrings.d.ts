declare interface IAudioEqualizerStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  audio: string;
  audioType: string;
  dimension: string;
  color: string;
  color1: string;
  color2: string;
  bars: string;
  barMargin: string;
  components: string;
  componentMargin: string;
  frequency: string;
  refreshTime: string;
}

declare module 'AudioEqualizerStrings' {
  const strings: IAudioEqualizerStrings;
  export = strings;
}

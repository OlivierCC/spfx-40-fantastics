import { IPropertyFieldDimension } from 'sp-client-custom-fields/lib/PropertyFieldDimensionPicker';

export interface INewsSliderWebPartProps {

  items: any[];

  enableArrows: boolean;
  enableBullets: boolean;
  enablePlayButton: boolean;
  enableFullscreenButton: boolean;
  enableZoomPanel: boolean;
  controlsAlwaysOn: boolean;
  enableIcons: boolean;

  preserveRatio: boolean;
  pauseOnMouseover: boolean;
  carousel: boolean;
  autoplay: boolean;
  speed: number;
  transition: string;
  enableProgressIndicator: string;
  bulletsAlignHor: string;
  backgroundColor: string;

  textPanelEnable: boolean;
  textPanelAlwaysOnTop: boolean;
  textPanelPosition: string;
  textPanelOpacity: string;
  textPanelFont: string;
  textPanelFontSize: string;
  textPanelFontColor: string;
  textPanelBackgroundColor: string;
  textPanelAlign: string;

  enableBorder: boolean;
  borderColor: string;
  border: number;

  tileDimension: IPropertyFieldDimension;

}

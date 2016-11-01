/**
 * @file
 * Media Player Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IMediaPlayerWebPartProps {
  player: string;
  html5video: string;
  html5cover: string;
  html5captions: any[];
  youtubeVideoId: string;
  vimeoVideoId: string;
  audio: string;
}

/**
 * @file
 * Social Bar Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'SocialShareStrings';
import { ISocialShareWebPartProps } from './ISocialShareWebPartProps';
import { SPComponentLoader } from '@microsoft/sp-loader';

//Imports property pane custom fields
import { PropertyFieldDropDownSelect } from 'sp-client-custom-fields/lib/PropertyFieldDropDownSelect';

export default class SocialShareWebPart extends BaseClientSideWebPart<ISocialShareWebPartProps> {

  private addthis: any;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
  }

  /**
   * @function
   * Gets WP data version
   */
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    var html = '<div class="addthis_toolbox addthis_' + this.properties.style + '_style addthis_' + this.properties.size + '_style">';
    if (this.properties.yammer)
  		html += '<a class="addthis_button_yammer"></a>';
		if (this.properties.linkedin)
      html += '<a class="addthis_button_linkedin"></a>';
		if (this.properties.twitter)
      html += '<a class="addthis_button_twitter"></a>';
		if (this.properties.facebook)
      html += '<a class="addthis_button_facebook"></a>';
    if (this.properties.googlePlus)
      html += '<a class="addthis_button_google_plusone_share"></a>';

    if (this.properties.services != null) {
      for (var i = 0; i < this.properties.services.length; i++) {
        html += '<a class="addthis_button_' + this.properties.services[i] + '"></a>';
      }
    }

		if (this.properties.more)
      html += '<a class="addthis_button_compact"></a>';
    if (this.properties.count)
      html += '<a class="addthis_counter addthis_bubble_style"></a>';
		html += '</div>';

    this.domElement.innerHTML = html;

    if (this.addthis == null) {
      SPComponentLoader.loadScript('//s7.addthis.com/js/300/addthis_widget.js#async=1#pubid=' + this.properties.pubid, { globalExportsName: 'addthis' }).then((addthis?: any)=> {
        this.addthis = addthis;
        this.addthis.init();
        this.addthis.toolbox('.addthis_toolbox');
        this.addthis.count('.addthis_counter');
      });

    }
    else {
      this.addthis.toolbox('.addthis_toolbox');
      this.addthis.count('.addthis_counter');
    }
  }

  /**
   * @function
   * PropertyPanel settings definition
   */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: false,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('pubid', {
                  label: strings.Pubid
                }),
                PropertyPaneDropdown('size', {
                  label: strings.Size,
                  options: [
                    {key: '16x16', text: '16x16'},
                    {key: '32x32', text: '32x32'},
                  ]
                }),
                PropertyPaneDropdown('style', {
                  label: strings.Style,
                  options: [
                    {key: 'default', text: 'Default'},
                    {key: 'floating', text: 'Floating'},
                  ]
                }),
                PropertyFieldDropDownSelect('services', {
                  label: strings.Services,
                  options: [
                    {key:'adifni', text:'Adifni'},
                    {key:'advqr', text:'ADV QR code'},
                    {key:'amazonwishlist', text:'Amazon'},
                    {key:'amenme', text:'Amen Me!'},
                    {key:'aim', text:'Aol Lifestream'},
                    {key:'aolmail', text:'AOL Mail'},
                    {key:'apsense', text:'APSense'},
                    {key:'arto', text:'Arto'},
                    {key:'aviary', text:'Aviary Capture'},
                    {key:'azadegi', text:'Azadegi'},
                    {key:'baang', text:'Baang'},
                    {key:'baidu', text:'Baidu'},
                    {key:'balltribe', text:'BallTribe'},
                    {key:'beat100', text:'Beat100'},
                    {key:'bebo', text:'Bebo'},
                    {key:'bentio', text:'Bentio'},
                    {key:'biggerpockets', text:'BiggerPockets'},
                    {key:'bitly', text:'Bit.ly'},
                    {key:'bizsugar', text:'bizSugar'},
                    {key:'bland', text:'Bland takkinn'},
                    {key:'blinklist', text:'Blinklist'},
                    {key:'blip', text:'Blip'},
                    {key:'blogger', text:'Blogger'},
                    {key:'bloggy', text:'Bloggy'},
                    {key:'blogkeen', text:'Blogkeen'},
                    {key:'blogmarks', text:'Blogmarks'},
                    {key:'blurpalicious', text:'Blurpalicious'},
                    {key:'bolt', text:'BO.LT'},
                    {key:'bobrdobr', text:'Bobrdobr'},
                    {key:'bonzobox', text:'BonzoBox'},
                    {key:'socialbookmarkingnet', text:'BookmarkingNet'},
                    {key:'bookmarkycz', text:'Bookmarky.cz'},
                    {key:'bookmerkende', text:'Bookmerken'},
                    {key:'box', text:'Box.net'},
                    {key:'brainify', text:'Brainify'},
                    {key:'bryderi', text:'Bryderi'},
                    {key:'buddymarks', text:'BuddyMarks'},
                    {key:'buffer', text:'Buffer'},
                    {key:'buzzzy', text:'Buzzzy'},
                    {key:'camyoo', text:'Camyoo'},
                    {key:'cardthis', text:'CardThis'},
                    {key:'care2', text:'Care2'},
                    {key:'foodlve', text:'Cherry Share'},
                    {key:'chimeinn', text:'Chime.In'},
                    {key:'chiq', text:'Chiq'},
                    {key:'cirip', text:'Cirip'},
                    {key:'citeulike', text:'CiteULike'},
                    {key:'classicalplace', text:'ClassicalPlace'},
                    {key:'cleanprint', text:'CleanPrint'},
                    {key:'cleansave', text:'CleanSave'},
                    {key:'clipdo', text:'clipDO'},
                    {key:'cndig', text:'Cndig'},
                    {key:'colivia', text:'Colivia.de'},
                    {key:'technerd', text:'Communicate'},
                    {key:'connotea', text:'Connotea'},
                    {key:'cootopia', text:'cOOtopia'},
                    {key:'cosmiq', text:'COSMiQ'},
                    {key:'cssbased', text:'CSS Based'},
                    {key:'curateus', text:'Curate.Us'},
                    {key:'delicious', text:'Delicious'},
                    {key:'designbump', text:'DesignBump'},
                    {key:'digthiswebhost', text:'Dig This Webhost'},
                    {key:'digaculturanet', text:'DigaCultura'},
                    {key:'digg', text:'Digg'},
                    {key:'diggita', text:'Diggita'},
                    {key:'digo', text:'Digo'},
                    {key:'digzign', text:'Digzign'},
                    {key:'diigo', text:'Diigo'},
                    {key:'dipdive', text:'Dipdive'},
                    {key:'domelhor', text:'doMelhor'},
                    {key:'dosti', text:'Dosti'},
                    {key:'dotnetkicks', text:'DotNetKicks'},
                    {key:'dotnetshoutout', text:'DotNetShoutout'},
                    {key:'douban', text:'Douban'},
                    {key:'draugiem', text:'Draugiem.lv'},
                    {key:'drimio', text:'Drimio'},
                    {key:'dropjack', text:'Dropjack'},
                    {key:'dudu', text:'Dudu'},
                    {key:'dzone', text:'dzone'},
                    {key:'edelight', text:'edelight'},
                    {key:'efactor', text:'EFactor'},
                    {key:'ekudos', text:'eKudos'},
                    {key:'elefantapl', text:'elefanta.pl'},
                    {key:'a97abi', text:'A97abi'},
                    {key:'email', text:'Email'},
                    {key:'mailto', text:'Email App'},
                    {key:'embarkons', text:'Embarkons'},
                    {key:'eucliquei', text:'euCliquei'},
                    {key:'evernote', text:'Evernote'},
                    {key:'extraplay', text:'extraplay'},
                    {key:'ezyspot', text:'EzySpot'},
                    {key:'stylishhome', text:'Fab Design'},
                    {key:'fabulously40', text:'Fabulously40'},
                    {key:'2tag', text:'2 Tag'},
                    {key:'informazione', text:'Fai Informazione'},
                    {key:'thefancy', text:'Fancy'},
                    {key:'fark', text:'Fark'},
                    {key:'farkinda', text:'Farkinda'},
                    {key:'fashiolista', text:'Fashiolista'},
                    {key:'favable', text:'FAVable'},
                    {key:'faves', text:'Fave'},
                    {key:'favlogde', text:'favlog'},
                    {key:'favoritende', text:'Favoriten.de'},
                    {key:'favorites', text:'Favorites'},
                    {key:'favoritus', text:'Favoritus'},
                    {key:'flaker', text:'Flaker'},
                    {key:'flosspro', text:'Floss.pro'},
                    {key:'folkd', text:'Folkd'},
                    {key:'formspring', text:'Formspring'},
                    {key:'thefreedictionary', text:'FreeDictionary'},
                    {key:'fresqui', text:'Fresqui'},
                    {key:'friendfeed', text:'FriendFeed'},
                    {key:'funp', text:'funP'},
                    {key:'fwisp', text:'fwisp'},
                    {key:'gabbr', text:'Gabbr'},
                    {key:'gamekicker', text:'Gamekicker'},
                    {key:'gg', text:'GG'},
                    {key:'giftery', text:'Giftery.me'},
                    {key:'gigbasket', text:'GigBasket'},
                    {key:'givealink', text:'GiveALink'},
                    {key:'globalgrind', text:'GlobalGrind'},
                    {key:'gmail', text:'Gmail'},
                    {key:'govn', text:'Go.vn'},
                    {key:'goodnoows', text:'Good Noows'},
                    {key:'google', text:'Google'},
                    {key:'googletranslate', text:'Google Translate'},
                    {key:'greaterdebater', text:'GreaterDebater'},
                    {key:'grono', text:'Grono.net'},
                    {key:'habergentr', text:'Haber.gen.tr'},
                    {key:'hackernews', text:'Hacker News'},
                    {key:'hadashhot', text:'Hadash Hot'},
                    {key:'hatena', text:'Hatena'},
                    {key:'gluvsnap', text:'Healthimize'},
                    {key:'hedgehogs', text:'Hedgehogs.net'},
                    {key:'hellotxt', text:'HelloTxt'},
                    {key:'historious', text:'Historious'},
                    {key:'hotbookmark', text:'Hot Bookmark'},
                    {key:'hotklix', text:'Hotklix'},
                    {key:'hotmail', text:'Hotmail'},
                    {key:'w3validator', text:'HTML Validator'},
                    {key:'hyves', text:'Hyves'},
                    {key:'identica', text:'Identica'},
                    {key:'idibbit', text:'IDibbIt'},
                    {key:'igoogle', text:'iGoogle'},
                    {key:'ihavegot', text:'ihavegot'},
                    {key:'index4', text:'Index4'},
                    {key:'indexor', text:'Indexor'},
                    {key:'instapaper', text:'Instapaper'},
                    {key:'investorlinks', text:'InvestorLinks'},
                    {key:'iorbix', text:'iOrbix'},
                    {key:'irepeater', text:'IRepeater.Share'},
                    {key:'isociety', text:'iSociety'},
                    {key:'iwiw', text:'iWiW'},
                    {key:'jamespot', text:'Jamespot'},
                    {key:'jappy', text:'Jappy Ticker'},
                    {key:'joliprint', text:'JoliPrint'},
                    {key:'jolly', text:'Jolly'},
                    {key:'jumptags', text:'Jumptags'},
                    {key:'kaboodle', text:'Kaboodle'},
                    {key:'kaevur', text:'Kaevur'},
                    {key:'kaixin', text:'Kaixin Repaste'},
                    {key:'ketnooi', text:'Ketnooi'},
                    {key:'kindleit', text:'Kindle It'},
                    {key:'kipup', text:'Kipup'},
                    {key:'kledy', text:'Kledy'},
                    {key:'kommenting', text:'Kommenting'},
                    {key:'latafaneracat', text:'La tafanera'},
                    {key:'librerio', text:'Librerio'},
                    {key:'lidar', text:'LiDAR Online'},
                    {key:'linkninja', text:'Link Ninja'},
                    {key:'linksgutter', text:'Links Gutter'},
                    {key:'linkshares', text:'LinkShares'},
                    {key:'linkuj', text:'Linkuj.cz'},
                    {key:'livejournal', text:'LiveJournal'},
                    {key:'lockerblogger', text:'LockerBlogger'},
                    {key:'logger24', text:'Logger24.com'},
                    {key:'mymailru', text:'Mail.ru'},
                    {key:'markme', text:'Markme'},
                    {key:'mashant', text:'Mashant'},
                    {key:'mashbord', text:'Mashbord'},
                    {key:'me2day', text:'me2day'},
                    {key:'meinvz', text:'meinVZ'},
                    {key:'mekusharim', text:'Mekusharim'},
                    {key:'memonic', text:'Memonic'},
                    {key:'memori', text:'Memori.ru'},
                    {key:'mendeley', text:'Mendeley Import'},
                    {key:'meneame', text:'MenÃ©ame'},
                    {key:'live', text:'Messenger'},
                    {key:'mindbodygreen', text:'Mindbodygreen'},
                    {key:'misterwong', text:'Mister Wong'},
                    {key:'misterwong', text:'Mister Wong DE'},
                    {key:'mixi', text:'Mixi'},
                    {key:'moemesto', text:'Moemesto.ru'},
                    {key:'moikrug', text:'Moikrug'},
                    {key:'mototagz', text:'mototagz'},
                    {key:'compact', text:'More'},
                    {key:'mrcnetworkit', text:'mRcNEtwORK'},
                    {key:'multiply', text:'Multiply'},
                    {key:'myaol', text:'myAOL'},
                    {key:'myhayastan', text:'MyHayastan'},
                    {key:'mylinkvault', text:'mylinkvault'},
                    {key:'myspace', text:'Myspace'},
                    {key:'n4g', text:'N4G'},
                    {key:'naszaklasa', text:'Nasza-klasa'},
                    {key:'netlog', text:'NetLog'},
                    {key:'netvibes', text:'Netvibes'},
                    {key:'netvouz', text:'Netvouz'},
                    {key:'newsmeback', text:'NewsMeBack'},
                    {key:'newstrust', text:'NewsTrust'},
                    {key:'newsvine', text:'Newsvine'},
                    {key:'nujij', text:'Nujij'},
                    {key:'odnoklassniki', text:'Odnoklassniki'},
                    {key:'oknotizie', text:'OKNOtizie'},
                    {key:'oneview', text:'oneview'},
                    {key:'orkut', text:'orkut'},
                    {key:'dashboard', text:'OS X Dashboard'},
                    {key:'oyyla', text:'Oyyla'},
                    {key:'packg', text:'Packg'},
                    {key:'pafnetde', text:'pafnet.de'},
                    {key:'pdfonline', text:'PDF Online'},
                    {key:'pdfmyurl', text:'PDFmyURL'},
                    {key:'phonefavs', text:'PhoneFavs'},
                    {key:'pingfm', text:'Ping.fm'},
                    {key:'pinterest', text:'Pinterest'},
                    {key:'planypus', text:'Planypus'},
                    {key:'plaxo', text:'Plaxo'},
                    {key:'plurk', text:'Plurk'},
                    {key:'pochvalcz', text:'Pochval.cz'},
                    {key:'pocket', text:'Pocket'},
                    {key:'politicnote', text:'PoliticNoteService'},
                    {key:'posteezy', text:'Posteezy'},
                    {key:'posterous', text:'Posterous'},
                    {key:'pratiba', text:'Prati.ba'},
                    {key:'addressbar', text:'Address Bar'},
                    {key:'print', text:'Print'},
                    {key:'printfriendly', text:'PrintFriendly'},
                    {key:'pusha', text:'Pusha'},
                    {key:'qrfin', text:'QRF.in'},
                    {key:'qrsrc', text:'QRSrc.com'},
                    {key:'quantcast', text:'Quantcast'},
                    {key:'qzone', text:'Qzone'},
                    {key:'reddit', text:'Reddit'},
                    {key:'rediff', text:'Rediff MyPage'},
                    {key:'redkum', text:'RedKum'},
                    {key:'researchgate', text:'ResearchGate'},
                    {key:'ridefix', text:'RideFix'},
                    {key:'safelinking', text:'Safelinking'},
                    {key:'scoopat', text:'Scoop.at'},
                    {key:'scoopit', text:'Scoop.it'},
                    {key:'sekoman', text:'Sekoman'},
                    {key:'select2gether', text:'Select2Gether'},
                    {key:'sharer', text:'Sharer'},
                    {key:'shaveh', text:'Shaveh'},
                    {key:'shetoldme', text:'SheToldMe'},
                    {key:'sinaweibo', text:'Sina Weibo'},
                    {key:'skyrock', text:'Skyrock Blog'},
                    {key:'smiru', text:'SMI'},
                    {key:'snipit', text:'Snip.it'},
                    {key:'sodahead', text:'SodaHead'},
                    {key:'sonico', text:'Sonico'},
                    {key:'speedtile', text:'Speedtile'},
                    {key:'spinsnap', text:'SpinSnap'},
                    {key:'spokentoyou', text:'Spoken To You'},
                    {key:'yiid', text:'Spread.ly'},
                    {key:'springpad', text:'springpad'},
                    {key:'squidoo', text:'Squidoo'},
                    {key:'startaid', text:'Startaid'},
                    {key:'startlap', text:'Startlap'},
                    {key:'storyfollower', text:'Story Follower'},
                    {key:'studivz', text:'studiVZ'},
                    {key:'stuffpit', text:'Stuffpit'},
                    {key:'stumbleupon', text:'StumbleUpon'},
                    {key:'stumpedia', text:'Stumpedia'},
                    {key:'sunlize', text:'Sunlize'},
                    {key:'supbro', text:'SUP BRO'},
                    {key:'surfingbird', text:'Surfingbird'},
                    {key:'svejo', text:'Svejo'},
                    {key:'symbaloo', text:'Symbaloo'},
                    {key:'taaza', text:'Taaza'},
                    {key:'tagza', text:'Tagza'},
                    {key:'taringa', text:'Taringa!'},
                    {key:'tarpipe', text:'tarpipe'},
                    {key:'textme', text:'Textme SMS'},
                    {key:'thewebblend', text:'The Web Blend'},
                    {key:'thinkfinity', text:'Thinkfinity'},
                    {key:'thisnext', text:'ThisNext'},
                    {key:'throwpile', text:'Throwpile'},
                    {key:'toly', text:'to.ly'},
                    {key:'topsitelernet', text:'TopSiteler'},
                    {key:'transferr', text:'Transferr'},
                    {key:'tuenti', text:'Tuenti'},
                    {key:'tulinq', text:'Tulinq'},
                    {key:'tumblr', text:'Tumblr'},
                    {key:'tvinx', text:'Tvinx'},
                    {key:'2linkme', text:'2linkme'},
                    {key:'twitthis', text:'TwitThis'},
                    {key:'typepad', text:'Typepad'},
                    {key:'upnews', text:'Upnews.it'},
                    {key:'urlaubswerkde', text:'Urlaubswerk'},
                    {key:'urlcapt', text:'URLCapt'},
                    {key:'viadeo', text:'Viadeo'},
                    {key:'virb', text:'Virb'},
                    {key:'visitezmonsite', text:'Visitez Mon Site'},
                    {key:'vk', text:'Vkontakte'},
                    {key:'vkrugudruzei', text:'vKruguDruzei'},
                    {key:'voxopolis', text:'VOXopolis'},
                    {key:'vybralisme', text:'vybrali SME'},
                    {key:'vyoom', text:'Vyoom'},
                    {key:'webnews', text:'Webnews'},
                    {key:'webshare', text:'WebShare'},
                    {key:'werkenntwen', text:'Wer Kennt Wen'},
                    {key:'domaintoolswhois', text:'Whois Lookup'},
                    {key:'windows', text:'Windows Gadgets'},
                    {key:'windycitizen', text:'Windy Citizen'},
                    {key:'wirefan', text:'WireFan'},
                    {key:'wordpress', text:'WordPress'},
                    {key:'worio', text:'Worio'},
                    {key:'wowbored', text:'WowBored'},
                    {key:'raiseyourvoice', text:'Write Politicians'},
                    {key:'wykop', text:'Wykop'},
                    {key:'xanga', text:'Xanga'},
                    {key:'xing', text:'XING'},
                    {key:'yahoobkm', text:'Y! Bookmarks'},
                    {key:'yahoomail', text:'Y! Mail'},
                    {key:'100zakladok', text:'100zakladok'},
                    {key:'yardbarker', text:'Yardbarker'},
                    {key:'yemle', text:'Yemle'},
                    {key:'yigg', text:'Yigg'},
                    {key:'yookos', text:'Yookos'},
                    {key:'yoolink', text:'Yoolink'},
                    {key:'yorumcuyum', text:'Yorumcuyum'},
                    {key:'youblr', text:'Youblr.'},
                    {key:'youbookmarkss', text:'Youbookmarks'},
                    {key:'youmob', text:'YouMob'},
                    {key:'yuuby', text:'Yuuby'},
                    {key:'zakladoknet', text:'Zakladok.net'},
                    {key:'ziczac', text:'ZicZac'},
                    {key:'zingme', text:'ZingMe'},
                    {key:'adfty', text:'Adfty'}
                  ],
                  initialValue: this.properties.services,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'socialShareServicesField'
                }),
                PropertyPaneToggle('yammer', {
                  label: strings.Yammer
                }),
                PropertyPaneToggle('linkedin', {
                  label: strings.Linkedin
                }),
                PropertyPaneToggle('twitter', {
                  label: strings.Twitter
                }),
                PropertyPaneToggle('facebook', {
                  label: strings.Facebook
                }),
                PropertyPaneToggle('googlePlus', {
                  label: strings.GooglePlus
                }),
                PropertyPaneToggle('more', {
                  label: strings.More
                }),
                PropertyPaneToggle('count', {
                  label: strings.Count
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

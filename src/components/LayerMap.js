import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, withStateHandlers } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';

// Custom Components
import LayerMapSwitches from './LayerMapSwitches';

// Helpers
import GOOGLE_MAPS_API from '../utils/constants';
import Client from '../utils/feathers';
import ClientMerchant from '../utils/feathers_merchants';

// Images
import MerchantPin from '../assets/img/map/merchant_pin.png';
import AmbassadorPin from '../assets/img/map/ambassador_pin.png';

/**
 * This object is used for type checking the props of the component.
 */
const propTypes = {
  ambassadors: PropTypes.array,
  merchants: PropTypes.array,
  mapCenter: PropTypes.object,
  mapZoom: PropTypes.number,
  // Fix google maps modal problem
  showControls: PropTypes.bool
};

const locationObj = {"5b6235288b12017c6257536d":{"lat":30.274084,"lon":120.15507},"5b6235288b12017c6257536c":{"lat":-22.9697777,"lon":-43.1868592},"5b6235288b12017c625753b0":{"lat":37.9759033,"lon":22.9774589},"5b6235288b12017c6257538f":{"lat":37.9386365,"lon":22.9322383},"5b6235288b12017c6257536e":{"lat":37.9838096,"lon":23.7275388},"5b6235288b12017c62575372":{"lat":51.1078852,"lon":17.0385376},"5b6235288b12017c625753af":{"lat":50.0755381,"lon":14.4378005},"5b6235288b12017c62575368":{"lat":53.90453979999999,"lon":27.5615244},"5b6235288b12017c625753a9":{"lat":46.482526,"lon":30.7233095},"5b6235288b12017c625753ba":{"lat":42.2808256,"lon":-83.7430378},"5b6235288b12017c6257539a":{"lat":42.331427,"lon":-83.0457538},"5b6235288b12017c62575383":{"lat":55.947064,"lon":37.4992755},"5b6235288b12017c625753b6":{"lat":51.2980824,"lon":37.8379593},"5b6235288b12017c62575373":{"lat":51.2824173,"lon":37.5434951},"5b6235288b12017c625753b5":{"lat":53.4129429,"lon":59.00162330000001},"5b6235288b12017c62575369":{"lat":51.8857552,"lon":26.8427098},"5b6235288b12017c62575399":{"lat":50.6199,"lon":26.251617},"5b6235288b12017c62575374":{"lat":47.2357137,"lon":39.701505},"5b6235288b12017c6257538e":{"lat":45.8150108,"lon":15.9819189},"5b6235288b12017c62575370":{"lat":56.6511091,"lon":23.7213541},"5b6235288b12017c6257536f":{"lat":19.0759837,"lon":72.8776559},"5b6235288b12017c6257538b":{"lat":37.8043637,"lon":-122.2711137},"5b6235288b12017c6257539d":{"lat":32.715738,"lon":-117.1610838},"5b6235288b12017c6257537c":{"lat":-12.0463731,"lon":-77.042754},"5b6235288b12017c62575388":{"lat":48.574041,"lon":39.307815},"5b6235288b12017c62575377":{"lat":52.3679843,"lon":4.9035614},"5b6235288b12017c62575371":{"lat":47.0272282,"lon":28.8263789},"5b6235288b12017c625753a0":{"lat":53.3498053,"lon":-6.2603097},"5b6235288b12017c62575395":{"lat":43.60280789999999,"lon":39.7341543},"5b6235288b12017c62575398":{"lat":52.48624299999999,"lon":-1.890401},"5b6235288b12017c625753a1":{"lat":3.139003,"lon":101.686855},"5b6235288b12017c625753ad":{"lat":30.267153,"lon":-97.7430608},"5b6235288b12017c62575389":{"lat":33.7489954,"lon":-84.3879824},"5b6235288b12017c62575387":{"lat":13.7563309,"lon":100.5017651},"5b6235288b12017c625753b8":{"lat":58.587745,"lon":16.192421},"5b6235288b12017c6257537f":{"lat":36.4340533,"lon":28.2176379},"5b6235288b12017c62575391":{"lat":20.6596988,"lon":-103.3496092},"5b6235288b12017c62575390":{"lat":40.9875181,"lon":14.1640355},"5b6235288b12017c625753a3":{"lat":39.74953310000001,"lon":-8.807682999999999},"5b6235288b12017c625753a5":{"lat":59.9342802,"lon":30.3350986},"5b6235288b12017c62575367":{"lat":52.4411761,"lon":30.9878461},"5b6235288b12017c6257538c":{"lat":53.07929619999999,"lon":8.8016936},"5b6235288b12017c6257536b":{"lat":43.653226,"lon":-79.3831843},"5b6235288b12017c625753bc":{"lat":26.1420358,"lon":-81.7948103},"5b6235288b12017c625753ac":{"lat":27.3364347,"lon":-82.53065269999999},"5b6235288b12017c6257538a":{"lat":26.640628,"lon":-81.8723084},"5b6235288b12017c625753b9":{"lat":50.4501,"lon":30.5234},"5b6235288b12017c6257539b":{"lat":44.977753,"lon":-93.2650108},"5b6235288b12017c6257536a":{"lat":-22.8858975,"lon":-43.1152211},"5b6235288b12017c625753a2":{"lat":47.88639879999999,"lon":106.9057439},"5b6235288b12017c62575384":{"lat":55.755826,"lon":37.6172999},"5b6235288b12017c6257537b":{"lat":40.7607793,"lon":-111.8910474},"5b6235288b12017c62575366":{"lat":40.40926169999999,"lon":49.8670924},"5b6235288b12017c62575378":{"lat":48.379433,"lon":31.1655799},"5b6235288b12017c6257539c":{"lat":44.7971939,"lon":-106.9561791},"5b6235288b12017c6257539e":{"lat":9.9906919,"lon":-84.667374},"5b64aa4636a1605e5268e731":{"lat":4.710988599999999,"lon":-74.072092},"5b6235288b12017c625753a4":{"lat":54.7104264,"lon":20.4522144},"5b6235288b12017c625753b1":{"lat":35.6894875,"lon":139.6917064},"5b6235288b12017c62575382":{"lat":14.5995124,"lon":120.9842195},"5b6235288b12017c625753a8":{"lat":36.8064948,"lon":10.1815316},"5b6235288b12017c6257537d":{"lat":49.2827291,"lon":-123.1207375},"5b6235288b12017c625753b3":{"lat":33.6844202,"lon":73.04788479999999},"5b6235288b12017c6257537a":{"lat":34.7464809,"lon":-92.28959479999999},"5b6235288b12017c62575392":{"lat":5.0377396,"lon":7.9127945},"5b6235288b12017c625753a6":{"lat":51.6754966,"lon":39.2088823},"5b6235288b12017c62575381":{"lat":20.3951106,"lon":-99.9856344},"5b6235288b12017c625753a7":{"lat":41.3850639,"lon":2.1734035},"5b6235288b12017c62575375":{"lat":54.3181598,"lon":48.3837915},"5b6235288b12017c625753bd":{"lat":10.4805937,"lon":-66.90360629999999},"5b8ff695758d8900190e0871":{"lat":-36.8484597,"lon":174.7633315},"5b6235288b12017c62575380":{"lat":43.2220146,"lon":76.8512485},"5b6235288b12017c62575385":{"lat":56.85872140000001,"lon":35.9175965},"5b6235288b12017c62575397":{"lat":28.0849625,"lon":-17.3338839},"5b6235288b12017c625753b7":{"lat":-29.85868039999999,"lon":31.0218404},"5b6235288b12017c62575396":{"lat":-33.9248685,"lon":18.4240553},"5b6235288b12017c62575386":{"lat":-26.2041028,"lon":28.0473051},"5b6235288b12017c62575376":{"lat":-33.9608369,"lon":25.6022423},"5ba531ab758d8900190e0873":{"lat":50.827845,"lon":12.9213697},"5b6235288b12017c625753bb":{"lat":40.8509333,"lon":-73.9701381},"5b6235288b12017c625753b4":{"lat":18.4655394,"lon":-66.1057355},"5b6235288b12017c62575393":{"lat":18.3401514,"lon":-67.24994590000001},"5b6235288b12017c62575394":{"lat":51.6571864,"lon":35.6783297},"5b6235288b12017c625753aa":{"lat":39.7392358,"lon":-104.990251},"5b6235288b12017c62575379":{"lat":38.8338816,"lon":-104.8213634},"5b6235288b12017c625753ab":{"lat":34.0522342,"lon":-118.2436849},"5b6235288b12017c625753b2":{"lat":20.653407,"lon":-105.2253316}};

/**
 * This object sets default values to the optional props.
 */
const defaultProps = {
  mapCenter: { lat: -22.9068, lng: -43.1729 },
  mapZoom: 12,
  googleMapURL:
  `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API}&v=3.exp&libraries=geometry,drawing,places`,
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div style={{ height: `100%` }} />,
  mapElement: <div style={{ height: `400px` }} />,
  // Fix google maps modal problem
  showControls: true,
};
defaultProps['markers'] = [
  defaultProps.mapCenter
];

/**
 * Map that support Merchant Layer Markers and Ambassadors Layer Markers.
 */
const CustomLayerMap = compose(
  withStateHandlers(() => ({
    isOpenObj: {},
    isOpenAmbassadorObj:{}
  }), {
    onToggleOpen: ({ isOpenObj }) => (index) => {
      const openObj = isOpenObj;
      openObj[index] = !openObj[index];
      return openObj;
    },
    onToggleAmbassadorOpen: ({ isOpenAmbassadorObj }) => (index) => {
      const openObj = isOpenAmbassadorObj;
      openObj[index] = !openObj[index];
      return openObj;
    }
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={props.mapZoom}
    defaultCenter={props.mapCenter}
  >
    <MarkerClusterer
        averageCenter
        enableRetinaIcons
        gridSize={60}
        zoomOnClick={true}
        imagePath='http://www.luminiasoft.com/images/merchant_cluster'
      >
      {props.ambassadors.map( (marker, index) => (
        marker.withInfo ? (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={AmbassadorPin}
            onClick={() => props.onToggleOpen(index)}
          >
            {props.isOpenObj[index] && <InfoWindow onCloseClick={() => props.onToggleOpen(index)}>
              <div>
                <div style={{ font: "bold 16px Georgia, serif" }}>{marker.infoTitle}</div>
                <br />
                <div style={{ font: "14px Georgia, serif" }}>{marker.infoDescription}</div>
              </div>
            </InfoWindow>}
          </Marker>
        ) : (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={AmbassadorPin}
          />
        )
      ))}
    </MarkerClusterer>
    <MarkerClusterer
        averageCenter
        enableRetinaIcons
        gridSize={60}
        zoomOnClick={true}
        imagePath='http://www.luminiasoft.com/images/ambassador_cluster'
      >
        {props.merchants.map( (marker, index) => (
          marker.withInfo ? (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={MerchantPin}
              onClick={() => props.onToggleAmbassadorOpen(index)}
            >
              {props.isOpenAmbassadorObj[index] && <InfoWindow onCloseClick={() => props.onToggleAmbassadorOpen(index)}>
                <div>
                  <div style={{ font: "bold 16px Georgia, serif" }}>{marker.infoTitle}</div>
                  <br />
                  <div style={{ font: "14px Georgia, serif" }}>{marker.infoDescription}</div>
                </div>
              </InfoWindow>}
            </Marker>
          ) : (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={MerchantPin}
            />
          )
        ))}
    </MarkerClusterer>
  </GoogleMap>
);

// Type checking the props of the component
CustomLayerMap.propTypes = propTypes;
// Assign default values to the optional props
CustomLayerMap.defaultProps = defaultProps;

/**
 * This object is used for type checking the props of the component.
 */
const propTypesLayerMap = {
  ambassadorsLayer: PropTypes.bool,
  merchantsLayer: PropTypes.bool,
  showControls: PropTypes.bool,
  mapHeight: PropTypes.string
};

class LayerMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ambassadors: [],
      merchants: [],
      ambassadorLayer: this.props.ambassadorsLayer,
      merchantLayer: this.props.merchantsLayer
    };
  }

  /**
   * @description Lifecycle event handler called just after the App loads into the DOM.
   */
  UNSAFE_componentWillMount() {
    this.getAmbassadors();
    this.getMerchants();
  }

  /**
   * @description Get the ambassadors list from the web service.
   * @param {string} id - Merchant ID.
   */
  getAmbassadors = () => {
    const app = this;
    const ambassadors = Client.service('api/v1/ambassadors');

    this.setState({loading: true});

    ambassadors.find().then( (results) => {
      const markers = results.data.map(ambassador => {
        if(locationObj[ambassador.cityId]){
        const marker = {
          lat: locationObj[ambassador.cityId].lat,
          lng: locationObj[ambassador.cityId].lon,
          withInfo: true,
          infoTitle: ambassador.nickname,
          infoDescription: `${ambassador.city} - ${ambassador.country}`,
        };
        return marker;
      }
      });

      // Once both return, update the state
      app.setState({
        ambassadors: markers,
        loading: false
      });
    }).catch( error => {
      app.setState({responseError: error.message, loading: false});
    });
  };

  /**
   * @description Get the merchants list from the web service.
   * @param {string} id - Merchant ID.
   */
  getMerchants = () => {
    const app = this;
    const merchants = ClientMerchant.service('api/v1/merchants');

    this.setState({loading: true});

    merchants.find().then( (results) => {
      const markers = results.data.map(merchant => {
        const marker = {
          lat: merchant.lat,
          lng: merchant.lon,
          withInfo: true,
          infoTitle: merchant.name,
          infoDescription: `${merchant.address}, ${merchant.city} - ${merchant.country}`,
        };
        return marker;
      });

      // Once both return, update the state
      app.setState({
        merchants: markers,
        loading: false
      });
    }).catch( error => {
      app.setState({responseError: error.message, loading: false});
    });
  };

  handleLayerChange = name => event => {
    this.setState({ [name]: event.target.checked });
    // Update any time changes
    this.getAmbassadors();
    this.getMerchants();
  };

  render() {
    // create an array with marker components

    return (
      <div>
        {!this.props.showControls ? (
          <LayerMapSwitches
            ambassadors={this.state.ambassadorLayer}
            merchants={this.state.merchantLayer}
            ambsMap={this.props.ambsMap}
            onChange={this.handleLayerChange}
          />
        ) : (
          <div style={{ height: 56 }}></div>
        )}
        <CustomLayerMap
          ambassadors={this.state.ambassadorLayer ? this.state.ambassadors: []}
          merchants={this.state.merchantLayer ? this.state.merchants: []}
          mapZoom={3}
          mapCenter={{ lat: 0, lng: 0 }}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: this.props.mapHeight ? this.props.mapHeight: '400px' }} />}
        />
      </div>
    );
  }
}

// Type checking the props of the component
LayerMap.propTypes = propTypesLayerMap;

export default LayerMap;

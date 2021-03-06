import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

// Custom components
import AppHeader from '../AppHeader';
import Footer from '../Footer';
import EnhancedTable from '../EnhancedTable';
import LayerMap from '../LayerMap';
import PreviewMap from '../PreviewMap';

// Helpers
import Client from '../../utils/feathers';
import { stripProtocol } from '../../utils/url';
import Countries from 'country-list';

// Images
import AmbassadorPin from '../../assets/img/map/ambassador_pin.png';
import LoadingGif from '../../assets/img/loading_icon.gif';



import GOOGLE_MAPS_API from '../../utils/constants';

const googleMapsClient = require('@google/maps').createClient({
  key: GOOGLE_MAPS_API
});

// List of countries
const countries = Countries();

const centerStyle = {
  textAlign: 'center',
  marginTop: 20,
  marginBottom: 20
};

const loadingStyle = {
  textAlign: 'center',
  marginTop: 20,
  marginBottom: 20,
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto'
};

const mapsStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    minWidth              : '300px'
  }
};

const columnData = [
  { id: 'nickname', numeric: false, disablePadding: true, label: 'Nickname' },
  { id: 'location', numeric: false, disablePadding: true, label: 'Location' },
  { id: 'telegram', numeric: false, disablePadding: false, label: 'Telegram Account' },
  { id: 'keybase', numeric: false, disablePadding: false, label: 'Keybase' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
  // { id: 'link', numeric: false, disablePadding: false, label: 'URL' },
  { id: 'map', numeric: false, disablePadding: false, label: 'Maps', disableSearch: true}
];

/**
 * Ambassador page component.
 */
class AmbassadorsPage extends Component {
  constructor(props, context) {
    super(props, context);

    /** @type {ComponentState} */
    this.state = {
      ambassadors: {
        total: 0,
        limit: 0,
        skip: 0,
        data: []
      },
      loading: true,
      rowsPerPage: [100,200,300],
      numberOfRows: 100,
      page: 1,
      total: undefined,
      mapsModalIsOpen: false,
      mapsTitle: '',
      mapsDescription: '',
      mapsLat: 0,
      mapsLon: 0,
      cities: {}
    };
  }

  /**
   * Geocode an address.
   * @param address
   */
  async geocodeAddress(data) {
    const app = this;
    let aqq = {};
    return data.map( async ambassador => {
      const address = `{${ambassador.city} - ${ambassador.country}`;
      googleMapsClient.geocode({
      address
    }, function(err, response) {
      const state = { loading: false, loadingText: ''};
      if(err) {
        state.resolvedGeoCode = false;
        state.geocodingErrorMessage = 'Geocoding Error';
        state.lat = null;
        state.lon = null;
      }
      else {
        state.resolvedGeoCode = true;
        state.geocodingErrorMessage = '';
        const location = response.json.results[0].geometry.location;
        const aw = {};
        aw[ambassador.cityId] = {};
        aw[ambassador.cityId].lat = location.lat;
        aw[ambassador.cityId].lon = location.lng;
        aqq = { ...aw, ...aqq};
        console.log('--------------------------')
        console.log(JSON.stringify(aqq));
        app.setState({ cities: { ...aw, ...this.state.cities} });

      }
    });
      return ambassador;
    });


  }

  /**
   * @description Lifecycle event handler called just after the App loads into the DOM.
   */
  UNSAFE_componentWillMount() {
    // Get the ambassadors list
    this.getAmbassadors();
  }

  fillResults(result) {
    const data = result;
    return (item) => data.data.push(item);
  }

  /**
   * @description Get ambassadors from the web service
   * @param {number} [limit=10] - Max items to be returned.
   * @param {number} [skip=0] - Start index search
   */
  getAmbassadors = async (limit = 50, skip = 0) => {
    const app = this;
    // Initially we don't know how much the total value is, so to make sure we enter the loop
    // at least once we're just setting it to be 1
    let total = 1;

    const ambassadors = Client.service('api/v1/ambassadors');
    this.setState({loading: true});
    let result;
    while(skip < total){
      let partialResponse = await ambassadors.find({
        query: {
          $sort: { account: 1 },
          $limit: limit,
          $skip: skip
        }
      });
      total = partialResponse.total;
      result === undefined ? result = partialResponse : partialResponse.data.map(this.fillResults(result));
      skip = skip + limit;
    }

    result.data.forEach(function(ambassador){
      if(ambassador.city !== undefined) ambassador.city = (ambassador.city).replace(/(^|\s)\S/g, l => l.toUpperCase());
      if(ambassador.country !== undefined) ambassador.country = countries.getName(ambassador.country);
      // Setup disabled to be string
      ambassador.disabled = (ambassador.disabled) ? 'yes': '';
    });

    // Once both return, update the state
    app.setState({loading: false, ambassadors: result});
  };

  /**
   * @description Close Maps modal.
   */
  closeMapsModal() {
     this.setState({
       mapsLat: 0,
       mapsLon: 0,
       mapsModalIsOpen: false
     });
  }

  openMaps(name, address, lat, lon){
    this.setState({
      mapsTitle: name,
      mapsDescription: address,
      mapsLat: lat,
      mapsLon: lon,
      mapsModalIsOpen: true
    });
  }

  render() {
    const { data } = this.state.ambassadors;

    console.log(data);

      const city = this.geocodeAddress(data);
      console.log('ola');
      console.log(this.state.cities);




    // Works for both v0, v1 and v2 API response
    /*
    data.map(ambassador => {
      let cities = [];
      // V0/V1
      if(ambassador.city) {
        if(ambassador.lat){
          cities.push({
              city: ambassador.city,
              country: ambassador.country,
              lat: ambassador.lat,
              lon: ambassador.lon
            }
          );
        }
        else{
          cities.push({
              city: ambassador.city,
              country: ambassador.country,
              lat: ambassador.lat,
              lon: ambassador.lon
            }
          );
        }

      }
      // v2
      else {
        cities = ambassador.cities;
      }
      cities.forEach( location => {
        ambassador.location = `${location.city} - ${location.country}`;
        ambassador.map = <Button
          className="App-button"
          variant="contained"
          style={{
              backgroundColor: "#2069b3",
              color: 'white'
          }}
          onClick={() => this.openMaps(
            ambassador.nickname,
            `${location.city} - ${location.country}`,
            location.lat,
            location.lon
          )}
        >Show on Map
        </Button>;
      });

      /*ambassador.link = <a target="_blank" rel="noopener noreferrer"
        href={ambassador.url}>{stripProtocol(ambassador.url)}</a>;

      return ambassador;
    });*/

    return (
      <div>{JSON.stringify(this.state.cities)}</div>
    );
  }
}

export { AmbassadorsPage };
